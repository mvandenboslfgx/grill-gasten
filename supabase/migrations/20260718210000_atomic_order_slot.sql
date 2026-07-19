-- Atomic timeslot capacity + order insert
-- Safe / incremental — no drops of existing data

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

revoke all on function public.create_order_with_slot(text, text, text, text, date, text, jsonb, integer, text) from public;
grant execute on function public.create_order_with_slot(text, text, text, text, date, text, jsonb, integer, text) to service_role;

-- Unique ledger reason per order for idempotent points (soft)
create unique index if not exists points_ledger_order_reason_uidx
  on public.points_ledger (order_id, reason)
  where order_id is not null;
