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
