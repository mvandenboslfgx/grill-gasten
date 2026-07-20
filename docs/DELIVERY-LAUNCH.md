# Delivery launch notes

## Scope

**Pickup + delivery from day one.** Bezorgen is launch-critical.

Flags blijven uit tot de aparte activatie-PR:

- `orderingConfig.orderingEnabled`
- `orderingConfig.pickupEnabled`
- `orderingConfig.deliveryEnabled`
- `deliveryConfig.enabled`
- `openWeekdays: []`

## Architectuur

| Stuk | Pad |
|------|-----|
| Kitchen location (server-only) | `lib/business/location.ts` |
| Launch hours candidate | `lib/ordering/launch-hours.ts` |
| DeliveryConfig | `lib/delivery/delivery-config.ts` |
| Postcode zones A/B/C | `lib/delivery/postal-zones.ts` |
| Allowlist / blocklist | `lib/delivery/postal-allowlist.ts` |
| Quote build | `lib/delivery/build-quote.ts` |
| Signed quote | `lib/delivery/quote.ts` |

## Pricing mode (launch)

**`postcode_zones`** — server-side prefix → fee/min. **Maps uit.** **Gratis bezorgen uit.**

| Zone | Fee | Min. order | Prefixen |
|------|-----|------------|----------|
| A Lokaal | €3,95 | €20 | 3286, 3273, 3271, 3281 |
| B Middellang | €5,95 | €25 | 3274, 3261–3263, 3284, 3291, 3299 |
| C Buitengebied | €7,95 | €30 | 3264, 3265, 3267, 3292, 3293, 3295, 3297 |

`3284BE` (Tiengemeten) blijft geblokkeerd.

## Adresprivacy

Intern: Molendijk 29, 3286 BE Klaaswaal.  
Publiek: alleen **Klaaswaal** zolang `publicPickupAddressEnabled: false`.

## Migraties

Geen nieuwe DB-migratie voor zones — statische serverconfig volstaat.  
Bestaande `20260719210000_ordering_readiness.sql` blijft remote open (niet in deze opdracht toepassen).

## Frisdrank

Zes bevestigde producten in `lib/catalog/drinks.ts` — zichtbaar op menu; bestelbaar pas bij `orderingEnabled`.
