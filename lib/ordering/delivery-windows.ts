import { orderingConfig } from "@/lib/ordering/opening-hours";
import { formatHm, parseHm } from "@/lib/ordering/pickup-slots";

export type DeliveryWindow = {
  id: string;
  label: string;
  start: string;
  end: string;
};

/** Bezorgvensters van 30 minuten. */
export function generateDeliveryWindows(): DeliveryWindow[] {
  const start = parseHm(orderingConfig.deliveryWindowStart);
  const end = parseHm(orderingConfig.deliveryWindowEnd);
  const step = orderingConfig.deliveryWindowMinutes;
  const windows: DeliveryWindow[] = [];
  for (let t = start; t + step <= end; t += step) {
    const s = formatHm(t);
    const e = formatHm(t + step);
    windows.push({
      id: `${s}-${e}`,
      label: `${s.replace(":", ".")}–${e.replace(":", ".")}`,
      start: s,
      end: e,
    });
  }
  return windows;
}

export function getDeliveryWindowById(id: string): DeliveryWindow | undefined {
  return generateDeliveryWindows().find((w) => w.id === id);
}
