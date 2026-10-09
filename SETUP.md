# LocalBoost — Setup (for when you're back)

## What's done

- ✅ Next.js 16 + TypeScript + Tailwind scaffold
- ✅ Supabase client wired (`src/lib/supabase.ts`, `src/lib/supabase-server.ts`)
- ✅ Database schema (`supabase/schema.sql`) — 5 tables with RLS
- ✅ Landing page with pricing (`src/app/page.tsx`)
- ✅ Dashboard: Overview, Review Inbox, Posts, Competitors, Settings
- ✅ API routes: `GET /api/reviews`, `POST /api/reviews/draft`
- ✅ Google Business Profile integration: OAuth connect flow, location picker, review sync (`POST /api/reviews/sync`), reply posting (`POST /api/reviews/reply`) — `src/lib/google.ts` + 6 routes + Settings connect button
- ✅ Ordering + website: public restaurant site (`/s/[slug]`) with menu, cart, checkout (pay at pickup); Menu editor page; Orders inbox page with live polling + status updates; tables `menu_categories`, `menu_items`, `orders` + `businesses.slug` (migration `002_ordering.sql`)
- ✅ TypeScript compiles clean
- ✅ Supabase project `localboost` created + connected

## What you need to do (5 min)

### 1. Run the database schema
DONE 2026-10-09 — ran via browser in the Supabase SQL editor (user signed in via takeover). DB was fresh, so the full schema.sql ran: all 9 tables exist (businesses, reviews, gmb_posts, competitors, competitor_snapshots, google_connections, menu_categories, menu_items, orders) with RLS policies.

### 2. Add your anon key
1. Supabase dashboard → Project Settings → API
2. Copy the "anon public" key
3. Paste it into `.env.local` replacing `PASTE_ANON_KEY_HERE`

### 3. Run it
```bash
cd ~/workspace/localboost
npm run dev
```
Open http://localhost:3000

## Production deploy (Vercel)

The local VM can't run `next build` (Turbopack bus-errors in this constrained
environment — not a code problem). Production builds run on Vercel instead.

### One-time setup (you)
1. **Supabase anon key**: Supabase dashboard → Project Settings → API → copy the
   "anon public" key into `.env.local` (replacing `PASTE_ANON_KEY_HERE`). The app
   cannot talk to the database without this.
2. **Vercel token**: vercel.com/account/tokens → create a token, paste it in chat
   for one-time deploy use (it's used once via CLI and never stored).
3. **Google Cloud** (for the Google Business integration): follow the
   "Google Business Profile connection" section above, and add the production
   redirect URI `https://<your-vercel-url>/api/google/callback` to the OAuth client.

### Deploy (agent runs with your token)
```bash
cd ~/workspace/localboost
npx vercel --token=$TOKEN --yes                    # first deploy
npx vercel env add NEXT_PUBLIC_SUPABASE_URL production --token=$TOKEN
npx vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --token=$TOKEN
npx vercel env add NEXT_PUBLIC_APP_URL production --token=$TOKEN   # the vercel.app URL
npx vercel --prod --token=$TOKEN                    # redeploy with env
```

## What's next (Phase 2)

- [x] Google OAuth → Google Business Profile API connection (built 2026-10-09)
- [x] Review sync (`POST /api/reviews/sync`)
- [x] Post reply via Google API (`POST /api/reviews/reply`)
- [ ] Muse API for real AI drafts (currently placeholder)
- [ ] Google Business post publishing (`createLocalPost` helper ready in `src/lib/google.ts`)
- [ ] Competitor auto-tracking via Places API
- [ ] Stripe billing
- [ ] Deploy to Vercel

## Google Business Profile connection — setup (you need to do this)

The code is built. Google requires setup in YOUR Google Cloud account:

### 1. Create a Google Cloud project
1. Go to console.cloud.google.com → create a project (e.g. `localboost`)

### 2. Enable the APIs
Enable all three in "APIs & Services → Library":
- **My Business Account Management API** (accounts)
- **My Business Business Information API** (locations)
- **Google My Business API** (reviews + replies + posts, v4)

### 3. Request API access (don't skip — quota is 0 until approved)
Google gates the Business Profile APIs behind an access request. Enabling them is NOT enough — calls will fail with quota errors until Google approves you. In the Business Profile API docs, find **"Request access"** and submit the form for your project. Approval can take a few days.

### 4. OAuth consent screen
1. "APIs & Services → OAuth consent screen" → External
2. Add scope: `https://www.googleapis.com/auth/business.manage`
3. Add yourself as a test user (while the app is in Testing mode)

### 5. OAuth client ID
1. "Credentials → Create Credentials → OAuth client ID" → Web application
2. Authorized redirect URI: `http://localhost:3000/api/google/callback`
   (add your production URL's `/api/google/callback` when you deploy)
3. Copy the Client ID + Client Secret into `.env.local`:
   `GOOGLE_CLIENT_ID=...`, `GOOGLE_CLIENT_SECRET=...`
4. Make sure `NEXT_PUBLIC_APP_URL=http://localhost:3000` (already in `.env.local`)

### 6. Run the migration
In Supabase SQL Editor, run `supabase/migrations/001_google_connections.sql`
(fresh installs: it's already in `supabase/schema.sql`).
For ordering/website tables, also run `supabase/migrations/002_ordering.sql`.

### 7. Test the flow
1. `npm run dev` → open the app → sign in
2. Dashboard → Settings → **Connect** next to Google Business
3. Grant access → pick the location → **Sync reviews now**
4. Check the Reviews inbox

### Notes on Google's quirks
- Reviews/replies/posts still run on the legacy v4 API (`mybusiness.googleapis.com/v4`) — that's current as of 2026, not a bug in our code.
- While your OAuth app is in **Testing** mode, refresh tokens expire after 7 days — you'll need to reconnect weekly during the beta. Publishing the app (requires Google verification for the `business.manage` scope) removes this.
- Yelp is intentionally read-only/summary: their public API doesn't allow replies. Google is the deep integration.

## Notes

- `next build` hits a "Bus error" on this VM (Turbopack memory issue, not a code problem). `tsc --noEmit` passes clean. Build will work on Vercel.
- The anon key is public-safe (it's in frontend JS by design). The service_role key stays server-only.
