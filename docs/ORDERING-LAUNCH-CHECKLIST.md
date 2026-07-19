# Ordering launch checklist — Grill Gasten

## Officiële launchscope

```text
Pickup + delivery from day one
```

Online bestellen blijft **uit** tot alle items hieronder zijn afgevinkt **én** de
eigenaar expliciet activeert via een **aparte launch-PR**:

```ts
orderingEnabled: false
pickupEnabled: false
deliveryEnabled: false
openWeekdays: []
```

(`deliveryConfig.enabled` blijft synchroon uit tot die launch-PR.)

Dit is een technische/operationele checklist, geen juridisch advies.

**Niet** eerst alleen afhalen lanceren. Bezorgen is launch-critical.

---

## Bedrijfsgegevens

- [ ] Afhaaladres bevestigd (straat + plaats, niet alleen regio)
- [ ] Openingstijden / open weekdays bevestigd
- [ ] Telefoonnummer bevestigd (`06 49 56 56 98`)
- [ ] E-mailadres bevestigd (`info@grillgasten.eu`)
- [ ] Voorbereidingstijd pickup bevestigd
- [ ] Voorbereidingstijd delivery bevestigd
- [ ] Slotcapaciteit **pickup** bevestigd (aparte limiet)
- [ ] Slotcapaciteit **delivery** bevestigd (aparte limiet)

## Menu / food

- [ ] Prijzen gecontroleerd tegen servercatalogus
- [ ] Extra’s / sauzen gecontroleerd
- [ ] Allergeneninformatie gecontroleerd
- [ ] Uitverkochtflow getest
- [ ] Productfoto’s gereed

## Dranken (alcoholvrij)

- [ ] Drankassortiment bevestigd (merken)
- [ ] Formaten bevestigd (bijv. 330 ml / 500 ml)
- [ ] Inkoopprijzen gecontroleerd
- [ ] Verkoopprijzen bevestigd → `ownerConfirmed` + `priceCents` in `lib/catalog/drinks.ts`
- [ ] Marge gecontroleerd
- [ ] Productfoto’s gereed
- [ ] Koelkast / voorraad geregeld
- [ ] Uitverkochtprocedure getest
- [ ] Geen alcohol in deze launch

## Delivery (launch-critical)

- [ ] Volledig bezorggebied / postcodes bevestigd → `allowedPostalCodeAreas`
- [ ] Geblokkeerde postcodes bevestigd
- [ ] Bezorgkosten bevestigd (flat fee **of** distance zones + owner sign-off)
- [ ] Minimum bestelbedrag bevestigd
- [ ] Gratis-bezorgdrempel bevestigd **of** bewust uit (`null`)
- [ ] Maximumafstand bevestigd (bij distance zones)
- [ ] Delivery voorbereidingstijd / slots bevestigd
- [ ] Maximum deliveryorders per slot bevestigd
- [ ] Verpakking en transportkosten verwerkt in marge
- [ ] Bezorgmethode / chauffeur geregeld
- [ ] Transportverpakking getest (warm / koud gescheiden)
- [ ] Procedure bij vertraging vastgelegd
- [ ] Procedure bij fout adres / onbereikbare klant vastgelegd
- [ ] `DELIVERY_QUOTE_SECRET` ≥ 32 tekens (Vercel)
- [ ] `GOOGLE_MAPS_API_KEY` aanwezig **als** `pricingMode === "distance_zones"`
- [ ] Flat-fee mode getest **zonder** Maps (allowlist-only pad)

## Pickup

- [ ] Pickup actief besluit (`pickupEnabled`) in launch-PR
- [ ] Afhaallocatie operationeel getest

## Mollie

- [ ] Liveprofiel goedgekeurd
- [ ] Productiekey / preview testkey aanwezig
- [ ] Webhook URL live
- [ ] Redirect URL live
- [ ] Testbetaling pickup geslaagd
- [ ] Testbetaling delivery geslaagd (burger + drank)
- [ ] Mislukte / geannuleerde / verlopen betaling getest
- [ ] Dubbele webhook → één mail
- [ ] Bedragmismatch → geen bevestiging
- [ ] Refund getest

## Database

- [ ] Migratie `20260719210000_ordering_readiness.sql` toegepast
- [ ] `order_events` aanwezig
- [ ] Unique indexes (Mollie / idempotency)
- [ ] Clean-install + upgrade getest
- [ ] Backup vóór remote apply

## Kitchen / print / status

- [ ] Tablet: AFHALEN vs BEZORGEN duidelijk
- [ ] Delivery: adres + instructie + telefoon
- [ ] Printbon 80mm (delivery + dranken)
- [ ] Statuslink (geen zone-ID voor klant)
- [ ] Bevestigingsmail met adres, fee, dranken

## Juridisch / privacy

- [ ] Voorwaarden, privacy, cookies
- [ ] Annuleringsbeleid
- [ ] Allergenenverwijzing
- [ ] Mollie / Resend vermeld waar nodig

## Launch-PR (aparte PR — niet deze readiness-branch)

1. Migratie + Mollie-testflow groen
2. Zakelijke waarden in `deliveryConfig` + `DRINK_DRAFTS` bevestigd
3. Expliciete toestemming eigenaar
4. Zet `pickupEnabled` + `deliveryEnabled` + `deliveryConfig.enabled` + `openWeekdays`
5. Zet `orderingEnabled: true`
6. Deploy + smoke (één echte testorder alleen met toestemming)

## Rollback

```ts
orderingEnabled: false
pickupEnabled: false
deliveryEnabled: false
openWeekdays: []
```

WhatsApp-fallback blijft beschikbaar.

**Nooit activeren vanuit deze checklist zonder eigenaarstoestemming.**
**Nooit alleen pickup lanceren zonder delivery.**
