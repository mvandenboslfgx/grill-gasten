import type { DeliveryZone } from "@/lib/delivery/types";

/** Max enkele reis: 25 km */
export const MAX_DELIVERY_METERS = 25_000;

/** Quote geldigheid */
export const QUOTE_TTL_MS = 15 * 60 * 1000;

/**
 * Zones op exacte meters (bovengrens inclusief).
 * 0–3000, 3001–7000, …, 20001–25000
 */
export const DELIVERY_ZONES: readonly DeliveryZone[] = [
  {
    id: 1,
    minMeters: 0,
    maxMeters: 3_000,
    feeCents: 299,
    minOrderCents: 1_500,
    label: "Zone 1 (0–3 km)",
  },
  {
    id: 2,
    minMeters: 3_001,
    maxMeters: 7_000,
    feeCents: 449,
    minOrderCents: 2_000,
    label: "Zone 2 (3–7 km)",
  },
  {
    id: 3,
    minMeters: 7_001,
    maxMeters: 11_000,
    feeCents: 599,
    minOrderCents: 2_500,
    label: "Zone 3 (7–11 km)",
  },
  {
    id: 4,
    minMeters: 11_001,
    maxMeters: 15_000,
    feeCents: 749,
    minOrderCents: 3_000,
    label: "Zone 4 (11–15 km)",
  },
  {
    id: 5,
    minMeters: 15_001,
    maxMeters: 20_000,
    feeCents: 949,
    minOrderCents: 3_500,
    label: "Zone 5 (15–20 km)",
  },
  {
    id: 6,
    minMeters: 20_001,
    maxMeters: 25_000,
    feeCents: 1_249,
    minOrderCents: 4_500,
    label: "Zone 6 (20–25 km)",
  },
] as const;

export function zoneForDistanceMeters(meters: number): DeliveryZone | null {
  if (!Number.isFinite(meters) || meters < 0) return null;
  const m = Math.round(meters);
  if (m > MAX_DELIVERY_METERS) return null;
  return DELIVERY_ZONES.find((z) => m >= z.minMeters && m <= z.maxMeters) ?? null;
}
