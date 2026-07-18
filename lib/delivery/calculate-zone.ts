import type { DeliveryZone } from "@/lib/delivery/types";
import { zoneForDistanceMeters } from "@/lib/delivery/zones";

export function calculateZone(distanceMeters: number): DeliveryZone | null {
  return zoneForDistanceMeters(distanceMeters);
}

export function metersToKmDisplay(meters: number): number {
  return Math.round((meters / 1000) * 100) / 100;
}
