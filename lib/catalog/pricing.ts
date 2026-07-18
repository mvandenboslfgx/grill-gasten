import { getOptionById } from "@/lib/catalog/options";
import { getProductById } from "@/lib/catalog/products";
import type {
  ClientOrderLineInput,
  PricedOrderLine,
} from "@/lib/catalog/types";

export const MAX_QTY_PER_LINE = 20;
export const MAX_LINES_PER_ORDER = 30;
export const MAX_ORDER_CENTS = 50_000; // €500

export type PriceResult =
  | { ok: true; lines: PricedOrderLine[]; totalCents: number }
  | { ok: false; error: string };

/**
 * Server-side prijsberekening. Clientprijzen worden genegeerd.
 */
export function priceOrderLines(inputs: ClientOrderLineInput[]): PriceResult {
  if (!Array.isArray(inputs) || inputs.length === 0) {
    return { ok: false, error: "Je winkelmand is leeg." };
  }
  if (inputs.length > MAX_LINES_PER_ORDER) {
    return { ok: false, error: "Te veel producten in één bestelling." };
  }

  const priced: PricedOrderLine[] = [];
  let totalCents = 0;

  for (const input of inputs) {
    const product = getProductById(input.productId);
    if (!product) {
      return { ok: false, error: `Onbekend product: ${input.productId}` };
    }
    if (product.availability === "hidden") {
      return { ok: false, error: `${product.name} is niet beschikbaar.` };
    }
    if (product.availability === "sold_out") {
      return { ok: false, error: `${product.name} is uitverkocht.` };
    }

    const qty = input.qty;
    if (!Number.isInteger(qty) || qty < 1) {
      return { ok: false, error: "Aantal moet minimaal 1 zijn." };
    }
    if (qty > MAX_QTY_PER_LINE) {
      return { ok: false, error: `Maximaal ${MAX_QTY_PER_LINE} per product.` };
    }

    const optionIds = Array.isArray(input.optionIds) ? input.optionIds : [];
    const seen = new Set<string>();
    let optionsCents = 0;
    const optionLabels: string[] = [];

    for (const optId of optionIds) {
      const option = getOptionById(optId);
      if (!option) {
        return { ok: false, error: `Ongeldige optie: ${optId}` };
      }
      if (!product.allowedOptionIds.includes(optId)) {
        return {
          ok: false,
          error: `Optie “${option.name}” is niet beschikbaar bij ${product.name}.`,
        };
      }
      if (option.unique && seen.has(optId)) {
        return { ok: false, error: `Optie “${option.name}” mag maar één keer.` };
      }
      seen.add(optId);
      optionsCents += option.priceCents;
      optionLabels.push(
        option.priceCents > 0
          ? `${option.name} (+€${(option.priceCents / 100).toFixed(2).replace(".", ",")})`
          : option.name,
      );
    }

    const note =
      typeof input.note === "string" && input.note.trim()
        ? input.note.trim().slice(0, 200)
        : undefined;

    const unitPriceCents = product.priceCents + optionsCents;
    const lineTotalCents = unitPriceCents * qty;
    totalCents += lineTotalCents;

    priced.push({
      productId: product.id,
      name: product.name,
      qty,
      optionIds: [...seen],
      optionLabels,
      unitPriceCents,
      lineTotalCents,
      note,
    });
  }

  if (totalCents > MAX_ORDER_CENTS) {
    return { ok: false, error: "Het orderbedrag is te hoog. Neem contact op via WhatsApp." };
  }
  if (totalCents <= 0) {
    return { ok: false, error: "Ongeldig orderbedrag." };
  }

  return { ok: true, lines: priced, totalCents };
}
