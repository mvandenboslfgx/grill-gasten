-- Order customer status capability token (store hash only) + defense-in-depth grants

alter table public.orders
  add column if not exists access_token_hash text;

alter table public.orders
  add column if not exists customer_note text;

create unique index if not exists orders_access_token_hash_uidx
  on public.orders (access_token_hash)
  where access_token_hash is not null;

-- Deny Data API roles on sensitive tables; server uses service_role only.
-- Plain SQL (no DO $$) so the Supabase dashboard "enable RLS" injector cannot
-- splice ALTER TABLE into the middle of a dollar-quoted block.
revoke all on table public.orders from anon, authenticated;
grant all on table public.orders to service_role;

revoke all on table public.rewards_members from anon, authenticated;
grant all on table public.rewards_members to service_role;

revoke all on table public.rewards_signups from anon, authenticated;
grant all on table public.rewards_signups to service_role;

revoke all on table public.points_ledger from anon, authenticated;
grant all on table public.points_ledger to service_role;

revoke all on table public.rate_limit_buckets from anon, authenticated;
grant all on table public.rate_limit_buckets to service_role;
