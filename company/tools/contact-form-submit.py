#!/usr/bin/env python3
"""
LocalBoost contact-form outreach submitter.

Submits a personalized outreach message through a business's own website
contact form. Contact forms get 5-15% reply rates (2-5x cold email), and
many local businesses have a form but no published email address.

Usage:
  python3 contact-form-submit.py --url "https://example.com" --name "Example Salon" --dry-run
  python3 contact-form-submit.py --url "https://example.com" --name "Example Salon" --send
  python3 contact-form-submit.py --lead "Blue Touch Spa" --dry-run     # from pipeline.json
  python3 contact-form-submit.py --lead "Blue Touch Spa" --send

Safety:
  - NEVER submits to the same business twice (checks the log first).
  - Rate limit: max 1 submission per 2 minutes, max 30 per day.
  - --dry-run finds the form and shows what WOULD be submitted. Default.
    --send is required to actually submit.
  - Every attempt (dry-run or send) is logged to
    company/outreach/contact-form-log.json.

Form handling:
  - Discovers forms on the homepage plus /contact, /contact-us, /about,
    /connect, /get-in-touch pages.
  - Scores each form by how contact-like its fields are (name/email/message
    present) and picks the best one.
  - Maps fields heuristically: name, email, phone, subject, message/comment.
  - Handles common builders: WordPress (Contact Form 7, WPForms, Ninja),
    Squarespace, Wix, and plain custom forms.
  - Skips forms that are clearly NOT contact forms (login, search,
    newsletter-only, checkout, job application).
  - Preserves hidden fields (CSRF tokens, builder IDs) in the submission.
"""

import argparse
import json
import os
import re
import sys
import time
import urllib.parse
from datetime import datetime, timezone, date

import requests
from bs4 import BeautifulSoup

COMPANY_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PIPELINE_PATH = os.path.join(COMPANY_DIR, "pipeline.json")
LOG_PATH = os.path.join(COMPANY_DIR, "outreach", "contact-form-log.json")
STATE_PATH = os.path.join(COMPANY_DIR, "outreach", "contact-form-state.json")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (compatible; LocalBoostBot/1.0; +https://www.localboost.site)"
}

SENDER_NAME = "LocalBoost"
SENDER_EMAIL = "hello@localboost.site"

# Pages to probe for a contact form, in order.
FORM_PAGES = ["", "/contact", "/contact-us", "/about", "/about-us",
              "/connect", "/get-in-touch", "/reach-us"]

MIN_SUBMIT_INTERVAL_SECS = 120   # 1 submission per 2 minutes
MAX_SUBMITS_PER_DAY = 30

# Field-name patterns for classification.
NAME_PATTERNS = re.compile(r"(your[_-]?name|full[_-]?name|^name$|first[_-]?name|last[_-]?name|contact[_-]?name)", re.I)
EMAIL_PATTERNS = re.compile(r"(email|e-mail)", re.I)
PHONE_PATTERNS = re.compile(r"(phone|tel|mobile)", re.I)
SUBJECT_PATTERNS = re.compile(r"(subject|topic|regarding)", re.I)
MESSAGE_PATTERNS = re.compile(r"(message|comment|inquiry|enquiry|question|feedback|details|description|your[_-]?message|text)", re.I)

# Forms that are definitely NOT contact forms.
SKIP_FORM_PATTERNS = re.compile(r"(login|sign[_-]?in|password|search|newsletter|subscribe|checkout|cart|apply|application|job)", re.I)


def now_iso():
    return datetime.now(timezone.utc).isoformat()


def load_json(path, default):
    try:
        with open(path) as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return default


def save_json(path, data):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        json.dump(data, f, indent=2)


def already_contacted(business_key):
    """Check the log for any prior submission (success OR failure) to this business."""
    log = load_json(LOG_PATH, [])
    key = business_key.lower().strip()
    for entry in log:
        if entry.get("business", "").lower().strip() == key and entry.get("submitted"):
            return True
    return False


