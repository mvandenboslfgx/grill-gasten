# Supabase — handmatige stappen Grill Gasten

## Migraties (SQL Editor), in volgorde

1. `supabase/migrations/20250518120000_orders_rewards.sql`
2. `supabase/migrations/20260718210000_atomic_order_slot.sql`
3. `supabase/migrations/20260718220000_delivery_orders.sql` ← **bezorgvelden + RPC update**

Geen drops van orders/klanten.

## Env (Vercel)

```
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
MOLLIE_API_KEY=
KITCHEN_SECRET=
DELIVERY_ORIGIN_LABEL=Klaaswaal
DELIVERY_ORIGIN_LAT=
DELIVERY_ORIGIN_LNG=
DELIVERY_QUOTE_SECRET=
GOOGLE_MAPS_API_KEY=   # optioneel, nauwkeurige rijafstand
```

## Online bestellen aanzetten

In `lib/ordering/opening-hours.ts`:

- `orderingEnabled: true`
- `openWeekdays: [/* 0=zo … 6=za */]`

Zonder dit blijft `/bestellen` gesloten + WhatsApp.
