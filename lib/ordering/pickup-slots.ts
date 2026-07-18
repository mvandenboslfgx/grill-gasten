import { orderingConfig } from "@/lib/ordering/opening-hours";

function pad(n: number): string {
  return String(n).padStart(2, "0");
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

export function generatePickupSlots(): string[] {
  const start = parseHm(orderingConfig.pickupSlotStart);
  const end = parseHm(orderingConfig.pickupSlotEnd);
  const step = orderingConfig.pickupSlotMinutes;
  const slots: string[] = [];
  for (let t = start; t <= end; t += step) {
    slots.push(formatHm(t));
  }
  return slots;
}
