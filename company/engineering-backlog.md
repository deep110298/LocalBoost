# LocalBoost Engineering Backlog

Prioritized build queue for the daily engineer. Top = highest priority.

## P0 — Ship what's already built
- [x] Merge `landing-generalize/2026-10-12` branch (generalized landing copy) — code-only cherry-picks on `engineer/2026-10-14`, tsc clean, ready for deploy review (2026-10-14)
- [x] Laundromat preview vertical — same branch, verified NOT live in prod (last deploy 2026-10-12 09:48 EDT predates it), ready for deploy review (2026-10-14)

## P1 — Company automations
- [x] Email discovery integration — BUILT `company/tools/email-discover.py` (website scrape + Hunter.io when HUNTER_API_KEY set). 3 verified emails found and written to pipeline.json on first run. Hunter signup still needs user's human-verification click; script works without it. (2026-10-14)
- [ ] Tokenized unsubscribe links + suppression list (required before scaling email)
- [ ] Contact-form outreach submitter (rate-limited, for businesses with forms but no email)
- [ ] Automated prospecting job (find → carrier-check → score → pipeline, on schedule)
- [ ] Reply classifier (parse Zoho inbox, tag hot/cold/neutral automatically)

## P2 — Product fixes & polish
- [ ] Trial banner POST on every dashboard load (currently missing)
- [ ] Review draft endpoint placeholder logic (needs ANTHROPIC_API_KEY or real implementation)
- [ ] Reviews UI still partly static — wire to real data
- [ ] Public order endpoint rate limiting
- [ ] SMS/Twilio/order notifications (unbuilt)

## P3 — Nice to have
- [ ] More preview verticals (plumber, electrician, dentist, gym)
- [ ] Competitor watch automation
- [ ] Visibility score calculation
