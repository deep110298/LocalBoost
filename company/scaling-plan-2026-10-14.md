# LocalBoost Scaling Plan: $0 → First 10 Paying Customers

**Date:** 2026-10-14
**Current state:** 83 leads, 15 contacted, 0 replies, 0 clients, $0 MRR
**Goal:** 10 paying customers ($990–$2,990 MRR)

---

## 1. What the Data Says: Channel Effectiveness (2026 Benchmarks)

### Response rates by channel (sourced)

| Channel | Avg Reply Rate | Top Performers | Source |
|---------|---------------|----------------|--------|
| **1:1 SMS (proper)** | 34.7% | 56%+ (top quartile) | TextUs 2026 survey, 763 revenue professionals |
| **Instagram DMs (personalized)** | 32% | — | Influencer Marketing Hub 2026 DM study |
| **Contact form outreach** | 5–15% | Up to 25% (targeted) | 2025–2026 practitioner reports; 2–5x cold email |
| **Cold DM (generic)** | 3–8% | — | Hormozi cold outreach system benchmarks |
| **Cold email (average)** | 1–3.4% | 25–40% (top 10%, hyper-personalized) | Instantly billions-of-sends benchmark 2026; Lemlist 2025 |
| **Cold email (bulk/agency)** | ~1.1% | — | Danish Lead Co, 1.7M sends/90 days |

Additional: SMS open rates 90–98% vs email 20–45%. SMS conversion 21–40% vs email 1–15%. Multi-channel sequences deliver 2–3x engagement vs single-channel.

### What this means for LocalBoost

Our current approach (cold email from a 4-day-old domain + carrier-gateway SMS) sits at the **worst end of every benchmark**:
- New domain = no sender reputation = spam folder or low delivery
- Carrier email-to-SMS gateways look like spam, get blocked (Verizon already blocks us), and can't receive replies reliably
- 0% reply on 15 sends is statistically normal for this setup, not a messaging problem yet

**The fix is channel-first, not copy-first.** We need to move to channels where local business owners actually read and respond.

---

## 2. The Funnel Math: What Volume Gets Us 10 Customers?

Using conservative mid-range benchmarks for local SMB outreach:

| Stage | Rate (conservative) | Math |
|-------|-------------------|------|
| Outreach sent | — | 4,000 touches |
| Reply rate (blended across channels) | 8% | → 320 replies |
| Reply → trial start | 30% | → 96 trials |
| Trial → paid (30-day) | 10% | → **~10 customers** |

**Blended 8% reply rate** assumes a channel mix weighted toward high-response channels:
- Contact forms: 10% reply (2,000 sends → 200 replies)
- Instagram DMs: 5% reply (1,200 sends → 60 replies)
- Proper SMS: 15% reply (400 sends → 60 replies)
- Cold email (warmed domain): 2% reply (400 sends → 8 replies)

**Total: ~4,000 touches → ~328 replies → ~98 trials → ~10 customers**

At $99–299/mo with a $199 average, that's **~$1,990 MRR**.

### Timeline reality check
- 4,000 touches over 30 days = ~133/day across all channels
- This is achievable with the current agent infrastructure (scout finds leads, closer drafts, automated sending)
- The 30-day trial means paid conversions lag: trials started in week 1 convert in week 5. **First revenue lands ~day 35–40.** Plan cash expectations accordingly.

---

## 3. Should We Niche Down? Yes — Start with Beauty & Wellness

**Recommendation: Focus 70% of outreach on salons, barbershops, spas, and nail studios for the first 30 days.**

Why:
1. **Highest SaaS adoption among local verticals.** Fresha (booking/payments for beauty & wellness) serves 140,000+ businesses processing $1.4B/month. These owners already pay for software — the "software is a scam" objection is pre-handled.
2. **Review-driven purchase decisions.** Beauty clients choose based on Google reviews more than almost any other vertical. Our core hook ("X of your 10 newest reviews has no reply") hits hardest here.
3. **Visual product fit.** Our preview generator shines for salons/spas (booking flow, service menus, before/after imagery). Restaurant previews are good; salon previews are great.
4. **Owner-operator density.** Most are 1–3 person shops where the owner IS the decision-maker and reads their own DMs/texts.

**The other 30%:** Continue restaurants and auto shops (existing pipeline), but deprioritize new prospecting there until beauty/wellness converts.

**Niche-down does NOT mean product change.** The product already handles all verticals. This is purely a go-to-market focus: same product, sharper targeting, faster learning loops.

---

## 4. Messaging: What Actually Converts Local Business Owners

Research consensus from practitioners selling to local SMBs in 2026:

### The 5 rules

1. **Lead with their specific problem, not your product.** "None of your 10 newest Google reviews has a reply" beats "We offer AI review management" every time. Say the problem out loud before they do — this creates the feeling of being understood, which creates trust before the pitch.

