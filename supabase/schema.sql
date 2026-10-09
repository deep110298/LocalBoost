-- LocalBoost database schema
-- Run this in your Supabase SQL editor after creating the project

-- Businesses (one row per location the user manages)
create table businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  google_place_id text,
  yelp_business_id text,
  address text,
  phone text,
  website text,
  created_at timestamptz default now()
);

-- Reviews (synced from Google + Yelp)
create table reviews (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  source text not null check (source in ('google', 'yelp')),
  external_id text not null,
  author_name text,
  rating int check (rating between 1 and 5),
  text text,
  review_time timestamptz,
  replied boolean default false,
  reply_text text,
  replied_at timestamptz,
  ai_draft text,
  created_at timestamptz default now(),
  unique(business_id, source, external_id)
);

-- Scheduled / published Google Business posts
create table gmb_posts (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  content text not null,
  image_url text,
  scheduled_for timestamptz,
  published_at timestamptz,
  status text default 'draft' check (status in ('draft', 'scheduled', 'published', 'failed')),
  created_at timestamptz default now()
);

-- Competitors being tracked
create table competitors (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  google_place_id text,
  last_rating numeric(2,1),
  last_review_count int,
  checked_at timestamptz,
  created_at timestamptz default now()
);

-- Competitor snapshots (weekly history for trends)
create table competitor_snapshots (
  id uuid primary key default gen_random_uuid(),
  competitor_id uuid not null references competitors(id) on delete cascade,
  rating numeric(2,1),
  review_count int,
  snapshot_at timestamptz default now()
);

-- Row-level security: users only see their own data
alter table businesses enable row level security;
alter table reviews enable row level security;
alter table gmb_posts enable row level security;
alter table competitors enable row level security;
alter table competitor_snapshots enable row level security;

create policy "users own businesses"
  on businesses for all using (auth.uid() = user_id);

create policy "users own reviews"
  on reviews for all using (
    business_id in (select id from businesses where user_id = auth.uid())
  );

create policy "users own posts"
  on gmb_posts for all using (
    business_id in (select id from businesses where user_id = auth.uid())
  );

create policy "users own competitors"
  on competitors for all using (
    business_id in (select id from businesses where user_id = auth.uid())
  );

create policy "users own snapshots"
  on competitor_snapshots for all using (
    competitor_id in (
      select c.id from competitors c
      join businesses b on b.id = c.business_id
      where b.user_id = auth.uid()
    )
  );

-- Google Business Profile connection (OAuth tokens, one row per business)
create table google_connections (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null unique references businesses(id) on delete cascade,
  google_account_id text,
  google_location_id text,
  location_name text,
  access_token text,
  refresh_token text,
  expires_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table google_connections enable row level security;

create policy "users own google connections"
  on google_connections for all using (
    business_id in (select id from businesses where user_id = auth.uid())
  );
-- Migration 002: website + menu + ordering
-- Run this in the Supabase SQL editor if you already ran earlier schemas.

-- Public URL slug for the restaurant's website (e.g. /s/eggholic-jc-a1b2)
alter table businesses add column if not exists slug text unique;

-- Menu categories (Starters, Mains, Desserts...)
create table if not exists menu_categories (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  name text not null,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Menu items
create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  category_id uuid references menu_categories(id) on delete set null,
  name text not null,
  description text,
  price_cents int not null check (price_cents >= 0),
  available boolean default true,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Customer orders (placed from the public website)
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  customer_name text not null,
  customer_phone text not null,
  note text,
  items jsonb not null default '[]',
  subtotal_cents int not null default 0,
  status text not null default 'new'
    check (status in ('new', 'preparing', 'ready', 'completed', 'cancelled')),
  created_at timestamptz default now()
);
create index if not exists orders_business_idx on orders (business_id, created_at desc);

alter table menu_categories enable row level security;
alter table menu_items enable row level security;
alter table orders enable row level security;

-- Owners manage their own menus...
drop policy if exists "users own menu categories" on menu_categories;
create policy "users own menu categories" on menu_categories for all using (
  business_id in (select id from businesses where user_id = auth.uid())
);
drop policy if exists "users own menu items" on menu_items;
create policy "users own menu items" on menu_items for all using (
  business_id in (select id from businesses where user_id = auth.uid())
);
drop policy if exists "users own orders" on orders;
create policy "users own orders" on orders for all using (
  business_id in (select id from businesses where user_id = auth.uid())
);

-- ...but the public website needs to read menus and place orders.
drop policy if exists "public can read menus" on menu_categories;
create policy "public can read menus" on menu_categories for select using (true);
drop policy if exists "public can read menu items" on menu_items;
create policy "public can read menu items" on menu_items for select using (true);
drop policy if exists "public can place orders" on orders;
create policy "public can place orders" on orders for insert with check (true);
