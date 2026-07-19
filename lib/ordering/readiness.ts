import { getVisibleProducts } from "@/lib/catalog/products";
import {
  isDeliveryRoutingConfigured,
  isQuoteSecretConfigured,
} from "@/lib/delivery/config";
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
  /** Safe for public: never expose secrets or infra detail */
  publicAvailable: boolean;
  blockers: OrderingReadinessBlocker[];
};

function hasConfirmedPickupAddress(): boolean {
  // Regional placeholder is not a street pickup address.
  const a = site.address.toLowerCase();
  return Boolean(a) && !a.includes("regio") && !a.includes("aanvraag");
}

/**
 * Server-side activation gate. Ordering stays closed until every blocker is cleared
 * AND orderingEnabled / openWeekdays are set by the owner.
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

  if (!orderingConfig.pickupEnabled && !orderingConfig.deliveryEnabled) {
    blockers.push({
      id: "no_fulfillment_mode",
      severity: "critical",
      kind: "business",
      message: "Noch pickup noch delivery is geactiveerd in orderingConfig.",
      owner: "owner",
    });
  }

  if (orderingConfig.pickupEnabled && !hasConfirmedPickupAddress()) {
    blockers.push({
      id: "pickup_address_unconfirmed",
      severity: "critical",
      kind: "business",
      message: "Afhaaladres is niet als concreet straatadres bevestigd.",
      owner: "owner",
    });
  }

  if (orderingConfig.deliveryEnabled) {
    if (!isDeliveryRoutingConfigured()) {
      blockers.push({
        id: "delivery_maps_missing",
        severity: "critical",
        kind: "technical",
        message: "Delivery staat aan maar Google Maps routing is niet geconfigureerd.",
        owner: "owner",
      });
    }
    if (!isQuoteSecretConfigured()) {
      blockers.push({
        id: "delivery_quote_secret_missing",
        severity: "critical",
        kind: "technical",
        message: "Delivery staat aan maar DELIVERY_QUOTE_SECRET ontbreekt of is te kort.",
        owner: "owner",
      });
    }
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

  const activeProducts = getVisibleProducts();
  if (activeProducts.length === 0) {
    blockers.push({
      id: "no_active_products",
      severity: "critical",
      kind: "business",
      message: "Geen actieve producten in de servercatalogus.",
      owner: "cursor",
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
    orderingConfig.openWeekdays.length > 0 &&
    isSupabaseConfigured() &&
    isMollieConfigured();

  return { ready, publicAvailable, blockers };
}
