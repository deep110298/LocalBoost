-- Migration 001: Google Business Profile connection
-- Run this in the Supabase SQL editor if you already ran the base schema.
-- (Fresh installs using schema.sql already include this table.)

create table if not exists google_connections (
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

drop policy if exists "users own google connections" on google_connections;
create policy "users own google connections"
  on google_connections for all using (
    business_id in (select id from businesses where user_id = auth.uid())
  );
