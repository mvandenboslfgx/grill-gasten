/**
 * Server-only delivery config. Coordinates never go to the client bundle
 * when only imported from API routes / scripts.
 */

export const DELIVERY_ORIGIN_LABEL =
  process.env.DELIVERY_ORIGIN_LABEL?.trim() || "Klaaswaal";

/** Default Klaaswaal centrum — override via env in productie. */
export function getDeliveryOrigin(): { lat: number; lng: number; label: string } {
  const lat = Number(process.env.DELIVERY_ORIGIN_LAT);
  const lng = Number(process.env.DELIVERY_ORIGIN_LNG);
  return {
    lat: Number.isFinite(lat) ? lat : 51.7725,
    lng: Number.isFinite(lng) ? lng : 4.4456,
    label: DELIVERY_ORIGIN_LABEL,
  };
}

export function getQuoteSecret(): string {
  const secret =
    process.env.DELIVERY_QUOTE_SECRET?.trim() ||
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.KITCHEN_SECRET?.trim();
  if (!secret) {
    throw new Error("DELIVERY_QUOTE_SECRET is not configured");
  }
  return secret;
}

/** Tiengemeten — geen normale bezorging */
export const TIENGEMETEN_PLACE_RE = /tiengemeten/i;

/** Postcodes die we als Tiengemeten behandelen (eiland) */
export const TIENGEMETEN_POSTCODES = new Set(["3244"]);

export const DELIVERY_COST_ASSUMPTIONS = {
  fuelPricePerLiterCents: 256,
  kilometersPerLiter: 12,
  vehicleWearCentsPerKm: 24,
  driverHourlyCostCents: 1800,
  packagingCostCentsPerOrder: 65,
  paymentCostCentsPerOrder: 32,
  handoffMinutesPerOrder: 5,
  averageSpeedKmPerHourFallback: 35,
} as const;
