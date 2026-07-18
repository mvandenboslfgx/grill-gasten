import { describe, expect, it } from "vitest";
import { priceOrderLines } from "@/lib/catalog/pricing";

describe("priceOrderLines", () => {
  it("Single zonder opties = €7,99", () => {
    const r = priceOrderLines([{ productId: "single-smash", qty: 1, optionIds: [] }]);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.totalCents).toBe(799);
  });

  it("Double met bacon = €12,74", () => {
    const r = priceOrderLines([
      { productId: "double-smash", qty: 1, optionIds: ["bacon"] },
    ]);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.totalCents).toBe(1199 + 75);
  });

  it("Triple met ei en bacon = €16,74", () => {
    const r = priceOrderLines([
      { productId: "triple-smash", qty: 1, optionIds: ["egg", "bacon"] },
    ]);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.totalCents).toBe(1499 + 100 + 75);
  });

  it("Gratis augurkwissel verandert prijs niet", () => {
    const r = priceOrderLines([
      { productId: "single-smash", qty: 1, optionIds: ["pickle-swap"] },
    ]);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.totalCents).toBe(799);
  });

  it("Loaded Fries Kip = €9,95", () => {
    const r = priceOrderLines([{ productId: "loaded-kip", qty: 1, optionIds: [] }]);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.totalCents).toBe(995);
  });

  it("Ongeldige option-ID wordt geweigerd", () => {
    const r = priceOrderLines([
      { productId: "single-smash", qty: 1, optionIds: ["niet-bestaand"] },
    ]);
    expect(r.ok).toBe(false);
  });

  it("Client-side nepprijs wordt genegeerd (geen price veld in input)", () => {
    const r = priceOrderLines([
      {
        productId: "single-smash",
        qty: 1,
        optionIds: [],
        // @ts-expect-error — client mag geen prijs sturen
        priceEur: 0.01,
      },
    ]);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.totalCents).toBe(799);
  });

  it("Negatief aantal geweigerd", () => {
    const r = priceOrderLines([{ productId: "single-smash", qty: -1, optionIds: [] }]);
    expect(r.ok).toBe(false);
  });

  it("Aantal nul geweigerd", () => {
    const r = priceOrderLines([{ productId: "single-smash", qty: 0, optionIds: [] }]);
    expect(r.ok).toBe(false);
  });

  it("Te groot aantal geweigerd", () => {
    const r = priceOrderLines([{ productId: "single-smash", qty: 99, optionIds: [] }]);
    expect(r.ok).toBe(false);
  });

  it("Onbekend product geweigerd", () => {
    const r = priceOrderLines([{ productId: "classic-smash", qty: 1, optionIds: [] }]);
    expect(r.ok).toBe(false);
  });
});
