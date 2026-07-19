# Delivery launch notes

## Scope

**Pickup + delivery from day one.** Bezorgen is geen latere fase.

Flags blijven uit tot de aparte activatie-PR:

- `orderingConfig.orderingEnabled`
- `orderingConfig.pickupEnabled`
- `orderingConfig.deliveryEnabled`
- `deliveryConfig.enabled`
- `openWeekdays: []`

## Architectuur

| Stuk | Pad |
|------|-----|
| DeliveryConfig | `lib/delivery/delivery-config.ts` |
| Postcode allowlist | `lib/delivery/postal-allowlist.ts` |
| Quote build | `lib/delivery/build-quote.ts` |
| Signed quote | `lib/delivery/quote.ts` |
| Zone skeleton | `lib/delivery/zones.ts` (alleen na owner sign-off) |
| Quote API | `app/api/delivery/quote/route.ts` |

## Pricing modes

1. **`unconfigured`** (huidige default) → delivery niet beschikbaar
2. **`flat_fee`** → allowlist + bevestigde fee/min; **geen Maps nodig**
3. **`distance_zones`** → allowlist + Maps + `distanceZonesOwnerConfirmed`

## Marge

Server berekent: producten + modifiers + delivery fee (+ optionele free-threshold) + service fee (alleen indien bevestigd).

Geen client fees. Capaciteit pickup ≠ delivery.

## Frisdrank

Drafts in `lib/catalog/drinks.ts` — pas live na `ownerConfirmed`, `sizeLabel` en `priceCents`.
Geen alcohol in deze launch.
