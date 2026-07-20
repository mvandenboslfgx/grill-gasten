/**
 * Openingstijden & bestelconfig — gesloten standaard tot eigenaar activeert.
 * Launchscope: afhalen én bezorgen vanaf dag 1.
 * openWeekdays blijft [] tot aparte activation-PR (uren staan in launch-hours candidate).
 */

export const orderingConfig = {
  orderingEnabled: false,
  pickupEnabled: false,
  deliveryEnabled: false,
  orderingMode: "pickup_and_delivery" as const,

  /** Leeg tot activation-PR — voorkomt dat uren bestellen automatisch openen */
  openWeekdays: [] as number[],

  timezone: "Europe/Amsterdam",

  /** Bevestigde launch-waarden (actief pas mét flags + openWeekdays) */
  preparationMinutes: 25,
  orderingCutoffMinutes: 30,
  slotIntervalMinutes: 15,
  maximumAdvanceDays: 7,

  minimumOrderAmountCents: 0,
  maximumOrderAmountCents: 15_000,
  serviceFeeCents: 0,

  /** Fallbackvensters — per-dag overrides in launch-hours wanneer geactiveerd */
  pickupSlotStart: "16:30",
  pickupSlotEnd: "22:00",
  pickupSlotMinutes: 15,
  pickupSlotCapacity: 4,

  deliveryWindowStart: "17:00",
  deliveryWindowEnd: "21:30",
  deliveryWindowMinutes: 30,
  deliveryWindowCapacity: 2,

  minLeadMinutesPickup: 25,
  minLeadMinutesDelivery: 35,

  daysAhead: 7,
  closedDates: [] as string[],
  extraOpenDates: [] as string[],

  slotStart: "16:30",
  slotEnd: "22:00",
  slotMinutes: 15,
  slotCapacity: 4,
  minLeadMinutes: 25,
};

export type OrderingConfig = typeof orderingConfig;
