import { describe, expect, it } from "vitest";
import {
  DRINK_DRAFTS,
  getActiveDrinkProducts,
  getConfirmedDrinkProducts,
} from "@/lib/catalog/drinks";
import { priceOrderLines } from "@/lib/catalog/pricing";
import { getProductById } from "@/lib/catalog/products";

describe("drinks catalog", () => {
  it("heeft draft-assortiment zonder live bevestiging", () => {
    expect(DRINK_DRAFTS.length).toBeGreaterThanOrEqual(4);
    expect(DRINK_DRAFTS.every((d) => d.ownerConfirmed === false)).toBe(true);
    expect(getConfirmedDrinkProducts()).toEqual([]);
    expect(getActiveDrinkProducts()).toEqual([]);
  });

  it("onbevestigde drank-ID is onbekend voor pricing", () => {
    expect(getProductById("drink-cola")).toBeUndefined();
    const priced = priceOrderLines([
      { productId: "drink-cola", qty: 1, optionIds: [] },
    ]);
    expect(priced.ok).toBe(false);
  });

  it("negeert clientprijsmanipulatie op food (regressie)", () => {
    const priced = priceOrderLines([
      { productId: "single-smash", qty: 1, optionIds: [] },
    ]);
    expect(priced.ok).toBe(true);
    if (priced.ok) {
      expect(priced.lines[0]!.unitPriceCents).toBe(799);
      expect(priced.subtotalCents).toBe(799);
    }
  });
});
