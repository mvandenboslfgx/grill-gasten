-- Ordering readiness: payment_status alignment, idempotency, mail events, token ciphertext

-- ---------------------------------------------------------------------------
-- Expand payment_status CHECK to match app PaymentStatus
-- ---------------------------------------------------------------------------
alter table public.orders drop constraint if exists orders_payment_status_check;

alter table public.orders
  add constraint orders_payment_status_check
  check (
    payment_status in (
      'unpaid',
      'pending',
      'paid',
      'failed',
      'canceled',
      'expired',
      'refunded'
    )
  );

-- ---------------------------------------------------------------------------
-- Mollie payment id uniqueness (one payment → one order)
-- ---------------------------------------------------------------------------
create unique index if not exists orders_mollie_payment_id_uidx
  on public.orders (mollie_payment_id)
  where mollie_payment_id is not null;

-- ---------------------------------------------------------------------------
-- Idempotency + encrypted status token (server-only; never expose via API)
-- ---------------------------------------------------------------------------
alter table public.orders
  add column if not exists idempotency_key text;

alter table public.orders
  add column if not exists idempotency_payload_hash text;

alter table public.orders
  add column if not exists access_token_ciphertext text;

create unique index if not exists orders_idempotency_key_uidx
  on public.orders (idempotency_key)
  where idempotency_key is not null;

-- ---------------------------------------------------------------------------
-- Order events (email / webhook side-effects — insert-once)
-- ---------------------------------------------------------------------------
create table if not exists public.order_events (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  event_type text not null,
  created_at timestamptz not null default now(),
  constraint order_events_type_check check (
    event_type in (
      'webhook_paid_processed',
      'email_owner_paid',
      'email_customer_paid',
      'points_awarded'
    )
  ),
  constraint order_events_order_type_uidx unique (order_id, event_type)
);

create index if not exists order_events_order_id_idx
  on public.order_events (order_id);

revoke all on table public.order_events from anon, authenticated;
grant all on table public.order_events to service_role;

-- ---------------------------------------------------------------------------
-- Atomic create: persist token hash + note + idempotency in same insert
-- Drop previous overload so PostgREST does not see ambiguous signatures.
-- ---------------------------------------------------------------------------
drop function if exists public.create_order_with_slot(
  text, text, text, text, date, text, jsonb, integer, text,
  text, text, integer, integer, text, text, text, text, text,
  integer, integer, integer, text
);

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
  p_delivery_instructions text default null,
  p_customer_note text default null,
  p_access_token_hash text default null,
  p_access_token_ciphertext text default null,
  p_idempotency_key text default null,
  p_idempotency_payload_hash text default null
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
    customer_note,
    access_token_hash,
    access_token_ciphertext,
    idempotency_key,
    idempotency_payload_hash,
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
    p_customer_note,
    p_access_token_hash,
    p_access_token_ciphertext,
    p_idempotency_key,
    p_idempotency_payload_hash,
    p_delivery_street,
    p_delivery_postcode,
    p_delivery_house_number,
    p_delivery_addition,
    p_delivery_city,
    p_delivery_zone,
    p_delivery_distance_meters,
    p_delivery_duration_seconds,
    p_delivery_instructions,
    'active'
  )
  returning * into v_row;

  return to_jsonb(v_row);
end;
$$;

revoke all on function public.create_order_with_slot from public;
grant execute on function public.create_order_with_slot to service_role;
