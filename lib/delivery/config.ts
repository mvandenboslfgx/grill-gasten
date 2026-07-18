/**
 * Server-only delivery config. Coordinates never go to the client bundle
 * when only imported from API routes / scripts.
 */

export const DELIVERY_ORIGIN_LABEL =
  process.env.DELIVERY_ORIGIN_LABEL?.trim() || "Klaaswaal";

export const MIN_QUOTE_SECRET_LENGTH = 32;

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

/**
 * Alleen DELIVERY_QUOTE_SECRET — geen fallback naar service-role of kitchen secret.
 * Minimaal 32 tekens.
 */
export function getQuoteSecret(): string {
  const secret = process.env.DELIVERY_QUOTE_SECRET?.trim() ?? "";
  if (secret.length < MIN_QUOTE_SECRET_LENGTH) {
    throw new Error("DELIVERY_QUOTE_SECRET_NOT_CONFIGURED");
  }
  return secret;
}

export function isQuoteSecretConfigured(): boolean {
  const secret = process.env.DELIVERY_QUOTE_SECRET?.trim() ?? "";
  return secret.length >= MIN_QUOTE_SECRET_LENGTH;
}

/**
 * Google Distance Matrix is verplicht voor online bezorgen.
 * Geen Haversine/postcode-fallback voor klanttarieven.
 */
export function isDeliveryRoutingConfigured(): boolean {
  const provider = (process.env.DELIVERY_DISTANCE_PROVIDER ?? "google").trim().toLowerCase();
  const key = process.env.GOOGLE_MAPS_API_KEY?.trim() ?? "";
  return provider === "google" && key.length > 0;
}

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