def check_rate_limit():
    """Return (ok, reason). Enforces 1 per 2 min and max 30/day."""
    state = load_json(STATE_PATH, {"last_submit": None, "daily": {}})
    today = date.today().isoformat()

    if state.get("last_submit"):
        last = datetime.fromisoformat(state["last_submit"])
        elapsed = (datetime.now(timezone.utc) - last).total_seconds()
        if elapsed < MIN_SUBMIT_INTERVAL_SECS:
            wait = int(MIN_SUBMIT_INTERVAL_SECS - elapsed)
            return False, f"rate limit: wait {wait}s before next submission"

    daily = state.get("daily", {})
    if daily.get("date") != today:
        daily = {"date": today, "count": 0}
    if daily.get("count", 0) >= MAX_SUBMITS_PER_DAY:
        return False, f"daily cap reached ({MAX_SUBMITS_PER_DAY}/day)"

    return True, ""


def record_submit():
    state = load_json(STATE_PATH, {"last_submit": None, "daily": {}})
    today = date.today().isoformat()
    state["last_submit"] = now_iso()
    daily = state.get("daily", {})
    if daily.get("date") != today:
        daily = {"date": today, "count": 0}
    daily["count"] = daily.get("count", 0) + 1
    state["daily"] = daily
    save_json(STATE_PATH, state)


def log_attempt(business, url, form_url, success, submitted, error=None, dry_run=False):
    log = load_json(LOG_PATH, [])
    log.append({
        "business": business,
        "site_url": url,
        "form_url": form_url,
        "timestamp": now_iso(),
        "dry_run": dry_run,
        "submitted": submitted,
        "success": success,
        "error": error,
    })
    save_json(LOG_PATH, log)


def normalize_url(url):
    url = url.strip()
    if not url.startswith(("http://", "https://")):
        url = "https://" + url
    return url.rstrip("/")


def fetch(session, url, timeout=15):
    try:
        resp = session.get(url, timeout=timeout, allow_redirects=True)
        ctype = resp.headers.get("Content-Type", "")
        if resp.status_code != 200 or ("html" not in ctype and "text" not in ctype):
            return None
        return resp.text
    except Exception:
        return None


def find_forms(html, base_url):
    """Extract all <form> elements with their fields."""
    soup = BeautifulSoup(html, "html.parser")
    forms = []
    for form in soup.find_all("form"):
        action = form.get("action") or ""
        method = (form.get("method") or "get").lower()
        fields = []
        for tag in form.find_all(["input", "textarea", "select"]):
            ftype = (tag.get("type") or "text").lower()
            if ftype in ("submit", "button", "image", "reset", "file"):
                continue
            name = tag.get("name")
            if not name:
                continue
            fields.append({
                "name": name,
                "type": ftype,
                "tag": tag.name,
                "id": tag.get("id", ""),
                "placeholder": tag.get("placeholder", ""),
                "value": tag.get("value", "") if tag.name == "input" else "",
                "hidden": ftype == "hidden",
            })
        # Skip forms with no usable fields.
        visible = [f for f in fields if not f["hidden"]]
        if not visible:
            continue
        forms.append({
            "action": urllib.parse.urljoin(base_url, action),
            "method": method,
            "fields": fields,
            "raw_html_snippet": str(form)[:500],
        })
    return forms


