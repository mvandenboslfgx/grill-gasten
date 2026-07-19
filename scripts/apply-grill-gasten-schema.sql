-- Grill Gasten — full schema bootstrap (idempotent where possible)
-- Apply once in Supabase SQL Editor for project linked to NEXT_PUBLIC_SUPABASE_URL
-- Generated for production hardening; safe to re-run (IF NOT EXISTS / OR REPLACE)

-- ========== supabase/migrations/20250518120000_orders_rewards.sql ==========
-- Grill Gasten â€” orders, timeslots, Grill Rewards
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


-- ========== supabase/migrations/20260718210000_atomic_order_slot.sql ==========
-- Atomic timeslot capacity + order insert
-- Safe / incremental â€” no drops of existing data

create or replace function public.create_order_with_slot(
  p_order_number text,
  p_customer_name text,
  p_customer_phone text,
  p_customer_email text,
  p_pickup_date date,
  p_pickup_time text,
  p_lines jsonb,
  p_total_cents integer,
  p_notes text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
  v_max integer;
  v_row public.orders%rowtype;
begin
  -- Lock existing orders for this slot to serialize concurrent inserts
  perform 1
  from public.orders
  where pickup_date = p_pickup_date
    and pickup_time = p_pickup_time
    and status <> 'cancelled'
  for update;

  select count(*)::integer into v_count
  from public.orders
  where pickup_date = p_pickup_date
    and pickup_time = p_pickup_time
    and status <> 'cancelled';

  select coalesce(
    (select max_orders from public.timeslot_caps
     where event_date = p_pickup_date and slot_time = p_pickup_time),
    12
  ) into v_max;

  if v_count >= v_max then
    return jsonb_build_object('error_code', 'slot_full');
  end if;

  insert into public.orders (
    order_number,
    status,
    payment_status,
    customer_name,
    customer_phone,
    customer_email,
    pickup_date,
    pickup_time,
    location,
    lines,
    total_cents,
    notes
  ) values (
    p_order_number,
    'pending',
    'unpaid',
    p_customer_name,
    p_customer_phone,
    p_customer_email,
    p_pickup_date,
    p_pickup_time,
    null,
    p_lines,
    p_total_cents,
    p_notes
  )
  returning * into v_row;

  return to_jsonb(v_row);
end;
$$;

revoke all on function public.create_order_with_slot from public;
grant execute on function public.create_order_with_slot to service_role;

-- Unique ledger reason per order for idempotent points (soft)
create unique index if not exists points_ledger_order_reason_uidx
  on public.points_ledger (order_id, reason)
  where order_id is not null;


-- ========== supabase/migrations/20260718220000_delivery_orders.sql ==========
-- Delivery fields + expanded kitchen statuses (incremental, no drops)

alter table public.orders
  add column if not exists fulfillment_method text
    check (fulfillment_method is null or fulfillment_method in ('pickup', 'delivery'));

alter table public.orders
  add column if not exists delivery_window text;

alter table public.orders
  add column if not exists delivery_street text;

alter table public.orders
  add column if not exists delivery_postcode text;

alter table public.orders
  add column if not exists delivery_house_number text;

alter table public.orders
  add column if not exists delivery_addition text;

alter table public.orders
  add column if not exists delivery_city text;

alter table public.orders
  add column if not exists delivery_zone integer;

alter table public.orders
  add column if not exists delivery_distance_meters integer;

alter table public.orders
  add column if not exists delivery_duration_seconds integer;

alter table public.orders
  add column if not exists delivery_instructions text;

alter table public.orders
  add column if not exists delivery_fee_cents integer default 0;

alter table public.orders
  add column if not exists subtotal_cents integer;

alter table public.orders
  add column if not exists batch_status text
    check (batch_status is null or batch_status in ('unscheduled', 'scheduled', 'out_for_delivery', 'delivered'));

alter table public.orders
  add column if not exists batch_number text;

-- Expand status check: drop old constraint if present, add broader one
do $$
begin
  alter table public.orders drop constraint if exists orders_status_check;
exception when undefined_object then null;
end $$;

alter table public.orders
  drop constraint if exists orders_status_check;

alter table public.orders
  add constraint orders_status_check
  check (status in (
    'pending', 'confirmed', 'preparing', 'ready',
    'out_for_delivery', 'delivered', 'picked_up', 'cancelled'
  ));

create index if not exists orders_fulfillment_idx
  on public.orders (fulfillment_method, pickup_date, pickup_time);

-- Atomic create with method-aware capacity
create or replace function public.create_order_with_slot(
  p_order_number text,
  p_customer_name text,
  p_customer_phone text,
  p_customer_email text,
  p_pickup_date date,
  p_pickup_time text,
  p_lines jsonb,
  p_total_cents integer,
  p_notes text default null,
  p_fulfillment_method text default 'pickup',
  p_delivery_window text default null,
  p_subtotal_cents integer default null,
  p_delivery_fee_cents integer default 0,
  p_delivery_street text default null,
  p_delivery_postcode text default null,
  p_delivery_house_number text default null,
  p_delivery_addition text default null,
  p_delivery_city text default null,
  p_delivery_zone integer default null,
  p_delivery_distance_meters integer default null,
  p_delivery_duration_seconds integer default null,
  p_delivery_instructions text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
  v_max integer;
  v_row public.orders%rowtype;
  v_slot_time text;
begin
  v_slot_time := case
    when p_fulfillment_method = 'delivery' then coalesce(p_delivery_window, p_pickup_time)
    else p_pickup_time
  end;

  perform 1
  from public.orders
  where pickup_date = p_pickup_date
    and (
      (p_fulfillment_method = 'pickup' and pickup_time = p_pickup_time and coalesce(fulfillment_method, 'pickup') = 'pickup')
      or
      (p_fulfillment_method = 'delivery' and coalesce(delivery_window, pickup_time) = v_slot_time and fulfillment_method = 'delivery')
    )
    and status <> 'cancelled'
  for update;

  select count(*)::integer into v_count
  from public.orders
  where pickup_date = p_pickup_date
    and status <> 'cancelled'
    and (
      (p_fulfillment_method = 'pickup' and pickup_time = p_pickup_time and coalesce(fulfillment_method, 'pickup') = 'pickup')
      or
      (p_fulfillment_method = 'delivery' and coalesce(delivery_window, pickup_time) = v_slot_time and fulfillment_method = 'delivery')
    );

  select coalesce(
    (select max_orders from public.timeslot_caps
     where event_date = p_pickup_date and slot_time = v_slot_time),
    case when p_fulfillment_method = 'delivery' then 8 else 12 end
  ) into v_max;

  if v_count >= v_max then
    return jsonb_build_object('error_code', 'slot_full');
  end if;

  insert into public.orders (
    order_number,
    status,
    payment_status,
    fulfillment_method,
    customer_name,
    customer_phone,
    customer_email,
    pickup_date,
    pickup_time,
    delivery_window,
    location,
    lines,
    total_cents,
    subtotal_cents,
    delivery_fee_cents,
    notes,
    delivery_street,
    delivery_postcode,
    delivery_house_number,
    delivery_addition,
    delivery_city,
    delivery_zone,
    delivery_distance_meters,
    delivery_duration_seconds,
    delivery_instructions,
    batch_status
  ) values (
    p_order_number,
    'pending',
    'unpaid',
    p_fulfillment_method,
    p_customer_name,
    p_customer_phone,
    p_customer_email,
    p_pickup_date,
    p_pickup_time,
    p_delivery_window,
    case when p_fulfillment_method = 'delivery'
      then concat_ws(', ', p_delivery_street, p_delivery_postcode || ' ' || p_delivery_city)
      else null end,
    p_lines,
    p_total_cents,
    p_subtotal_cents,
    coalesce(p_delivery_fee_cents, 0),
    p_notes,
    p_delivery_street,
    p_delivery_postcode,
    p_delivery_house_number,
    p_delivery_addition,
    p_delivery_city,
    p_delivery_zone,
    p_delivery_distance_meters,
    p_delivery_duration_seconds,
    p_delivery_instructions,
    case when p_fulfillment_method = 'delivery' then 'unscheduled' else null end
  )
  returning * into v_row;

  return to_jsonb(v_row);
end;
$$;

revoke all on function public.create_order_with_slot from public;
grant execute on function public.create_order_with_slot to service_role;


-- ========== supabase/migrations/20260718230000_delivery_safety_fix.sql ==========
-- Delivery safety: advisory lock capacity, constraints, rate limit RPC
-- Incremental â€” no drops of order/customer data

-- ---------------------------------------------------------------------------
-- Backfill veilig
-- ---------------------------------------------------------------------------
update public.orders
set fulfillment_method = 'pickup'
where fulfillment_method is null;

update public.orders
set subtotal_cents = total_cents
where subtotal_cents is null
  and coalesce(delivery_fee_cents, 0) = 0
  and total_cents is not null;

update public.orders
set delivery_fee_cents = 0
where delivery_fee_cents is null;

-- ---------------------------------------------------------------------------
-- Constraints (add only if missing)
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'orders_subtotal_cents_nonneg'
  ) then
    alter table public.orders
      add constraint orders_subtotal_cents_nonneg
      check (subtotal_cents is null or subtotal_cents >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'orders_delivery_fee_cents_nonneg'
  ) then
    alter table public.orders
      add constraint orders_delivery_fee_cents_nonneg
      check (delivery_fee_cents is null or delivery_fee_cents >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'orders_total_cents_nonneg'
  ) then
    alter table public.orders
      add constraint orders_total_cents_nonneg
      check (total_cents >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'orders_delivery_distance_nonneg'
  ) then
    alter table public.orders
      add constraint orders_delivery_distance_nonneg
      check (delivery_distance_meters is null or delivery_distance_meters >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'orders_delivery_duration_nonneg'
  ) then
    alter table public.orders
      add constraint orders_delivery_duration_nonneg
      check (delivery_duration_seconds is null or delivery_duration_seconds >= 0);
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'orders_delivery_zone_range'
  ) then
    alter table public.orders
      add constraint orders_delivery_zone_range
      check (delivery_zone is null or (delivery_zone between 1 and 6));
  end if;

  if not exists (
    select 1 from pg_constraint where conname = 'orders_delivery_fields_required'
  ) then
    alter table public.orders
      add constraint orders_delivery_fields_required
      check (
        fulfillment_method is distinct from 'delivery'
        or (
          delivery_window is not null
          and delivery_street is not null
          and delivery_postcode is not null
          and delivery_house_number is not null
          and delivery_city is not null
          and delivery_zone is not null
          and delivery_distance_meters is not null
          and subtotal_cents is not null
          and delivery_fee_cents is not null
        )
      );
  end if;
