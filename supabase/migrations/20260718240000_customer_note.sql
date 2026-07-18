-- Customer note as structured field (notes remains snapshot backup)

alter table public.orders
  add column if not exists customer_note text;

create index if not exists orders_customer_note_idx
  on public.orders (pickup_date)
  where customer_note is not null;