2. **One concrete observation > ten features.** Our current approach (verified review count + personalized preview link) is already best-practice. Keep it. The preview link is our unfair advantage — most competitors pitch with words; we pitch with *their business, already built*.

3. **Sell the outcome in their language, not tech language.** Don't say "AI-powered review automation." Say "Every review answered, every morning, without you touching your phone." Don't say "online presence management." Say "More 5-star reviews, more bookings, while you're with clients."

4. **Make the ask stupidly easy.** "Worth a 10-minute look?" beats "Book a demo." The 30-day free trial with no card is already the right offer — it's the lowest-friction ask in SaaS. Lead with it, don't bury it.

5. **Consultative, never salesy.** Frame as "I noticed this about your business" not "We help businesses like yours." The exclusive-invitation framing ("we're inviting a small group") is correct — it flips the power dynamic.

### Message template (refined)

**SMS (160 chars):**
> Hi [Name] — [Business] has [X] Google reviews and [Y] of your 10 newest have no reply from you. I built you a preview of what we do: [link]. 30 days free, no card. Worth a look?

**Instagram DM:**
> Hey! I was looking at [Business] on Google — [specific observation, e.g. "your fade photos are great but none of your 10 newest reviews has a reply"]. I mocked up what a review-auto-reply + booking site could look like for you: [link]. It's free for 30 days, no card. Want me to walk you through it?

**Contact form:**
> Subject: Quick observation about [Business]'s Google reviews
>
> Hi — I was researching [Business] and noticed [X] of your 10 newest Google reviews don't have a reply from you. Happy customers who don't get acknowledged don't come back as often.
>
> I built a quick preview of what automated review replies + a booking site could look like for [Business]: [link]
>
> It's a 30-day free trial, no credit card. Would you be open to a 10-minute walkthrough?

---

## 5. Free/Cheap Legitimate SMS Options

The carrier-gateway hack (email-to-SMS) is dead. Here are real alternatives:

### Free tiers (use immediately)

| Tool | Free Tier | Catch |
|------|-----------|-------|
| **Sociocs** | 1,000 messages/month free | Platform (not raw API); includes inbox |
| **Twilio trial** | 100 free SMS (30 days) | Testing only; must upgrade after |
| **TextNow** | Unlimited free (ad-supported) | Needs a phone for QR setup; manual sending |
| **Google Voice** | Free | Blocked on ID verification for our number |

### Cheapest paid (when free runs out)

| Tool | Cost per SMS | Monthly for 500 SMS |
|------|-------------|-------------------|
| **Telnyx** | $0.004/segment | ~$2 + $1 number rental |
| **Plivo** | $0.0077/segment | ~$4 + number rental |
| **Twilio** | $0.0083/segment | ~$4 + $1 number rental |
| **Bandwidth** | $0.006/segment | ~$3 + number rental |

Plus carrier passthrough fees (~$0.003–0.005/msg) on all platforms.

### Compliance note (non-negotiable)
- **10DLC registration required** for US business SMS. Unregistered traffic gets filtered.
- Every message must include opt-out ("Reply STOP to opt out") — we already do this.
- **Never send to numbers on the Do Not Call registry** for marketing. Our outreach is arguably B2B (business numbers), which has more latitude, but stay conservative.
- Telnyx and Twilio both offer free 10DLC registration guidance.

### Recommendation
1. **Week 1:** Sign up for Sociocs free tier (1,000 msgs). Use for the first SMS batch.
2. **Week 2:** Set up Telnyx ($0.004/msg, cheapest). Register 10DLC. Budget: ~$5/month for 500 messages.
3. **Ongoing:** At 400 SMS/month, total cost is under $5. This is the highest-ROI $5 in the business.

---

## 6. The 30-Day Execution Plan

### Week 1 (Days 1–7): Foundation
**Goal:** Fix channels, build pipeline to 200 leads, send first 800 touches

| Action | Owner | Target |
|--------|-------|--------|
| Set up Sociocs free tier (1,000 SMS) | Engineer | Day 2 |
| Register Telnyx + 10DLC | Engineer | Day 5 |
| Warm up hello@localboost.site (gradual volume ramp) | Closer | 20→50 emails/day |
| Scout: 70% beauty/wellness leads in 3 new cities | Scout | +120 leads (total ~200) |
| Contact form outreach: build submitter tool | Engineer | Day 4 |
| Instagram DM: set up dedicated business account | Main agent | Day 3 |
| Send: 300 contact forms + 200 IG DMs + 200 SMS + 100 emails | Closer | 800 touches |

**Expected:** 800 touches × 8% = ~64 replies → ~19 trials started

### Week 2 (Days 8–14): Scale
**Goal:** 1,400 touches, first trial cohort active, refine messaging from reply data

