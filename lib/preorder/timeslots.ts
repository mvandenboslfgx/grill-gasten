/** Tijdsloten voor pre-order — 15 minuten, capaciteit per slot. */

export const SLOT_CAPACITY = 12;

export function generateTimeSlots(startHour = 17, endHour = 22, stepMinutes = 15): string[] {
  const slots: string[] = [];
  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      if (h === endHour && m > 0) break;
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return slots;
}

export const PICKUP_TIME_SLOTS = generateTimeSlots();
