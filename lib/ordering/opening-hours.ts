/**
 * Openingstijden — gesloten standaard tot eigenaar dagen bevestigt.
 */

export const orderingConfig = {
  /** Zet op true wanneer Supabase + Mollie live zijn en dagen zijn ingesteld. */
  orderingEnabled: false,

  /** ISO weekday: 0 = zondag … 6 = zaterdag — leeg = geen dagen open */
  openWeekdays: [] as number[],

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
  timezone: "Europe/Amsterdam",

  /** Legacy aliases */
  slotStart: "17:00",
  slotEnd: "21:00",
  slotMinutes: 15,
  slotCapacity: 12,
  minLeadMinutes: 60,
};

export type OrderingConfig = typeof orderingConfig;
