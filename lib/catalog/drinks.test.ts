import { describe, expect, it } from "vitest";
import {
  DRINK_DRAFTS,
  getActiveDrinkProducts,
  getConfirmedDrinkProducts,
} from "@/lib/catalog/drinks";
import { priceOrderLines } from "@/lib/catalog/pricing";
import { getProductById, getProductsByCategory } from "@/lib/catalog/products";
import { orderingConfig } from "@/lib/ordering/opening-hours";

describe("drinks catalog launch", () => {
  it("heeft zes bevestigde dranken met correcte prijzen", () => {
    expect(DRINK_DRAFTS).toHaveLength(6);
    expect(DRINK_DRAFTS.every((d) => d.ownerConfirmed)).toBe(true);
    expect(getConfirmedDrinkProducts()).toHaveLength(6);
    expect(getActiveDrinkProducts()).toHaveLength(6);

    expect(getProductById("drink-cola")?.priceCents).toBe(275);
    expect(getProductById("drink-cola-zero")?.priceCents).toBe(275);
    expect(getProductById("drink-fanta")?.priceCents).toBe(275);
    expect(getProductById("drink-sprite")?.priceCents).toBe(275);
    expect(getProductById("drink-water-still")?.priceCents).toBe(250);
    expect(getProductById("drink-water-sparkling")?.priceCents).toBe(250);
  });

  it("dranken zichtbaar in menucategorie", () => {
    expect(getProductsByCategory("drinks").length).toBe(6);
  });

  it("serverprijs negeert clientmanipulatie", () => {
    const priced = priceOrderLines([
      { productId: "drink-cola", qty: 2, optionIds: [] },
    ]);
    expect(priced.ok).toBe(true);
    if (priced.ok) {
      expect(priced.lines[0]!.unitPriceCents).toBe(275);
      expect(priced.subtotalCents).toBe(550);
    }
  });

  it("onbekende drank geweigerd", () => {
    const priced = priceOrderLines([
      { productId: "drink-unknown", qty: 1, optionIds: [] },
    ]);
    expect(priced.ok).toBe(false);
  });

  it("ordering blijft uit — dranken niet via live checkout", () => {
    expect(orderingConfig.orderingEnabled).toBe(false);
  });
});