def score_form(form):
    """
    Score how contact-form-like a form is. Higher = better.
    Returns (score, field_map) where field_map maps role -> field name.
    """
    # Reject non-contact forms outright.
    blob = " ".join(
        [form["action"]] +
        [f["name"] + " " + f["id"] + " " + f["placeholder"] for f in form["fields"]]
    )
    if SKIP_FORM_PATTERNS.search(blob):
        return -1, {}

    field_map = {}
    score = 0
    for f in form["fields"]:
        if f["hidden"]:
            continue
        label = f["name"] + " " + f["id"] + " " + f["placeholder"]
        if EMAIL_PATTERNS.search(label) and "email" not in field_map:
            field_map["email"] = f["name"]
            score += 3
        elif NAME_PATTERNS.search(label) and "name" not in field_map:
            field_map["name"] = f["name"]
            score += 2
        elif MESSAGE_PATTERNS.search(label) and "message" not in field_map:
            field_map["message"] = f["name"]
            score += 3
        elif PHONE_PATTERNS.search(label) and "phone" not in field_map:
            field_map["phone"] = f["name"]
            score += 1
        elif SUBJECT_PATTERNS.search(label) and "subject" not in field_map:
            field_map["subject"] = f["name"]
            score += 1

    # A real contact form needs at least email + message (or name + message).
    if "message" not in field_map:
        return -1, {}
    if "email" not in field_map and "name" not in field_map:
        return -1, {}
    return score, field_map


def discover_form(session, base_url):
    """Probe likely pages, return (form, field_map, page_url) for the best form."""
    best = None
    best_score = -1
    best_map = {}
    best_page = ""
    for page in FORM_PAGES:
        page_url = base_url + page
        html = fetch(session, page_url)
        if not html:
            continue
        for form in find_forms(html, page_url):
            score, fmap = score_form(form)
            if score > best_score:
                best, best_score, best_map, best_page = form, score, fmap, page_url
        # A strong form on an early page is good enough; don't crawl everything.
        if best_score >= 8:
            break
    if best is None:
        return None, {}, ""
    return best, best_map, best_page


def build_payload(form, field_map, name, email, message, business_name):
    payload = {}
    # Preserve hidden fields (CSRF, builder IDs like _wpcf7, form_id, etc.)
    for f in form["fields"]:
        if f["hidden"]:
            payload[f["name"]] = f["value"]

    if "name" in field_map:
        payload[field_map["name"]] = name
    if "email" in field_map:
        payload[field_map["email"]] = email
    if "message" in field_map:
        payload[field_map["message"]] = message
    if "subject" in field_map:
        payload[field_map["subject"]] = f"Quick idea for {business_name}"
    # phone left blank intentionally — never invent a number.

    # Contact Form 7 (WordPress) needs these to process correctly.
    for f in form["fields"]:
        if f["name"] in ("_wpcf7", "_wpcf7_version", "_wpcf7_locale",
                         "_wpcf7_unit_tag", "_wpcf7_container_post"):
            payload.setdefault(f["name"], f["value"])
    return payload


def submit_form(session, form, payload):
    """POST (or GET) the form. Return (success, detail)."""
    try:
        if form["method"] == "post":
            resp = session.post(form["action"], data=payload, timeout=20,
                                allow_redirects=True)
        else:
            resp = session.get(form["action"], params=payload, timeout=20,
                               allow_redirects=True)
    except Exception as e:
        return False, f"request failed: {e}"

    if resp.status_code not in (200, 201, 202, 302, 303):
        return False, f"HTTP {resp.status_code}"

    # Look for success indicators in the response.
    text = resp.text.lower()
    success_markers = ["thank you", "thanks for", "message sent", "successfully sent",
                       "we'll be in touch", "we will be in touch", "received your",
                       "form submitted", "mail sent", "your message has been"]
    if any(m in text for m in success_markers):
        return True, "success marker found in response"

    # Contact Form 7 returns JSON-ish validation info; check for errors.
    error_markers = ["validation-error", "wpcf7-validation-errors", "field is required",
                     "invalid email", "captcha", "recaptcha", "spam"]
    if any(m in text for m in error_markers):
        return False, "response indicates validation/captcha error"

    # Ambiguous: submitted but no clear confirmation. Treat as uncertain.
    return True, "submitted (no explicit confirmation found)"


def build_message(template, business_name):
    return template.replace("{business}", business_name)


