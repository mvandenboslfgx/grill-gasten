/**
 * Centrale delivery-configuratie — bedragen in eurocenten.
 * Launch: postcode_zones (Hoeksche Waard). Maps uit. Gratis bezorgen uit.
 * enabled blijft false tot activation-PR.
 */

import {
  allPostalZonePrefixes,
  validatePostalZones,
} from "@/lib/delivery/postal-zones";

export type DeliveryPricingMode =
  | "unconfigured"
  | "flat_fee"
  | "distance_zones"
  | "postcode_zones";

export type DeliveryConfig = {
  enabled: boolean;
  pricingMode: DeliveryPricingMode;
  /** Flat-fee only; unused in postcode_zones */
  minimumOrderAmountCents: number | null;
  deliveryFeeCents: number | null;
  /** null = bewust uit */
  freeDeliveryThresholdCents: number | null;
  maximumDistanceKm: number | null;
  allowedPostalCodeAreas: string[];
  blockedPostalCodes: string[];
  deliveryPreparationMinutes: number;
  deliverySlotIntervalMinutes: number;
  maximumAdvanceDays: number;
  orderingCutoffMinutes: number;
  maximumOrdersPerSlot: number;
  distanceZonesOwnerConfirmed: boolean;
};

export type FulfilmentCapacity = {
  pickupOrdersPerSlot: number;
  deliveryOrdersPerSlot: number;
};

export const deliveryConfig: DeliveryConfig = {
  enabled: false,
  pricingMode: "postcode_zones",
  minimumOrderAmountCents: null,
  deliveryFeeCents: null,
  freeDeliveryThresholdCents: null,
  maximumDistanceKm: null,
  allowedPostalCodeAreas: allPostalZonePrefixes(),
  /** Tiengemeten eiland — niet online bezorgen */
  blockedPostalCodes: ["3284BE"],
  deliveryPreparationMinutes: 35,
  deliverySlotIntervalMinutes: 30,
  maximumAdvanceDays: 7,
  orderingCutoffMinutes: 30,
  maximumOrdersPerSlot: 2,
  distanceZonesOwnerConfirmed: false,
};

export function isDeliveryConfigComplete(cfg: DeliveryConfig = deliveryConfig): boolean {
  if (!cfg.enabled) return false;
  if (cfg.maximumOrdersPerSlot <= 0) return false;
  if (cfg.deliveryPreparationMinutes <= 0) return false;
  if (cfg.deliverySlotIntervalMinutes <= 0) return false;
  if (cfg.freeDeliveryThresholdCents !== null) return false; // launch: gratis bezorgen uit

  if (cfg.pricingMode === "unconfigured") return false;

  if (cfg.pricingMode === "postcode_zones") {
    if (cfg.allowedPostalCodeAreas.length === 0) return false;
    const zonesOk = validatePostalZones();
    return zonesOk.ok;
  }

  if (cfg.pricingMode === "flat_fee") {
    return (
      cfg.allowedPostalCodeAreas.length > 0 &&
      cfg.deliveryFeeCents !== null &&
      cfg.deliveryFeeCents >= 0 &&
      cfg.minimumOrderAmountCents !== null &&
      cfg.minimumOrderAmountCents > 0
    );
  }

  if (cfg.pricingMode === "distance_zones") {
    return (
      cfg.distanceZonesOwnerConfirmed &&
      cfg.maximumDistanceKm !== null &&
      cfg.maximumDistanceKm > 0
    );
  }

  return false;
}

export function isDeliveryAvailable(cfg: DeliveryConfig = deliveryConfig): boolean {
  return cfg.enabled && isDeliveryConfigComplete(cfg);
}

export function applyFreeDeliveryThreshold(
  feeCents: number,
  subtotalCents: number,
  thresholdCents: number | null,
): number {
  if (thresholdCents === null || thresholdCents <= 0) return feeCents;
  if (subtotalCents >= thresholdCents) return 0;
  return feeCents;
}
