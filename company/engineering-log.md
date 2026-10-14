# LocalBoost Engineering Log

## 2026-10-14 — Kickoff shift (first run, ahead of daily cron)

### P0: Merged landing-generalize + laundromat into engineer/2026-10-14
- Branch `landing-generalize/2026-10-12` was never merged; it mixed code with
  company/ ops files, so I cherry-picked code-only commits onto a clean branch:
  - `38c96be` Landing: generalize copy restaurant→business (src/app/page.tsx)
  - `cf39ad8` Preview: neutral fallback 'Your Business' (src/app/preview/page.tsx)
  - `0dcbdb0` Laundromat vertical: SERVICES.laundromat + hero image (page.tsx + public/images/laundromat.jpg). Ops files from the original commit excluded.
  - `6cf4540` Copy: finish generalization — layout title, /api/orders error, /login placeholder, slug fallback (4 files, 1 line each)
- `tsc --noEmit` clean.
- Production check: latest deploy is 2026-10-12 09:48 EDT, BEFORE both the
  landing work (14:33 EDT) and laundromat (21:43 EDT). **Neither is live.**
- Branch is ready for deploy review: merge engineer/2026-10-14 → master, then deploy. NOT deployed (per rule).

### P1: Email discovery automation — BUILT
- New tool: `company/tools/email-discover.py` (committed as `cc5dce9`)
- Waterfall: website scrape (mailto + /contact + /about, free) → Hunter.io
  domain-search (only when HUNTER_API_KEY env is set, 1 credit per domain).
- Never guesses; only returns observed addresses. Key from env, never in code.
- Hunter.io findings:
  - API confirmed: GET api.hunter.io/v2/domain-search?domain=X&api_key=K,
    plus /email-finder and /email-verifier. Free tier: 25 searches + 50 verifications/mo.
  - **No API key exists.** Account signup stalled at human verification (per
    2026-10-12 notes). Script runs fine without it — website scrape is the
    primary source anyway, since most prospects have no domain (Hunter is
    domain-first and returns ~0 for domain-less shops).
- First run results (dry-run verified, then written to pipeline.json):
  - Bombay Blue Indian Bistro → info@bombayblue.net (website mailto)
  - Kathiyawadi Kitchen II → kk2edison@gmail.com (website mailto)
  - Gordhan Thal → gordhanthalusa@gmail.com (website page-text)
  - Moghul Express → no email on site
- 3 scored leads now have verified public emails and are send-ready.

### Git note
- Ops files (pipeline.json etc.) were stashed during branch work and restored
  with 83 leads intact. Working tree left with ops changes uncommitted, as before.
- Branch engineer/2026-10-14 contains ONLY code commits (no ops data).

### Next (for tomorrow's shift or closer)
- Deploy review: merge engineer/2026-10-14 → master → Vercel deploy.
- Closer can draft/send to the 3 newly emailable leads.
- Run email-discover.py --all-missing periodically as new leads arrive.
- Still open: Hunter.io signup needs the user's human-verification click;
  worth doing for leads WITH domains, but website scrape covers most.