| Action | Owner | Target |
|--------|-------|--------|
| Analyze Week 1 reply data: which channel/vertical/message wins | Main agent | Day 8 |
| Double down on winning channel, cut losers | Closer | Day 9 |
| Scout: expand to 5 cities, maintain 70% beauty focus | Scout | +150 leads (total ~350) |
| Follow-up sequences: Day 3 nudges for all Week 1 non-responders | Closer | ~700 follow-ups |
| Send: 500 contact forms + 400 IG DMs + 300 SMS + 200 emails | Closer | 1,400 touches |

**Expected:** 1,400 touches × 8% = ~112 replies → ~34 trials (cumulative ~53)

### Week 3 (Days 15–21): Optimize
**Goal:** 1,200 touches, first trials approaching conversion decision

| Action | Owner | Target |
|--------|-------|--------|
| A/B test top 2 message variants | Closer | Day 15 |
| Check in with Week 1 trial users (concierge) | Concierge | Day 16–18 |
| Scout: fill pipeline gaps in best-performing vertical | Scout | +100 leads (total ~450) |
| Send: 400 contact forms + 400 IG DMs + 200 SMS + 200 emails | Closer | 1,200 touches |

**Expected:** 1,200 × 8% = ~96 replies → ~29 trials (cumulative ~82)

### Week 4 (Days 22–30): Convert
**Goal:** 600 touches (lighter — focus shifts to closing), first paid conversions

| Action | Owner | Target |
|--------|-------|--------|
| Trial-to-paid outreach: personal check-in for all active trials | Concierge | Day 22–28 |
| Send: 200 contact forms + 200 IG DMs + 100 SMS + 100 emails | Closer | 600 touches |
| Document: what worked, kill what didn't, plan Month 2 | Main agent | Day 30 |

**Expected:** 600 × 8% = ~48 replies → ~14 trials (cumulative ~96)
**Paid conversions:** ~10% of trials → **~10 paying customers**

### 30-Day Scorecard

| Metric | Target |
|--------|--------|
| Total touches | 4,000 |
| Total replies | ~320 (8%) |
| Trials started | ~96 (30% of replies) |
| Paying customers | ~10 (10% of trials) |
| MRR | ~$1,990 (@ $199 avg) |
| Total SMS cost | <$10 |
| Total email cost | $0 |

---

## 7. What Could Kill This (Risks & Mitigations)

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Instagram account banned for DM volume | Medium | Stay under 30 DMs/day/account; use 2 accounts; warm up gradually |
| Contact form messages marked as spam | Low | Personalize each; stay under 50/day per IP; rotate sending times |
| SMS deliverability issues (10DLC delays) | Medium | Start with Sociocs (handles compliance); Telnyx as backup |
| Trial users don't convert (product gaps) | Medium | Concierge checks in at day 7, 14, 21; fix top complaints within 48h |
| Email domain reputation never recovers | Low | Warm up properly; if dead after 2 weeks, buy a second domain ($12) |
| Can't find 4,000 qualified leads | Low | 83 leads from 1 city in 5 days; 5 cities × 4 weeks = plenty |

---

## 8. Immediate Next Steps (This Week)

1. [ ] **Engineer:** Set up Sociocs free tier + build contact form submitter (P1 backlog)
2. [ ] **Scout:** Pivot to 70% beauty/wellness; target 3 new cities this week
3. [ ] **Main agent:** Create dedicated Instagram business account for LocalBoost outreach
4. [ ] **Closer:** Draft contact-form and IG DM templates from Section 4
5. [ ] **Main agent:** Start Telnyx account + 10DLC registration (takes 3–5 days)

---

## Sources

- TextUs 2026 SMS Engagement Benchmark Report (763 professionals): 34.7% avg SMS response rate
- Instantly 2026 benchmark (billions of sends): cold email reply rate 3.43%, down from 8.5% (2019)
- Influencer Marketing Hub 2026: personalized Instagram DMs 32% response rate
- Danish Lead Co (1.7M sends/90 days): cold email 1.08% overall reply rate
- Practitioner reports (Medium, 2025–2026): contact forms 2–5x cold email reply rates (5–15%)
- Fresha/BusinessWire (2026): 140,000+ beauty/wellness businesses on platform, $1.4B monthly GMV
- StartupTalky (Sep 2026): SMS API pricing comparison (Telnyx $0.004, Twilio $0.0083, Bandwidth $0.006)
- Sociocs (Jun 2026): free plan 1,000 messages/month
- Hormozi cold outreach system: channel benchmarks (email 2–5%, DM 3–8%, call 2–5%)
- Jessica Jonas / Medium (Feb 2026): local business outreach funnel (5–15% reply → 20–40% call → 10–30% close)
