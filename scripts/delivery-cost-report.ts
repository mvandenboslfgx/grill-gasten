/**
 * Interne kostenrapportage — niet voor klanten.
 * Run: npm run delivery:report
 */
import { buildDeliveryCostReport } from "../lib/delivery/cost-model";
import { formatPriceCents } from "../lib/catalog/format-money";

function main() {
  const rows = buildDeliveryCostReport();
  console.log("\n=== Grill Gasten — bezorgkostenrapport (intern) ===\n");
  for (const r of rows) {
    console.log(`Zone ${r.zoneId} — max ${r.maxOneWayKm} km enkele reis (retour ${r.roundTripKm} km)`);
    console.log(`  Klanttarief:          ${formatPriceCents(r.feeCents)}`);
    console.log(`  Minimum bestelling:   ${formatPriceCents(r.minOrderCents)}`);
    console.log(`  Brandstof:            ${formatPriceCents(r.fuelCents)}`);
    console.log(`  Slijtage:             ${formatPriceCents(r.wearCents)}`);
    console.log(`  Chauffeur (1 rit):    ${formatPriceCents(r.driverCentsSingle)}`);
    console.log(`  Verpakking:           ${formatPriceCents(r.packagingCents)}`);
    console.log(`  Betaalkosten:         ${formatPriceCents(r.paymentCents)}`);
    console.log(`  Direct 1/rit:         ${formatPriceCents(r.perOrderBatch1)}`);
    console.log(`  Per order batch 2:    ${formatPriceCents(r.perOrderBatch2)}`);
    console.log(`  Per order batch 3:    ${formatPriceCents(r.perOrderBatch3)}`);
    if (r.warning) console.log(`  ⚠ ${r.warning}`);
    console.log("");
  }
}

main();
