-- Events log (signups, key actions). Read by the signup-watch cron via service role.
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  business_id uuid references public.businesses(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  type text not null,
  data jsonb not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

drop policy if exists "Users can insert own events" on public.events;
create policy "Users can insert own events" on public.events for insert
  with check (user_id = auth.uid());

drop policy if exists "Users can read own events" on public.events;
create policy "Users can read own events" on public.events for select
  using (user_id = auth.uid());

create index if not exists events_business_idx on public.events(business_id);
create index if not exists events_created_idx on public.events(created_at desc);
create index if not exists events_type_idx on public.events(type);
