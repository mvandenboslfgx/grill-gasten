import { getOptionById } from "@/lib/catalog/options";
import { formatPriceCents } from "@/lib/catalog/format-money";

export type OrderLineView = {
  productId: string;
  name: string;
  qty: number;
  optionIds: string[];
  options: Array<{ id: string; label: string; priceCents: number }>;
  sauceChoice: string | null;
  note: string | null;
  unitPriceCents: number;
  lineTotalCents: number;
};

export function parseOrderLines(raw: unknown): OrderLineView[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const row = (item ?? {}) as Record<string, unknown>;
    const optionIds = Array.isArray(row.optionIds)
      ? row.optionIds.filter((id): id is string => typeof id === "string")
      : [];
    const labels = Array.isArray(row.optionLabels)
      ? row.optionLabels.filter((l): l is string => typeof l === "string")
      : [];

    const options = optionIds.map((id, i) => {
      const opt = getOptionById(id);
      return {
        id,
        label: opt?.name ?? labels[i] ?? id,
        priceCents: opt?.priceCents ?? 0,
      };
    });

    // Labels without matching ids (legacy)
    if (options.length === 0 && labels.length > 0) {
      for (const label of labels) {
        options.push({ id: "", label, priceCents: 0 });
      }
    }

    return {
      productId: typeof row.productId === "string" ? row.productId : "",
      name: typeof row.name === "string" ? row.name : "Product",
      qty: typeof row.qty === "number" && row.qty > 0 ? row.qty : 1,
      optionIds,
      options,
      sauceChoice:
        typeof row.sauceChoice === "string" && row.sauceChoice.trim()
          ? row.sauceChoice.trim()
          : null,
      note: typeof row.note === "string" && row.note.trim() ? row.note.trim() : null,
      unitPriceCents: typeof row.unitPriceCents === "number" ? row.unitPriceCents : 0,
      lineTotalCents: typeof row.lineTotalCents === "number" ? row.lineTotalCents : 0,
    };
  });
}

export function formatLineForKitchen(line: OrderLineView): string {
  const parts = [`${line.qty}× ${line.name}`];
  for (const o of line.options) {
    const price =
      o.priceCents > 0 ? ` (+${formatPriceCents(o.priceCents)})` : o.priceCents === 0 ? " (gratis)" : "";
    parts.push(`  - ${o.label}${price}`);
  }
  if (line.sauceChoice) parts.push(`  - Saus: ${line.sauceChoice}`);
  if (line.note) parts.push(`  - Wens: ${line.note}`);
  return parts.join("\n");
}

export function formatAddress(order: {
  delivery_street?: string | null;
  delivery_house_number?: string | null;
  delivery_addition?: string | null;
  delivery_postcode?: string | null;
  delivery_city?: string | null;
}): string {
  const line1 = [
    order.delivery_street,
    order.delivery_house_number,
    order.delivery_addition,
  ]
    .filter(Boolean)
    .join(" ");
  const line2 = [order.delivery_postcode, order.delivery_city].filter(Boolean).join(" ");
  return [line1, line2].filter(Boolean).join(", ");
}

export function mapsUrl(order: {
  delivery_street?: string | null;
  delivery_house_number?: string | null;
  delivery_addition?: string | null;
  delivery_postcode?: string | null;
  delivery_city?: string | null;
}): string {
  const q = formatAddress(order);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
}

export function extractCustomerNoteFromSnapshot(notes: string | null | undefined): string | null {
  if (!notes) return null;
  const m = /Opmerking klant:\s*([\s\S]+?)(?:\n\n|$)/i.exec(notes);
  return m?.[1]?.trim() || null;
}
