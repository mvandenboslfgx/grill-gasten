# Supabase — handmatige stappen Grill Gasten

## Migraties (SQL Editor), in volgorde

1. `supabase/migrations/20250518120000_orders_rewards.sql`
2. `supabase/migrations/20260718210000_atomic_order_slot.sql`
3. `supabase/migrations/20260718220000_delivery_orders.sql`
4. `supabase/migrations/20260718230000_delivery_safety_fix.sql` ← **advisory lock, constraints, rate_limit RPC**

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
DELIVERY_QUOTE_SECRET=          # ≥ 32 tekens, verplicht, geen fallback
DELIVERY_DISTANCE_PROVIDER=google
GOOGLE_MAPS_API_KEY=            # verplicht voor online bezorgen
RATE_LIMIT_BACKEND=supabase     # optioneel; op Vercel standaard gedeeld
```

### Rate limiting

- Productie (Vercel + Supabase): RPC `check_rate_limit` (gedeeld, fail-closed bij storing).
- Lokaal zonder backend: in-memory fallback.
- Zet `RATE_LIMIT_BACKEND=memory` om gedeelde limiter te forceren uit te zetten.

### Bezorgen

Zonder `GOOGLE_MAPS_API_KEY` + `DELIVERY_QUOTE_SECRET` (≥32):

- Geen bezorgquotes
- Checkout toont: “Online bezorgen is tijdelijk niet beschikbaar. Afhalen is wel mogelijk.”

## Online bestellen aanzetten

In `lib/ordering/opening-hours.ts`:

- `orderingEnabled: true`
- `openWeekdays: [/* 0=zo … 6=za */]`

Zonder dit blijft `/bestellen` gesloten + WhatsApp.
