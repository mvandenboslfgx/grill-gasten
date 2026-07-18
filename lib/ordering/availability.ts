import { orderingConfig } from "@/lib/ordering/opening-hours";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Lokale datum YYYY-MM-DD in Europe/Amsterdam. */
export function todayIsoDate(): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: orderingConfig.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date());
}

export function parseHm(hm: string): number {
  const [h, m] = hm.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

export function formatHm(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${pad(h)}:${pad(m)}`;
}

export function generateSlots(): string[] {
  const start = parseHm(orderingConfig.slotStart);
  const end = parseHm(orderingConfig.slotEnd);
  const step = orderingConfig.slotMinutes;
  const slots: string[] = [];
  for (let t = start; t <= end; t += step) {
    slots.push(formatHm(t));
  }
  return slots;
}

function weekdayOf(isoDate: string): number {
  // Parse as local noon UTC to avoid DST edge cases for weekday
  const [y, mo, d] = isoDate.split("-").map(Number);
  const utc = new Date(Date.UTC(y!, mo! - 1, d!, 12, 0, 0));
  // Get weekday in Amsterdam
  const wd = new Intl.DateTimeFormat("en-US", {
    timeZone: orderingConfig.timezone,
    weekday: "short",
  }).format(utc);
  const map: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };
  return map[wd] ?? 0;
}

export function isDateOpen(isoDate: string): boolean {
  if (orderingConfig.closedDates.includes(isoDate)) return false;
  if (orderingConfig.extraOpenDates.includes(isoDate as never)) return true;
  return orderingConfig.openWeekdays.includes(weekdayOf(isoDate));
}

export function addDaysIso(isoDate: string, days: number): string {
  const [y, mo, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y!, mo! - 1, d! + days, 12, 0, 0));
  return dt.toISOString().slice(0, 10);
}

/** Beschikbare afhaaldatums (zonder slot-capaciteit check). */
export function getAvailableDates(): string[] {
  if (!orderingConfig.orderingEnabled) return [];
  const today = todayIsoDate();
  const out: string[] = [];
  for (let i = 0; i <= orderingConfig.daysAhead; i++) {
    const date = addDaysIso(today, i);
    if (isDateOpen(date)) out.push(date);
  }
  return out;
}

/**
 * Tijdsloten voor een datum die nog niet verlopen zijn (lead time).
 */
export function getAvailableSlotsForDate(isoDate: string, now = new Date()): string[] {
  if (!orderingConfig.orderingEnabled) return [];
  if (!isDateOpen(isoDate)) return [];

  const all = generateSlots();
  const today = todayIsoDate();
  if (isoDate < today) return [];
  if (isoDate > today) return all;

  // Vandaag: filter verlopen slots + lead time
  const nowParts = new Intl.DateTimeFormat("en-GB", {
    timeZone: orderingConfig.timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const hour = Number(nowParts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(nowParts.find((p) => p.type === "minute")?.value ?? 0);
  const nowMinutes = hour * 60 + minute + orderingConfig.minLeadMinutes;

  return all.filter((slot) => parseHm(slot) >= nowMinutes);
}

export function validatePickupMoment(
  date: string,
  time: string,
  now = new Date(),
): { ok: true } | { ok: false; error: string } {
  if (!orderingConfig.orderingEnabled) {
    return { ok: false, error: "Online bestellen is tijdelijk gesloten." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { ok: false, error: "Ongeldige datum." };
  }
  if (!/^\d{2}:\d{2}$/.test(time)) {
    return { ok: false, error: "Ongeldig tijdslot." };
  }
  const today = todayIsoDate();
  if (date < today) {
    return { ok: false, error: "Afhaaldatum mag niet in het verleden liggen." };
  }
  if (!isDateOpen(date)) {
    return { ok: false, error: "Op deze dag zijn we gesloten voor afhalen." };
  }
  const slots = getAvailableSlotsForDate(date, now);
  if (!slots.includes(time)) {
    return { ok: false, error: "Dit tijdslot is niet (meer) beschikbaar." };
  }
  return { ok: true };
}

export function isOrderingOpen(): boolean {
  return orderingConfig.orderingEnabled && getAvailableDates().length > 0;
}
