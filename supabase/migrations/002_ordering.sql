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
