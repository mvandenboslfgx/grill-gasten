-- Grill Gasten — orders, timeslots, Grill Rewards
-- Run via Supabase SQL editor or: supabase db push

create extension if not exists "pgcrypto";

-- Orders (pre-order / afhalen)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'preparing', 'ready', 'picked_up', 'cancelled')),
  payment_status text not null default 'unpaid'
    check (payment_status in ('unpaid', 'paid', 'failed', 'refunded')),
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  pickup_date date not null,
  pickup_time text not null,
  location text,
  lines jsonb not null default '[]'::jsonb,
  total_cents integer not null check (total_cents >= 0),
  mollie_payment_id text,
  checkout_url text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_pickup_idx on public.orders (pickup_date, pickup_time);
create index if not exists orders_status_idx on public.orders (status, created_at desc);

-- Capaciteit per tijdslot (optioneel per event-datum)
create table if not exists public.timeslot_caps (
  event_date date not null,
  slot_time text not null,
  max_orders integer not null default 12 check (max_orders > 0),
  primary key (event_date, slot_time)
);

-- Grill Rewards leden
create table if not exists public.rewards_members (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  phone text,
  name text,
  points integer not null default 0 check (points >= 0),
  tier text not null default 'bronze'
    check (tier in ('bronze', 'silver', 'gold', 'black')),
  referral_code text unique,
  referred_by uuid references public.rewards_members (id),
  birthday date,
  created_at timestamptz not null default now()
);

create table if not exists public.points_ledger (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.rewards_members (id) on delete cascade,
  delta integer not null,
  reason text not null,
  order_id uuid references public.orders (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists points_ledger_member_idx on public.points_ledger (member_id, created_at desc);

-- Waitlist / early access
create table if not exists public.rewards_signups (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  phone text,
  created_at timestamptz not null default now()
);

create unique index if not exists rewards_signups_email_idx on public.rewards_signups (lower(email));

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists orders_updated_at on public.orders;
create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

-- RLS: alle client-toegang via service role (Next.js API). Geen anon policies.
alter table public.orders enable row level security;
alter table public.timeslot_caps enable row level security;
alter table public.rewards_members enable row level security;
alter table public.points_ledger enable row level security;
alter table public.rewards_signups enable row level security;
