#!/usr/bin/env python3
"""
LocalBoost email discovery — waterfall email finder for prospect leads.

Finds PUBLIC business contact emails for leads in pipeline.json.
Never guesses addresses; only returns emails actually observed on the
business's own website or in public indexes.

Waterfall (cheapest first, since Hunter credits are scarce):
  1. Website scrape (free): mailto: links + email regex on the business's
     own site, including /contact and /about pages.
  2. Hunter.io domain-search (1 credit, skipped unless HUNTER_API_KEY is set
     and the lead has a real domain).

Usage:
  python3 email-discover.py --lead "Blue Touch Spa"
  python3 email-discover.py --all-missing        # every scored lead with a website but no email
  python3 email-discover.py --lead "X" --dry-run # report without writing to pipeline

Writes to pipeline.json: lead["email"], lead["email_source"], lead["email_found_date"].
HUNTER_API_KEY is read from the environment, never from files.
"""

import argparse
import html
import json
import os
import re
import sys
import time
import urllib.request
import urllib.parse
from datetime import date

COMPANY_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PIPELINE_PATH = os.path.join(COMPANY_DIR, "pipeline.json")

EMAIL_RE = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
# Junk to exclude: file extensions caught by the regex, obvious non-contacts.
JUNK_SUFFIXES = (".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".css", ".js")
JUNK_LOCALPARTS = {"noreply", "no-reply", "donotreply", "do-not-reply", "example"}
GENERIC_LOCALPARTS = {"info", "contact", "hello", "support", "sales", "admin",
                      "office", "bookings", "booking", "reservations", "service"}

HEADERS = {"User-Agent": "Mozilla/5.0 (compatible; LocalBoostBot/1.0; +https://www.localboost.site)"}


def fetch(url, timeout=12):
    """Fetch a URL, return decoded text or None."""
    try:
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            ctype = resp.headers.get("Content-Type", "")
            if "html" not in ctype and "text" not in ctype:
                return None
            raw = resp.read(2_000_000)
            charset = resp.headers.get_content_charset() or "utf-8"
            return raw.decode(charset, errors="replace")
    except Exception:
        return None


def extract_emails(page_text, base_domain):
    """Pull candidate emails from page text. Returns [(email, context)]."""
    found = []
    # mailto: links first — highest signal
    for m in re.finditer(r'mailto:([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})',
                         page_text, re.IGNORECASE):
        found.append((m.group(1).lower(), "mailto"))
    # plain-text emails anywhere on the page
    for m in EMAIL_RE.finditer(html.unescape(page_text)):
        email = m.group(0).lower()
        if email.endswith(JUNK_SUFFIXES):
            continue
        local = email.split("@")[0]
        if local in JUNK_LOCALPARTS:
            continue
        found.append((email, "page-text"))
    # Prefer emails on the business's own domain, then generic roles anywhere
    def rank(item):
        email, ctx = item
        domain = email.split("@")[1]
        score = 0
        if base_domain and domain == base_domain:
            score += 3
        elif base_domain and domain.endswith("." + base_domain):
            score += 2
        if email.split("@")[0] in GENERIC_LOCALPARTS:
            score += 1
        if ctx == "mailto":
            score += 2
        return score
    dedup = {}
    for email, ctx in found:
        if email not in dedup or rank((email, ctx)) > rank(dedup[email]):
            dedup[email] = (email, ctx)
    return sorted(dedup.values(), key=rank, reverse=True)


def discover_from_website(website):
    """Scrape the business site + contact/about pages for emails."""
    if not website:
        return []
    if not website.startswith("http"):
        website = "http://" + website
    parsed = urllib.parse.urlparse(website)
    base_domain = parsed.netloc.lower().lstrip("www.")
    pages = [website]
    for path in ("/contact", "/contact-us", "/about", "/about-us"):
        pages.append(website.rstrip("/") + path)
    results = []
    seen = set()
    for url in pages:
        text = fetch(url)
        if not text:
            continue
        for email, ctx in extract_emails(text, base_domain):
            if email not in seen:
                seen.add(email)
                results.append({"email": email, "source": f"website:{ctx}",
                                "domain": base_domain})
        time.sleep(0.5)  # be polite
    return results


def discover_from_hunter(domain):
    """Hunter.io domain-search. Returns [] if no key or no domain."""
    api_key = os.environ.get("HUNTER_API_KEY", "").strip()
    if not api_key or not domain:
        return []
    # Skip obviously non-company domains (directories, socials)
    skip = ("facebook.com", "instagram.com", "yelp.com", "yellowpages.com",
            "business.site", "google.com", "hub.biz", "localsearch.com")
    if any(domain == s or domain.endswith("." + s) for s in skip):
        return []
    try:
        url = ("https://api.hunter.io/v2/domain-search?domain="
               + urllib.parse.quote(domain) + "&api_key=" + api_key)
        req = urllib.request.Request(url, headers=HEADERS)
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
    except Exception as e:
        return [{"error": f"hunter request failed: {e}"}]
    results = []
    for e in data.get("data", {}).get("emails", []):
        email = (e.get("value") or "").lower()
        if not email:
            continue
        results.append({
            "email": email,
            "source": "hunter.io",
            "confidence": e.get("confidence"),
            "type": e.get("type"),
        })
    return results


def discover_for_lead(lead):
    """Run the full waterfall for one lead. Returns list of candidates."""
    candidates = []
    website = (lead.get("website") or "").strip()
    domain = None
    if website:
        try:
            netloc = urllib.parse.urlparse(
                website if website.startswith("http") else "http://" + website
            ).netloc.lower().lstrip("www.")
            domain = netloc or None
        except Exception:
            pass
        candidates.extend(discover_from_website(website))
    candidates.extend(discover_from_hunter(domain))
    return candidates


def pick_best(candidates):
    """Pick the best public business email, preferring generic roles."""
    real = [c for c in candidates if "error" not in c]
    if not real:
        return None
    for c in real:
        if c["email"].split("@")[0] in GENERIC_LOCALPARTS:
            return c
    return real[0]


def load_pipeline():
    with open(PIPELINE_PATH) as f:
        return json.load(f)


def save_pipeline(p):
    with open(PIPELINE_PATH, "w") as f:
        json.dump(p, f, indent=2)


def main():
    ap = argparse.ArgumentParser(description="Discover public business emails for leads")
    g = ap.add_mutually_exclusive_group(required=True)
    g.add_argument("--lead", help="Exact lead name in pipeline.json")
    g.add_argument("--all-missing", action="store_true",
                   help="All leads with a website but no email on file")
    ap.add_argument("--dry-run", action="store_true",
                    help="Report only, do not write to pipeline.json")
    args = ap.parse_args()

    p = load_pipeline()
    leads = p["leads"]
    if args.lead:
        targets = [l for l in leads if l["name"] == args.lead]
        if not targets:
            print(f"No lead named {args.lead!r} in pipeline.json", file=sys.stderr)
            sys.exit(1)
    else:
        targets = [l for l in leads
                   if not l.get("email") and (l.get("website") or "").strip()
                   and l.get("stage") not in ("dead", "lost", "client")]

    print(f"Checking {len(targets)} lead(s)...")
    hunter_on = bool(os.environ.get("HUNTER_API_KEY", "").strip())
    print(f"Hunter.io: {'enabled' if hunter_on else 'disabled (no HUNTER_API_KEY)'}")
    found_count = 0
    for lead in targets:
        name = lead["name"]
        candidates = discover_for_lead(lead)
        best = pick_best(candidates)
        if best:
            found_count += 1
            print(f"  FOUND {name}: {best['email']} ({best['source']})")
            if not args.dry_run:
                lead["email"] = best["email"]
                lead["email_source"] = best["source"]
                lead["email_found_date"] = date.today().isoformat()
                if best.get("confidence"):
                    lead["email_confidence"] = best["confidence"]
        else:
            print(f"  none  {name}")
        time.sleep(1)  # rate-limit politeness between leads
    if not args.dry_run:
        save_pipeline(p)
        print(f"Wrote {found_count} email(s) to pipeline.json")
    else:
        print(f"(dry run) {found_count} email(s) would be written")


if __name__ == "__main__":
    main()
