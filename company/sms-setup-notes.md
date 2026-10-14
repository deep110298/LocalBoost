# SMS Setup Notes — Sociocs (sociocs.com)

**Status:** Researched 2026-10-14. Account NOT created — needs user approval (T&Cs + connecting a carrier account).

## What Sociocs is

Sociocs is an omnichannel team inbox (SMS, WhatsApp, Instagram DMs, Facebook
Messenger, Google Reviews, web chat) — NOT a carrier. It sits on top of YOUR
OWN Twilio, Telnyx, or SignalHouse account. You pay Sociocs for the inbox
software and pay your carrier separately at direct carrier rates.

**This matters:** the "1,000 free SMS/month" is Sociocs platform quota, not
free carrier transport. You still need a Twilio/Telnyx account with a phone
number and A2P 10DLC registration for the texts to actually send.

## Free plan (verified from sociocs.com, Oct 2026)

- **$0/month, free forever** — no credit card required
- 2 channels, 1 user, **1,000 messages/month**
- Overage: $1 per 1,000 additional messages
- Paid tiers: Standard $24/mo (2 users, 2,000 msgs), Premium $149/mo (10 users,
  50,000 msgs, unlimited channels)

## True cost to send SMS via Sociocs

| Item | Cost | Who bills |
|------|------|-----------|
| Sociocs free plan | $0 | Sociocs |
| Twilio phone number | ~$1–2/mo | Twilio |
| US SMS segments | ~$0.008/segment | Twilio |
| A2P 10DLC registration | $19–60 one-time | Twilio/your CPaaS |

~1,000 outreach texts ≈ $8–10 in carrier fees + $1–2 for the number.
Still far cheaper than any bundled SMS platform.

## Signup steps (for the user)

1. Go to **https://www.sociocs.com** → click **"Start Free Trial"**
   (no credit card required; 7-day trial, free-forever plan available after).
2. Create account with **hello@localboost.site** (keep business identity
   consistent — never personal email).
3. Inside the dashboard, connect a **Twilio** (or Telnyx) account:
   - If no Twilio account: create one at twilio.com/try-twilio (also free
     to start, pay-as-you-go).
   - In Sociocs: Settings → Channels → SMS → enter Twilio Account SID +
     Auth Token.
4. Buy a US phone number in Twilio (~$1–2/mo) and assign it to Sociocs.
5. Complete **A2P 10DLC registration** in Twilio (required for US business
   texting; $19–60 one-time, takes 1–3 days for carrier approval).
   Without this, carriers will block bulk sends.
6. In Sociocs, verify the number shows as connected, then send a test text
   to your own phone before any outreach.

## Fit for LocalBoost outreach

- **Pros:** Real phone number (better deliverability than email-to-SMS
  gateways), shared inbox for replies, WhatsApp/Instagram in the same place,
  free tier covers our current volume.
- **Cons:** Requires Twilio account + A2P registration (1–3 day wait).
  The free 1,000 msgs/mo is plenty for now (~30/day cap in our submitter
  = ~900/mo max).
- **Verdict:** Best free path to a real SMS number. Recommend proceeding
  once user approves T&Cs.

## Alternatives considered

- **Email-to-SMS gateways (current):** Free but unreliable — Verizon
  vtext.com permanently rejects our sends; AT&T is flaky. T-Mobile works.
- **Google Voice:** Blocked on ID verification the user must do.
- **TextNow/TextFree:** Need a phone QR scan — no phone-free path.

## References

- Sociocs homepage: https://www.sociocs.com/
- Pricing details: https://www.sociocs.com/post/twilio-sms-pricing-beyond-the-sticker-rate-what-you-pay/
- Comparison: https://www.sociocs.com/simpletexting-alternative/
