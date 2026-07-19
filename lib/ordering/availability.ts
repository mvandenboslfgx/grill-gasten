import { orderingConfig } from "@/lib/ordering/opening-hours";
import { generateDeliveryWindows, type DeliveryWindow } from "@/lib/ordering/delivery-windows";
import { generatePickupSlots, parseHm } from "@/lib/ordering/pickup-slots";

export function todayIsoDate(): string {
  const fmt = new Intl.DateTimeFormat("en-CA", {
    timeZone: orderingConfig.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  return fmt.format(new Date());
}

function weekdayOf(isoDate: string): number {
  const [y, mo, d] = isoDate.split("-").map(Number);
  const utc = new Date(Date.UTC(y!, mo! - 1, d!, 12, 0, 0));
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
  if ((orderingConfig.extraOpenDates as string[]).includes(isoDate)) return true;
  if (orderingConfig.openWeekdays.length === 0) return false;
  return orderingConfig.openWeekdays.includes(weekdayOf(isoDate));
}

export function addDaysIso(isoDate: string, days: number): string {
  const [y, mo, d] = isoDate.split("-").map(Number);
  const dt = new Date(Date.UTC(y!, mo! - 1, d! + days, 12, 0, 0));
  return dt.toISOString().slice(0, 10);
}

export function getAvailableDates(): string[] {
  if (!orderingConfig.orderingEnabled) return [];
  if (!orderingConfig.pickupEnabled && !orderingConfig.deliveryEnabled) return [];
  const today = todayIsoDate();
  const out: string[] = [];
  const horizon = orderingConfig.maximumAdvanceDays ?? orderingConfig.daysAhead;
  for (let i = 0; i <= horizon; i++) {
    const date = addDaysIso(today, i);
    if (isDateOpen(date)) out.push(date);
  }
  return out;
}

function nowMinutes(now: Date): number {
  const nowParts = new Intl.DateTimeFormat("en-GB", {
    timeZone: orderingConfig.timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(now);
  const hour = Number(nowParts.find((p) => p.type === "hour")?.value ?? 0);
  const minute = Number(nowParts.find((p) => p.type === "minute")?.value ?? 0);
  return hour * 60 + minute;
}

export function getAvailablePickupSlots(isoDate: string, now = new Date()): string[] {
  if (
    !orderingConfig.orderingEnabled ||
    !orderingConfig.pickupEnabled ||
    !isDateOpen(isoDate)
  ) {
    return [];
  }
  const all = generatePickupSlots();
  const today = todayIsoDate();
  if (isoDate < today) return [];
  if (isoDate > today) return all;
  const threshold = nowMinutes(now) + orderingConfig.minLeadMinutesPickup;
  return all.filter((slot) => parseHm(slot) >= threshold);
}

export function getAvailableDeliveryWindows(
  isoDate: string,
  now = new Date(),
): DeliveryWindow[] {
  if (
    !orderingConfig.orderingEnabled ||
    !orderingConfig.deliveryEnabled ||
    !isDateOpen(isoDate)
  ) {
    return [];
  }
  const all = generateDeliveryWindows();
  const today = todayIsoDate();
  if (isoDate < today) return [];
  if (isoDate > today) return all;
  const threshold = nowMinutes(now) + orderingConfig.minLeadMinutesDelivery;
  return all.filter((w) => parseHm(w.start) >= threshold);
}

export function validatePickupMoment(
  date: string,
  time: string,
  now = new Date(),
): { ok: true } | { ok: false; error: string } {
  if (!orderingConfig.orderingEnabled || !orderingConfig.pickupEnabled) {
    return { ok: false, error: "Online bestellen is momenteel gesloten." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { ok: false, error: "Ongeldige datum." };
  }
  if (!/^\d{2}:\d{2}$/.test(time)) {
    return { ok: false, error: "Ongeldig tijdslot." };
  }
  if (date < todayIsoDate()) {
    return { ok: false, error: "Afhaaldatum mag niet in het verleden liggen." };
  }
  if (!isDateOpen(date)) {
    return { ok: false, error: "Op deze dag zijn we gesloten." };
  }
  const slots = getAvailablePickupSlots(date, now);
  if (!slots.includes(time)) {
    return { ok: false, error: "Dit afhaalmoment is niet (meer) beschikbaar." };
  }
  return { ok: true };
}

export function validateDeliveryMoment(
  date: string,
  windowId: string,
  now = new Date(),
): { ok: true } | { ok: false; error: string } {
  if (!orderingConfig.orderingEnabled || !orderingConfig.deliveryEnabled) {
    return { ok: false, error: "Online bestellen is momenteel gesloten." };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { ok: false, error: "Ongeldige datum." };
  }
  if (date < todayIsoDate()) {
    return { ok: false, error: "Bezorgdatum mag niet in het verleden liggen." };
  }
  if (!isDateOpen(date)) {
    return { ok: false, error: "Op deze dag zijn we gesloten." };
  }
  const windows = getAvailableDeliveryWindows(date, now);
  if (!windows.some((w) => w.id === windowId)) {
    return { ok: false, error: "Dit bezorgtijdvak is niet (meer) beschikbaar." };
  }
  return { ok: true };
}

export function isOrderingOpen(): boolean {
  return orderingConfig.orderingEnabled && getAvailableDates().length > 0;
}

/** @deprecated use getAvailablePickupSlots */
export function getAvailableSlotsForDate(isoDate: string, now = new Date()): string[] {
  return getAvailablePickupSlots(isoDate, now);
}
