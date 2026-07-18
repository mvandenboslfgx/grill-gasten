/**
 * Openingstijden en bestelconfiguratie.
 * Pas openDays / slots aan wanneer online bestellen actief is.
 *
 * orderingEnabled = false → frontend toont “tijdelijk gesloten” + WhatsApp.
 */

export const orderingConfig = {
  /** Zet op true wanneer Supabase + Mollie live zijn en dagen zijn ingesteld. */
  orderingEnabled: false,

  /** ISO weekday: 0 = zondag … 6 = zaterdag */
  openWeekdays: [5, 6] as number[], // vrijdag + zaterdag (voorbeeld; aanpassen)

  /** HH:mm slots */
  slotStart: "17:00",
  slotEnd: "21:00",
  slotMinutes: 15,
  slotCapacity: 12,

  /** Minimaal aantal minuten vooruit bestellen */
  minLeadMinutes: 60,

  /** Hoeveel dagen vooruit zichtbaar */
  daysAhead: 14,

  /** YYYY-MM-DD gesloten */
  closedDates: [] as string[],

  /** YYYY-MM-DD extra open (overschrijft weekday) */
  extraOpenDates: [] as string[],

  timezone: "Europe/Amsterdam",
} as const;

export type OrderingConfig = typeof orderingConfig;
