# Supabase — handmatige stappen Grill Gasten

## 1. Migraties uitvoeren (SQL Editor)

Voer in volgorde uit:

1. `supabase/migrations/20250518120000_orders_rewards.sql`
2. `supabase/migrations/20260718210000_atomic_order_slot.sql`

Geen `drop table` / reset — bestaande orders blijven behouden.

## 2. Environment variables (Vercel + `.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
MOLLIE_API_KEY=
KITCHEN_SECRET=
RESEND_API_KEY=          # optioneel
FORMSPREE_FORM_ID=       # fallback e-mail
```

## 3. Online bestellen aanzetten

Zet in `lib/ordering/opening-hours.ts`:

```ts
orderingEnabled: true,
openWeekdays: [/* 0=zo … 6=za */],
```

Zonder `orderingEnabled` + Supabase + Mollie toont `/bestellen` “tijdelijk gesloten”.

## 4. Mollie webhook

`https://grillgasten.eu/api/mollie/webhook`
