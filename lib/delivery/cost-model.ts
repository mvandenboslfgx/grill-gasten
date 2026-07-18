import { DELIVERY_COST_ASSUMPTIONS } from "@/lib/delivery/config";
import { DELIVERY_ZONES } from "@/lib/delivery/zones";

export type ZoneCostBreakdown = {
  zoneId: number;
  maxOneWayKm: number;
  roundTripKm: number;
  feeCents: number;
  minOrderCents: number;
  fuelCents: number;
  wearCents: number;
  driverCentsSingle: number;
  packagingCents: number;
  paymentCents: number;
  totalDirectSingle: number;
  perOrderBatch1: number;
  perOrderBatch2: number;
  perOrderBatch3: number;
  warning: string | null;
};

export function estimateZoneCosts(oneWayKm: number): {
  fuelCents: number;
  wearCents: number;
  driverCents: number;
  packagingCents: number;
  paymentCents: number;
  totalDirect: number;
} {
  const a = DELIVERY_COST_ASSUMPTIONS;
  const roundTripKm = oneWayKm * 2;
  const fuelCents = Math.round(
    (roundTripKm * a.fuelPricePerLiterCents) / a.kilometersPerLiter,
  );
  const wearCents = Math.round(roundTripKm * a.vehicleWearCentsPerKm);
  const driveHours = roundTripKm / a.averageSpeedKmPerHourFallback;
  const handoffHours = (a.handoffMinutesPerOrder / 60) * 2; // heen+terug overdracht
  const driverCents = Math.round((driveHours + handoffHours) * a.driverHourlyCostCents);
  const packagingCents = a.packagingCostCentsPerOrder;
  const paymentCents = a.paymentCostCentsPerOrder;
  return {
    fuelCents,
    wearCents,
    driverCents,
    packagingCents,
    paymentCents,
    totalDirect: fuelCents + wearCents + driverCents + packagingCents + paymentCents,
  };
}

export function buildDeliveryCostReport(): ZoneCostBreakdown[] {
  return DELIVERY_ZONES.map((z) => {
    const maxOneWayKm = z.maxMeters / 1000;
    const c = estimateZoneCosts(maxOneWayKm);
    // Rij+chauffeur schalen met batch; packaging+payment per order
    const shared = c.fuelCents + c.wearCents + c.driverCents;
    const fixed = c.packagingCents + c.paymentCents;
    const batch1 = shared + fixed;
    const batch2 = Math.round(shared / 2) + fixed;
    const batch3 = Math.round(shared / 3) + fixed;
    const loss = batch1 > z.feeCents;
    return {
      zoneId: z.id,
      maxOneWayKm,
      roundTripKm: maxOneWayKm * 2,
      feeCents: z.feeCents,
      minOrderCents: z.minOrderCents,
      fuelCents: c.fuelCents,
      wearCents: c.wearCents,
      driverCentsSingle: c.driverCents,
      packagingCents: c.packagingCents,
      paymentCents: c.paymentCents,
      totalDirectSingle: batch1,
      perOrderBatch1: batch1,
      perOrderBatch2: batch2,
      perOrderBatch3: batch3,
      warning: loss
        ? `Tarief (€${(z.feeCents / 100).toFixed(2)}) lager dan directe kosten bij 1 bestelling/rit (€${(batch1 / 100).toFixed(2)})`
        : null,
    };
  });
}
