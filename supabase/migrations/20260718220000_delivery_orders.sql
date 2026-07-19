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

-- Replace pickup-only overload (different arg list) so REVOKE/GRANT stay unambiguous
drop function if exists public.create_order_with_slot(text, text, text, text, date, text, jsonb, integer, text);

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

revoke all on function public.create_order_with_slot(text, text, text, text, date, text, jsonb, integer, text, text, text, integer, integer, text, text, text, text, text, integer, integer, integer, text) from public;
grant execute on function public.create_order_with_slot(text, text, text, text, date, text, jsonb, integer, text, text, text, integer, integer, text, text, text, text, text, integer, integer, integer, text) to service_role;
