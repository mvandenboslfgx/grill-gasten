import { kitchenLocation } from "@/lib/business/location";
import { getActiveDrinkProducts, getConfirmedDrinkProducts } from "@/lib/catalog/drinks";
import { getVisibleProducts } from "@/lib/catalog/products";
import { isQuoteSecretConfigured } from "@/lib/delivery/config";
import {
  deliveryConfig,
  isDeliveryConfigComplete,
} from "@/lib/delivery/delivery-config";
import { validatePostalZones } from "@/lib/delivery/postal-zones";
import { launchHoursAreValid } from "@/lib/ordering/launch-hours";
import { orderingConfig } from "@/lib/ordering/opening-hours";
import { getKitchenSecret, isMollieConfigured, isSupabaseConfigured } from "@/lib/supabase/env";
import { site } from "@/lib/site";

export type OrderingReadinessBlocker = {
  id: string;
  severity: "critical" | "high" | "medium";
  kind: "technical" | "business" | "operational";
  message: string;
  owner: "cursor" | "owner";
};

export type OrderingReadiness = {
  ready: boolean;
  publicAvailable: boolean;
  blockers: OrderingReadinessBlocker[];
};

/**
 * Activation gate: pickup + delivery day one.
 * Business config may be stored while flags stay off.
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
      message: "openWeekdays is leeg — activation-PR vereist (kandidaat: vr/za/zo).",
      owner: "owner",
    });
  }

  if (!orderingConfig.pickupEnabled) {
    blockers.push({
      id: "pickup_flag_off",
      severity: "critical",
      kind: "business",
      message: "pickupEnabled staat op false.",
      owner: "owner",
    });
  }

  if (!orderingConfig.deliveryEnabled || !deliveryConfig.enabled) {
    blockers.push({
      id: "delivery_flag_off",
      severity: "critical",
      kind: "business",
      message: "deliveryEnabled / deliveryConfig.enabled staat op false.",
      owner: "owner",
    });
  }

  if (!kitchenLocation.publicPickupAddressEnabled) {
    blockers.push({
      id: "public_pickup_address_off",
      severity: "critical",
      kind: "operational",
      message: "publicPickupAddressEnabled is false — volledig afhaaladres niet publiek.",
      owner: "owner",
    });
  }

  if (!kitchenLocation.municipalPickupUseConfirmed) {
    blockers.push({
      id: "municipal_pickup_unconfirmed",
      severity: "critical",
      kind: "operational",
      message: "Gemeentelijke bevestiging afhalen op keukenlocatie ontbreekt.",
      owner: "owner",
    });
  }

  if (!kitchenLocation.deliveryFromKitchenApproved) {
    blockers.push({
      id: "delivery_kitchen_unapproved",
      severity: "critical",
      kind: "operational",
      message: "Delivery vanaf keukenlocatie operationeel nog niet goedgekeurd.",
      owner: "owner",
    });
  }

  if (!kitchenLocation.nvwaRegistrationConfirmed) {
    blockers.push({
      id: "nvwa_unconfirmed",
      severity: "critical",
      kind: "operational",
      message: "NVWA-registratie nog niet bevestigd.",
      owner: "owner",
    });
  }

  if (!kitchenLocation.foodSafetyPlanConfirmed) {
    blockers.push({
      id: "food_safety_unconfirmed",
      severity: "critical",
      kind: "operational",
      message: "Voedselveiligheidsplan / HACCP-hygiënecode nog niet bevestigd.",
      owner: "owner",
    });
  }

  const zonesCheck = validatePostalZones();
  if (!zonesCheck.ok) {
    blockers.push({
      id: "postal_zones_invalid",
      severity: "critical",
      kind: "technical",
      message: `Postcodezones ongeldig (${zonesCheck.error}).`,
      owner: "cursor",
    });
  }

  if (deliveryConfig.pricingMode !== "postcode_zones") {
    blockers.push({
      id: "pricing_mode_wrong",
      severity: "critical",
      kind: "business",
      message: "Launch vereist pricingMode postcode_zones.",
      owner: "cursor",
    });
  }

  if (deliveryConfig.freeDeliveryThresholdCents !== null) {
    blockers.push({
      id: "free_delivery_enabled",
      severity: "critical",
      kind: "business",
      message: "Gratis bezorgen moet uit (freeDeliveryThresholdCents null).",
      owner: "owner",
    });
  }

  if (deliveryConfig.enabled && !isDeliveryConfigComplete()) {
    blockers.push({
      id: "delivery_config_incomplete",
      severity: "critical",
      kind: "business",
      message: "Deliveryconfig onvolledig terwijl enabled true.",
      owner: "owner",
    });
  }

  if (!launchHoursAreValid()) {
    blockers.push({
      id: "launch_hours_invalid",
      severity: "critical",
      kind: "business",
      message: "Launch-kandidaat openingstijden ongeldig.",
      owner: "cursor",
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

  blockers.push({
    id: "mollie_e2e_required",
    severity: "high",
    kind: "operational",
    message: "Mollie testmode E2E (pickup + delivery) nog vereist vóór activatie.",
    owner: "owner",
  });

  blockers.push({
    id: "readiness_migration_required",
    severity: "high",
    kind: "operational",
    message: "Migratie 20260719210000_ordering_readiness.sql nog remote toepassen.",
    owner: "owner",
  });

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

  const food = getVisibleProducts().filter(
    (p) => p.category !== "drinks" && p.category !== "sauces",
  );
  if (food.length === 0) {
    blockers.push({
      id: "no_active_food",
      severity: "critical",
      kind: "business",
      message: "Geen actief gerecht in de servercatalogus.",
      owner: "cursor",
    });
  }

  if (getConfirmedDrinkProducts().length < 6) {
    blockers.push({
      id: "drinks_incomplete",
      severity: "critical",
      kind: "business",
      message: "Niet alle zes launch-dranken zijn bevestigd.",
      owner: "owner",
    });
  }

  if (getActiveDrinkProducts().length === 0) {
    blockers.push({
      id: "no_active_drinks",
      severity: "critical",
      kind: "business",
      message: "Geen drank op voorraad (available).",
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

  // Publiek mag geen Molendijk lekken
  if (site.address.toLowerCase().includes("molendijk")) {
    blockers.push({
      id: "public_address_leak",
      severity: "critical",
      kind: "technical",
      message: "site.address bevat keukenstraat — niet toegestaan.",
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
