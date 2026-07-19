/**
 * Centrale delivery-configuratie — bedragen in eurocenten.
 * Ontbrekende/ongeldige waarden ⇒ deliveryAvailable = false (geen permissieve defaults).
 *
 * Zone-tabel in zones.ts is een technische skeleton; launch vereist
 * ownerConfirmed-velden + postcode-allowlist.
 */

export type DeliveryPricingMode = "unconfigured" | "flat_fee" | "distance_zones";

export type DeliveryConfig = {
  /** Spiegel van orderingConfig.deliveryEnabled — niet alleen aanzetten. */
  enabled: boolean;
  pricingMode: DeliveryPricingMode;
  /** null = niet door eigenaar bevestigd */
  minimumOrderAmountCents: number | null;
  /** Flat-fee modus; null wanneer distance_zones of unconfigured */
  deliveryFeeCents: number | null;
  /** null = bewust uit / niet bevestigd */
  freeDeliveryThresholdCents: number | null;
  maximumDistanceKm: number | null;
  /**
   * Allowlist: 4-cijferige gebiedscodes (bijv. "3281") of volledige 6-teken postcodes.
   * Leeg = gebied niet bevestigd → delivery niet launch-ready.
   */
  allowedPostalCodeAreas: string[];
  blockedPostalCodes: string[];
  deliveryPreparationMinutes: number;
  deliverySlotIntervalMinutes: number;
  maximumAdvanceDays: number;
  orderingCutoffMinutes: number;
  maximumOrdersPerSlot: number;
  /** Eigenaar heeft DELIVERY_ZONES-tarieven zakelijk goedgekeurd */
  distanceZonesOwnerConfirmed: boolean;
};

export type FulfilmentCapacity = {
  pickupOrdersPerSlot: number;
  deliveryOrdersPerSlot: number;
};

/**
 * Launch-defaults: technisch voorbereid, zakelijk nog niet bevestigd.
 * Geen verzonnen postcodes of tarieven als “live”.
 */
export const deliveryConfig: DeliveryConfig = {
  enabled: false,
  pricingMode: "unconfigured",
  minimumOrderAmountCents: null,
  deliveryFeeCents: null,
  freeDeliveryThresholdCents: null,
  maximumDistanceKm: null,
  allowedPostalCodeAreas: [],
  blockedPostalCodes: ["3284BE"],
  deliveryPreparationMinutes: 90,
  deliverySlotIntervalMinutes: 30,
  maximumAdvanceDays: 14,
  orderingCutoffMinutes: 90,
  maximumOrdersPerSlot: 8,
  distanceZonesOwnerConfirmed: false,
};

export function isDeliveryConfigComplete(cfg: DeliveryConfig = deliveryConfig): boolean {
  if (!cfg.enabled) return false;
  if (cfg.allowedPostalCodeAreas.length === 0) return false;
  if (cfg.maximumOrdersPerSlot <= 0) return false;
  if (cfg.deliveryPreparationMinutes <= 0) return false;
  if (cfg.deliverySlotIntervalMinutes <= 0) return false;

  if (cfg.pricingMode === "unconfigured") return false;

  if (cfg.pricingMode === "flat_fee") {
    return (
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

/** Runtime: mag delivery-quote/order worden aangeboden? */
export function isDeliveryAvailable(cfg: DeliveryConfig = deliveryConfig): boolean {
  return cfg.enabled && isDeliveryConfigComplete(cfg);
}

/**
 * Pas gratis-bezorgdrempel toe (server-side).
 * threshold null ⇒ geen gratis bezorging.
 */
export function applyFreeDeliveryThreshold(
  feeCents: number,
  subtotalCents: number,
  thresholdCents: number | null,
): number {
  if (thresholdCents === null || thresholdCents <= 0) return feeCents;
  if (subtotalCents >= thresholdCents) return 0;
  return feeCents;
}
