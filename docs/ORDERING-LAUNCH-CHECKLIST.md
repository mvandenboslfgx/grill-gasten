# Ordering launch checklist — Grill Gasten

Online bestellen blijft **uit** (`orderingEnabled: false`, `openWeekdays: []`,
`pickupEnabled: false`, `deliveryEnabled: false`) tot alle items hieronder
zijn afgevinkt **én** de eigenaar expliciet activeert.

Dit is een technische/operationele checklist, geen juridisch advies.

## Bedrijfsgegevens

- [ ] Afhaaladres bevestigd (straat + plaats, niet alleen regio)
- [ ] Openingstijden / open weekdays bevestigd
- [ ] Telefoonnummer bevestigd (`06 49 56 56 98`)
- [ ] E-mailadres bevestigd (`info@grillgasten.eu`)
- [ ] Voorbereidingstijd (lead minutes) bevestigd
- [ ] Slotcapaciteit pickup / delivery bevestigd

## Menu

- [ ] Prijzen gecontroleerd tegen servercatalogus (`lib/catalog/products.ts`)
- [ ] Extra’s / sauzen gecontroleerd
- [ ] Allergeneninformatie gecontroleerd
- [ ] Uitverkochtflow getest
- [ ] Productfoto’s gereed

## Pickup / delivery

- [ ] Pickup actief besluit (`pickupEnabled`)
- [ ] Deliverybesluit genomen (`deliveryEnabled`)
- [ ] Bezorggebied / zones bevestigd
- [ ] Bezorgkosten bevestigd
- [ ] Minimumbedrag bevestigd
- [ ] `DELIVERY_QUOTE_SECRET` ≥ 32 tekens (Vercel)
- [ ] `GOOGLE_MAPS_API_KEY` aanwezig (server-only)
- [ ] Slotcapaciteit in `timeslot_caps` of RPC-defaults geverifieerd

## Mollie

- [ ] Liveprofiel goedgekeurd
- [ ] Productiekey aanwezig (of bewuste testkey in preview)
- [ ] Webhook URL live: `/api/mollie/webhook`
- [ ] Redirect URL live: `/bestellen/status/...`
- [ ] Testbetaling geslaagd (testmode)
- [ ] Mislukte / geannuleerde / verlopen betaling getest
- [ ] Dubbele webhook getest (geen dubbele mail)
- [ ] Bedragmismatch-pad getest (geen bevestiging)
- [ ] Refund getest

## Database

- [ ] Migratie `20260719210000_ordering_readiness.sql` toegepast op Grill Gasten-project
- [ ] `payment_status` accepteert `pending` / `canceled` / `expired`
- [ ] Tabel `order_events` aanwezig
- [ ] Unique index op `mollie_payment_id` en `idempotency_key`
- [ ] Clean-install + upgrade getest
- [ ] Backup vóór remote apply

## Kitchen

- [ ] Tablet getest
- [ ] Login getest (HttpOnly cookie)
- [ ] Printer / printbon getest
- [ ] Statusflow geoefend (paid → preparing → ready → completed)
- [ ] Fallbackprocedure vastgelegd (WhatsApp)

## E-mail (Resend)

- [ ] Geverifieerde afzender
- [ ] Eigenaarmail bij paid
- [ ] Klantmail bij paid met statuslink
- [ ] Geen dubbele mail bij webhook-retry

## Juridisch / privacy

- [ ] Voorwaarden
- [ ] Privacybeleid
- [ ] Cookiebeleid
- [ ] Bedrijfsgegevens
- [ ] Annuleringsbeleid
- [ ] Allergenenverwijzing
- [ ] Mollie / Resend vermeld waar nodig

## Launch

- [ ] `getOrderingReadiness()` zonder critical blockers
- [ ] Volledige testorder (testmode)
- [ ] E-mail ontvangen
- [ ] Kitchen ontvangt order
- [ ] Printbon correct
- [ ] Statuslink correct
- [ ] Monitoring / logs gecontroleerd
- [ ] WhatsApp-fallback werkt
- [ ] Rollbackplan: `orderingEnabled: false` + lege `openWeekdays`

## Activation (alleen eigenaar)

1. Migratie toegepast en geverifieerd
2. Zakelijke waarden ingevuld
3. Mollie testflow groen
4. Expliciete toestemming eigenaar
5. Zet `pickupEnabled` / `deliveryEnabled` naar wens
6. Zet `openWeekdays` naar bevestigde dagen
7. Zet `orderingEnabled: true`
8. Deploy + live smoke (één echte testorder alleen met toestemming)

**Nooit activeren vanuit deze checklist zonder eigenaarstoestemming.**