end $$;

-- ---------------------------------------------------------------------------
-- Atomic create with transaction-level advisory lock (works when slot is empty)
-- Active capacity statuses: pending, confirmed, preparing, ready, out_for_delivery
-- ---------------------------------------------------------------------------
create or replace function public.create_order_with_slot(
  p_order_number text,
  p_customer_name text,
  p_customer_phone text,
  p_customer_email text,
  p_pickup_date date,
  p_pickup_time text,
  p_lines jsonb,
  p_total_cents integer,
  p_notes text default null,
  p_fulfillment_method text default 'pickup',
  p_delivery_window text default null,
  p_subtotal_cents integer default null,
  p_delivery_fee_cents integer default 0,
  p_delivery_street text default null,
  p_delivery_postcode text default null,
  p_delivery_house_number text default null,
  p_delivery_addition text default null,
  p_delivery_city text default null,
  p_delivery_zone integer default null,
  p_delivery_distance_meters integer default null,
  p_delivery_duration_seconds integer default null,
  p_delivery_instructions text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
  v_max integer;
  v_row public.orders%rowtype;
  v_slot_time text;
  v_lock_key bigint;
begin
  v_slot_time := case
    when p_fulfillment_method = 'delivery' then coalesce(p_delivery_window, p_pickup_time)
    else p_pickup_time
  end;

  -- Lock vÃ³Ã³r count â€” werkt ook bij 0 bestaande orders in het slot
  v_lock_key := hashtextextended(
    concat_ws(':', p_pickup_date::text, coalesce(p_fulfillment_method, 'pickup'), v_slot_time),
    0
  );
  perform pg_advisory_xact_lock(v_lock_key);

  select count(*)::integer into v_count
  from public.orders
  where pickup_date = p_pickup_date
    and status in ('pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery')
    and (
      (p_fulfillment_method = 'pickup'
        and pickup_time = p_pickup_time
        and coalesce(fulfillment_method, 'pickup') = 'pickup')
      or
      (p_fulfillment_method = 'delivery'
        and coalesce(delivery_window, pickup_time) = v_slot_time
        and fulfillment_method = 'delivery')
    );

  select coalesce(
    (select max_orders from public.timeslot_caps
     where event_date = p_pickup_date and slot_time = v_slot_time),
    case when p_fulfillment_method = 'delivery' then 8 else 12 end
  ) into v_max;

  if v_count >= v_max then
    return jsonb_build_object('error_code', 'slot_full');
  end if;

  insert into public.orders (
    order_number,
    status,
    payment_status,
    fulfillment_method,
    customer_name,
    customer_phone,
    customer_email,
    pickup_date,
    pickup_time,
    delivery_window,
    location,
    lines,
    total_cents,
    subtotal_cents,
    delivery_fee_cents,
    notes,
    delivery_street,
    delivery_postcode,
    delivery_house_number,
    delivery_addition,
    delivery_city,
    delivery_zone,
    delivery_distance_meters,
    delivery_duration_seconds,
    delivery_instructions,
    batch_status
  ) values (
    p_order_number,
    'pending',
    'unpaid',
    p_fulfillment_method,
    p_customer_name,
    p_customer_phone,
    p_customer_email,
    p_pickup_date,
    p_pickup_time,
    p_delivery_window,
    case when p_fulfillment_method = 'delivery'
      then concat_ws(', ', p_delivery_street, p_delivery_postcode || ' ' || p_delivery_city)
      else null end,
    p_lines,
    p_total_cents,
    p_subtotal_cents,
    coalesce(p_delivery_fee_cents, 0),
    p_notes,
    p_delivery_street,
    p_delivery_postcode,
    p_delivery_house_number,
    p_delivery_addition,
    p_delivery_city,
    p_delivery_zone,
    p_delivery_distance_meters,
    p_delivery_duration_seconds,
    p_delivery_instructions,
    case when p_fulfillment_method = 'delivery' then 'unscheduled' else null end
  )
  returning * into v_row;

  return to_jsonb(v_row);
end;
$$;

revoke all on function public.create_order_with_slot from public;
grant execute on function public.create_order_with_slot to service_role;

-- ---------------------------------------------------------------------------
-- Shared rate limit (production)
-- ---------------------------------------------------------------------------
create table if not exists public.rate_limit_buckets (
  bucket_key text primary key,
  count integer not null default 0,
  reset_at timestamptz not null
);

create or replace function public.check_rate_limit(
  p_key text,
  p_limit integer,
  p_window_ms integer
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_now timestamptz := now();
  v_reset timestamptz;
  v_count integer;
  v_window interval := make_interval(secs => greatest(1, (p_window_ms / 1000.0)::integer));
begin
  perform pg_advisory_xact_lock(hashtextextended('rl:' || p_key, 0));

  select count, reset_at into v_count, v_reset
  from public.rate_limit_buckets
  where bucket_key = p_key
  for update;

  if not found or v_reset <= v_now then
    insert into public.rate_limit_buckets (bucket_key, count, reset_at)
    values (p_key, 1, v_now + v_window)
    on conflict (bucket_key) do update
      set count = 1, reset_at = excluded.reset_at;
    return jsonb_build_object('allowed', true, 'retry_after_sec', 0);
  end if;

  if v_count >= p_limit then
    return jsonb_build_object(
      'allowed', false,
      'retry_after_sec', greatest(1, ceil(extract(epoch from (v_reset - v_now))))
    );
  end if;

  update public.rate_limit_buckets
  set count = count + 1
  where bucket_key = p_key;

  return jsonb_build_object('allowed', true, 'retry_after_sec', 0);
end;
$$;

revoke all on function public.check_rate_limit from public;
grant execute on function public.check_rate_limit to service_role;

revoke all on table public.rate_limit_buckets from public;
grant all on table public.rate_limit_buckets to service_role;


-- ========== supabase/migrations/20260718240000_customer_note.sql ==========
-- Customer note as structured field (notes remains snapshot backup)

alter table public.orders
  add column if not exists customer_note text;

create index if not exists orders_customer_note_idx
  on public.orders (pickup_date)
  where customer_note is not null;


-- ========== supabase/migrations/20260718250000_order_access_token_security.sql ==========
-- Order customer status capability token (store hash only) + defense-in-depth grants

alter table public.orders
  add column if not exists access_token_hash text;

alter table public.orders
  add column if not exists customer_note text;

create unique index if not exists orders_access_token_hash_uidx
  on public.orders (access_token_hash)
  where access_token_hash is not null;

-- Deny Data API roles on sensitive tables when present; server uses service_role only
do $$
declare
  t text;
begin
  foreach t in array array[
    'orders',
    'rewards_members',
    'rewards_signups',
    'points_ledger',
    'rate_limit_buckets'
  ]
  loop
    if to_regclass('public.' || t) is not null then
      execute format('revoke all on table public.%I from anon, authenticated', t);
      execute format('grant all on table public.%I to service_role', t);
    end if;
  end loop;
end $$;



