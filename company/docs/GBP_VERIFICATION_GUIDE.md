# Google Business Profile verification — the 60-day clock recipe

**Why this matters:** Google's Business Profile API (review sync/reply, autopilot) requires a GBP that is *verified + active 60+ days with a listed website*, then a manual access request. Every day this waits pushes LocalBoost's autopilot out. The Google Cloud side is done — this is the only gate left, and only you can do it (Google needs your address/phone).

**What you'll need:** ~15 minutes + one real address and one phone number you can receive calls/SMS at.

## Step 0 — do this first (5 min, may skip the whole wait)

Add localboost.site to Google Search Console under the **same Google account** you'll use for the profile. If Google already trusts that account+domain, it can grant **instant verification** — no video, no postcard, no waiting.

## Step 1 — create the profile

1. Go to business.google.com, sign in, click **Add business → Add single business**.
2. **Business name:** `LocalBoost`
3. **Category:** start typing and pick **Internet marketing service** (primary). You can add *Software company* as a secondary later.
4. **Location type:** choose **"I deliver goods and services to my customers"** (service-area business — no storefront). This lets you **hide your street address from the public listing** while still giving it to Google for verification.
5. **Service areas:** add the towns you're prospecting (Jersey City, Bayonne, Hoboken, Edison, Iselin…).
6. **Address:** enter your real address (needed for verification; stays hidden publicly). **Do not use a PO box or virtual office — that's a fast track to suspension.**
7. **Contact:** your phone number, website `https://www.localboost.site`, and business hours.
8. Fill in everything else: description, services (website, review inbox, Google posts, booking/ordering), logo, photos. Complete profiles verify faster.

## Step 2 — verify (Google picks the method, not you)

- **Best case:** instant (thanks to Step 0), email/phone/SMS code — done in minutes.
- **Most likely for a new listing in 2026:** **video verification** — one continuous phone take showing (a) your workspace/signage, (b) interior, (c) proof you run the business (laptop with the LocalBoost dashboard, business card, recent mail with the address). Good lighting, no editing. Review takes 3–7 days.
- **Possible:** postcard (5–14 days) — if offered, don't change *anything* on the profile while it travels; edits can invalidate the code.

## Step 3 — keep it active

The 60-day requirement needs the profile **verified AND active**: post updates, add photos, respond to any reviews, keep hours accurate. Dormant profiles don't count.

## Honest caveat

GBP is built for businesses with customers, not pure SaaS. Service-area + hidden-address is Google's accepted pattern for home-based businesses, and LocalBoost serves real local businesses — but verification of a software business is not guaranteed. If video verification fails or the listing gets suspended, appeal in the GBP dashboard rather than creating a second listing (duplicates get flagged).

Once verified: tell me — I'll file the API access request and track the 60-day clock from the verification date.