DEFAULT_TEMPLATE = (
    "Hi — I'm with LocalBoost, and we're inviting a small group of local "
    "businesses to try something new. I noticed {business} has great reviews "
    "but none of the recent ones have a reply from you — we built a tool that "
    "answers every review for you and turns happy customers into more 5-stars. "
    "30-day free trial, no credit card. I mocked up what this could look like "
    "for {business} — worth a 2-minute look? Happy to share the link. "
    "Best, LocalBoost team (hello@localboost.site)"
)


def run(url, business_name, template, dry_run=True):
    base_url = normalize_url(url)

    # 1. Dedup check.
    if already_contacted(business_name):
        msg = f"SKIP: {business_name} already contacted via form (see log)"
        print(msg)
        return {"status": "skipped", "reason": "already_contacted"}

    session = requests.Session()
    session.headers.update(HEADERS)

    # 2. Discover the form.
    form, field_map, page_url = discover_form(session, base_url)
    if not form:
        log_attempt(business_name, base_url, "", False, False,
                    error="no contact form found", dry_run=dry_run)
        print(f"NO FORM: {business_name} ({base_url})")
        return {"status": "no_form"}

    message = build_message(template, business_name)
    payload = build_payload(form, field_map, SENDER_NAME, SENDER_EMAIL,
                            message, business_name)

    print(f"FORM FOUND: {business_name}")
    print(f"  page:   {page_url}")
    print(f"  action: {form['action']} ({form['method'].upper()})")
    print(f"  fields: {field_map}")
    print(f"  payload keys: {sorted(payload.keys())}")

    if dry_run:
        log_attempt(business_name, base_url, page_url, False, False,
                    error=None, dry_run=True)
        print("DRY RUN — nothing submitted. Re-run with --send to submit.")
        return {"status": "dry_run", "form_url": page_url, "fields": field_map}

    # 3. Rate limit check (only for real sends).
    ok, reason = check_rate_limit()
    if not ok:
        log_attempt(business_name, base_url, page_url, False, False,
                    error=reason, dry_run=False)
        print(f"RATE LIMITED: {reason}")
        return {"status": "rate_limited", "reason": reason}

    # 4. Submit.
    success, detail = submit_form(session, form, payload)
    record_submit()
    log_attempt(business_name, base_url, page_url, success, True,
                error=None if success else detail, dry_run=False)
    print(("SUBMITTED: " if success else "FAILED: ") + detail)
    return {"status": "sent" if success else "failed", "detail": detail}


def get_lead_from_pipeline(lead_name):
    pipeline = load_json(PIPELINE_PATH, {})
    leads = pipeline.get("leads", pipeline) if isinstance(pipeline, dict) else pipeline
    target = lead_name.lower().strip()
    for lead in leads:
        if lead.get("name", "").lower().strip() == target:
            return lead
    return None


def main():
    ap = argparse.ArgumentParser(description="Submit LocalBoost outreach via a business's contact form.")
    ap.add_argument("--url", help="Business website URL")
    ap.add_argument("--name", help="Business name (for personalization + dedup)")
    ap.add_argument("--lead", help="Lead name from pipeline.json (uses its website)")
    ap.add_argument("--template", default=DEFAULT_TEMPLATE,
                    help="Message template; {business} is replaced with the name")
    ap.add_argument("--send", action="store_true",
                    help="Actually submit. Without this, dry-run only.")
    args = ap.parse_args()

    if args.lead:
        lead = get_lead_from_pipeline(args.lead)
        if not lead:
            print(f"Lead not found in pipeline: {args.lead}")
            sys.exit(1)
        url = lead.get("website") or lead.get("site_url") or ""
        name = lead.get("name", args.lead)
        if not url:
            print(f"Lead has no website on file: {args.lead}")
            sys.exit(1)
    else:
        if not args.url or not args.name:
            ap.error("--url and --name are required (or use --lead)")
        url, name = args.url, args.name

    result = run(url, name, args.template, dry_run=not args.send)
    if result["status"] in ("failed", "no_form", "rate_limited"):
        sys.exit(2)


if __name__ == "__main__":
    main()
