import { getActiveDrinkProducts, getConfirmedDrinkProducts } from "@/lib/catalog/drinks";
import { getVisibleProducts } from "@/lib/catalog/products";
import {
  isDeliveryRoutingConfigured,
  isQuoteSecretConfigured,
} from "@/lib/delivery/config";
import {
  deliveryConfig,
  isDeliveryConfigComplete,
} from "@/lib/delivery/delivery-config";
import { orderingConfig } from "@/lib/ordering/opening-hours";
import { getKitchenSecret, isMollieConfigured, isSupabaseConfigured } from "@/lib/supabase/env";
import { site } from "@/lib/site";

export type OrderingReadinessBlocker = {
  id: string;
  severity: "critical" | "high" | "medium";
  kind: "technical" | "business";
  message: string;
  owner: "cursor" | "owner";
};

export type OrderingReadiness = {
  ready: boolean;
  publicAvailable: boolean;
  blockers: OrderingReadinessBlocker[];
};

function hasConfirmedPickupAddress(): boolean {
  const a = site.address.toLowerCase();
  return Boolean(a) && !a.includes("regio") && !a.includes("aanvraag");
}

/**
 * Launch = pickup + delivery from day one.
 * Ready only when BOTH fulfillment modes and drinks are fully configured.
 */
export function getOrderingReadiness(): OrderingReadiness {
  const blockers: OrderingReadinessBlocker[] = [];

  if (!orderingConfig.orderingEnabled) {
    blockers.push({
      id: "ordering_flag_off",
      severity: "critical",
      kind: "business",
      message: "orderingEnabled staat op false (bewuste schakelaar).",
      owner: "owner",
    });
  }

  if (!orderingConfig.openWeekdays.length) {
    blockers.push({
      id: "no_open_weekdays",
      severity: "critical",
      kind: "business",
      message: "openWeekdays is leeg — geen openingsdagen bevestigd.",
      owner: "owner",
    });
  }

  // Day-one launch requires BOTH pickup and delivery
  if (!orderingConfig.pickupEnabled) {
    blockers.push({
      id: "pickup_flag_off",
      severity: "critical",
      kind: "business",
      message: "pickupEnabled staat op false — launch vereist afhalen én bezorgen.",
      owner: "owner",
    });
  }

  if (!orderingConfig.deliveryEnabled || !deliveryConfig.enabled) {
    blockers.push({
      id: "delivery_flag_off",
      severity: "critical",
      kind: "business",
      message: "deliveryEnabled staat op false — launch vereist afhalen én bezorgen.",
      owner: "owner",
    });
  }

  if (!hasConfirmedPickupAddress()) {
    blockers.push({
      id: "pickup_address_unconfirmed",
      severity: "critical",
      kind: "business",
      message: "Afhaaladres is niet als concreet straatadres bevestigd.",
      owner: "owner",
    });
  }

  if (!isDeliveryConfigComplete()) {
    blockers.push({
      id: "delivery_config_incomplete",
      severity: "critical",
      kind: "business",
      message:
        "Deliveryconfig onvolledig (postcode-allowlist, pricingMode, fee/min of zone-bevestiging).",
      owner: "owner",
    });
  }

  if (deliveryConfig.allowedPostalCodeAreas.length === 0) {
    blockers.push({
      id: "delivery_area_empty",
      severity: "critical",
      kind: "business",
      message: "allowedPostalCodeAreas is leeg — bezorggebied niet bevestigd.",
      owner: "owner",
    });
  }

  if (
    deliveryConfig.pricingMode === "distance_zones" &&
    !isDeliveryRoutingConfigured()
  ) {
    blockers.push({
      id: "delivery_maps_missing",
      severity: "critical",
      kind: "technical",
      message: "distance_zones vereist GOOGLE_MAPS_API_KEY (server-only).",
      owner: "owner",
    });
  }

  if (!isQuoteSecretConfigured()) {
    blockers.push({
      id: "delivery_quote_secret_missing",
      severity: "critical",
      kind: "technical",
      message: "DELIVERY_QUOTE_SECRET ontbreekt of is te kort.",
      owner: "owner",
    });
  }

  if (orderingConfig.pickupSlotCapacity <= 0 || deliveryConfig.maximumOrdersPerSlot <= 0) {
    blockers.push({
      id: "invalid_capacity",
      severity: "critical",
      kind: "business",
      message: "Pickup- of deliverycapaciteit per slot is ongeldig.",
      owner: "owner",
    });
  }

  if (!isSupabaseConfigured()) {
    blockers.push({
      id: "supabase_missing",
      severity: "critical",
      kind: "technical",
      message: "Supabase URL of service-role key ontbreekt.",
      owner: "owner",
    });
  }

  if (!isMollieConfigured()) {
    blockers.push({
      id: "mollie_missing",
      severity: "critical",
      kind: "technical",
      message: "MOLLIE_API_KEY ontbreekt.",
      owner: "owner",
    });
  }

  if (!process.env.NEXT_PUBLIC_SITE_URL?.trim() && !site.url) {
    blockers.push({
      id: "site_url_missing",
      severity: "high",
      kind: "technical",
      message: "Publieke site-URL is niet geconfigureerd.",
      owner: "owner",
    });
  }

  if (!getKitchenSecret()) {
    blockers.push({
      id: "kitchen_secret_missing",
      severity: "high",
      kind: "technical",
      message: "KITCHEN_SECRET ontbreekt of is korter dan 32 tekens.",
      owner: "owner",
    });
  }

  const food = getVisibleProducts().filter((p) => p.category !== "drinks" && p.category !== "sauces");
  if (food.length === 0) {
    blockers.push({
      id: "no_active_food",
      severity: "critical",
      kind: "business",
      message: "Geen actief gerecht in de servercatalogus.",
      owner: "cursor",
    });
  }

  if (getActiveDrinkProducts().length === 0) {
    blockers.push({
      id: "no_active_drinks",
      severity: "critical",
      kind: "business",
      message:
        "Geen bevestigde actieve frisdrank (prijs + maat + ownerConfirmed vereist).",
      owner: "owner",
    });
  }

  if (getConfirmedDrinkProducts().length === 0) {
    blockers.push({
      id: "drinks_unconfirmed",
      severity: "high",
      kind: "business",
      message: "Frisdrankdrafts staan klaar maar zijn nog niet door de eigenaar bevestigd.",
      owner: "owner",
    });
  }

  if (orderingConfig.preparationMinutes <= 0 || orderingConfig.slotIntervalMinutes <= 0) {
    blockers.push({
      id: "invalid_slot_config",
      severity: "critical",
      kind: "technical",
      message: "Ongeldige preparation- of slotinterval-configuratie.",
      owner: "cursor",
    });
  }

  const critical = blockers.filter((b) => b.severity === "critical");
  const ready = critical.length === 0;
  const publicAvailable =
    ready &&
    orderingConfig.orderingEnabled &&
    orderingConfig.pickupEnabled &&
    orderingConfig.deliveryEnabled &&
    orderingConfig.openWeekdays.length > 0 &&
    isSupabaseConfigured() &&
    isMollieConfigured();

  return { ready, publicAvailable, blockers };
}
