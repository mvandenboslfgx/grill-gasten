/**
 * Openingstijden & bestelconfig — gesloten standaard tot eigenaar activeert.
 * Alle bedragen in gehele eurocenten. Geen floating-point.
 */

export const orderingConfig = {
  /** Zet op true wanneer Supabase + Mollie live zijn en dagen zijn ingesteld. */
  orderingEnabled: false,

  /**
   * Activatieschakelaar pickup — blijft false tot afhaaladres + openingstijden
   * zakelijk bevestigd zijn (zie docs/ORDERING-LAUNCH-CHECKLIST.md).
   */
  pickupEnabled: false,

  /**
   * Activatieschakelaar delivery — blijft false tot zones/kosten/env bevestigd zijn.
   */
  deliveryEnabled: false,

  orderingMode: "pickup_and_delivery" as const,

  /** ISO weekday: 0 = zondag … 6 = zaterdag — leeg = geen dagen open */
  openWeekdays: [] as number[],

  timezone: "Europe/Amsterdam",

  /** Voorbereiding / lead time (pickup) */
  preparationMinutes: 60,
  orderingCutoffMinutes: 60,
  slotIntervalMinutes: 15,
  maximumAdvanceDays: 14,

  /** Bedragen in centen — 0 = geen minimum tot zakelijk bevestigd */
  minimumOrderAmountCents: 0,
  maximumOrderAmountCents: 50_000,
  serviceFeeCents: 0,

  pickupSlotStart: "17:00",
  pickupSlotEnd: "21:00",
  pickupSlotMinutes: 15,
  pickupSlotCapacity: 12,

  deliveryWindowStart: "17:00",
  deliveryWindowEnd: "21:00",
  deliveryWindowMinutes: 30,
  deliveryWindowCapacity: 8,

  minLeadMinutesPickup: 60,
  minLeadMinutesDelivery: 90,

  daysAhead: 14,
  closedDates: [] as string[],
  extraOpenDates: [] as string[],

  /** Legacy aliases — gehouden voor bestaande imports */
  slotStart: "17:00",
  slotEnd: "21:00",
  slotMinutes: 15,
  slotCapacity: 12,
  minLeadMinutes: 60,
};

export type OrderingConfig = typeof orderingConfig;
