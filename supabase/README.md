# Supabase — handmatige stappen Grill Gasten

## Productiestatus (checklist)

Vercel Production moet hebben:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `KITCHEN_SECRET` (≥ 32 tekens)

Na env-wijziging: production **redeploy** (env wordt pas actief na nieuwe deployment).

Database: zolang `public.orders` ontbreekt (PostgREST `PGRST205`) zijn kitchen/print/status DB-afhankelijk nog niet volledig. Bestellen blijft fail-closed / uit.

**Niet** migraties draaien op andere Supabase-projecten (bijv. VDB). Alleen op het project achter `NEXT_PUBLIC_SUPABASE_URL` van Grill Gasten.

## Migraties (SQL Editor), in volgorde

Snelste pad (leeg project / eerste bootstrap / na mislukte poging): plak **uitsluitend**  
`scripts/apply-grill-gasten-schema.sql` in de SQL Editor → **Run**.

Niet plakken: Cursor-chat, Markdown-rapporten, of alleen het laatste `REVOKE`-blok.

Of bestand-voor-bestand:

1. `supabase/migrations/20250518120000_orders_rewards.sql`
2. `supabase/migrations/20260718210000_atomic_order_slot.sql`
3. `supabase/migrations/20260718220000_delivery_orders.sql`
4. `supabase/migrations/20260718230000_delivery_safety_fix.sql`
5. `supabase/migrations/20260718240000_customer_note.sql` ← **customer_note kolom**
6. `supabase/migrations/20260718250000_order_access_token_security.sql` ← **access_token_hash + REVOKE anon/authenticated**
7. `supabase/migrations/20260719210000_ordering_readiness.sql` ← **payment_status expand, order_events, idempotency, token ciphertext**

Geen drops van orders/klanten.

Zie ook `docs/ORDERING-LAUNCH-CHECKLIST.md` vóór activatie.

## Env (Vercel)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MOLLIE_API_KEY=
KITCHEN_SECRET=                 # ≥ 32 tekens; HttpOnly sessiecookie, geen ?key=
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
