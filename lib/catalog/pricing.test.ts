import { describe, expect, it } from "vitest";
import { priceOrderLines } from "@/lib/catalog/pricing";

describe("priceOrderLines", () => {
  it("Single = €7,99", () => {
    const r = priceOrderLines([{ productId: "single-smash", qty: 1, optionIds: [] }]);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.subtotalCents).toBe(799);
  });

  it("Double = €11,99", () => {
    const r = priceOrderLines([{ productId: "double-smash", qty: 1, optionIds: [] }]);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.subtotalCents).toBe(1199);
  });

  it("Triple = €14,99", () => {
    const r = priceOrderLines([{ productId: "triple-smash", qty: 1, optionIds: [] }]);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.subtotalCents).toBe(1499);
  });

  it("Spicy Chicken = €8,95", () => {
    const r = priceOrderLines([{ productId: "spicy-chicken", qty: 1, optionIds: [] }]);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.subtotalCents).toBe(895);
  });

  it("Truffel & Parmezaan = €8,75", () => {
    const r = priceOrderLines([{ productId: "loaded-truffle", qty: 1, optionIds: [] }]);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.subtotalCents).toBe(875);
  });

  it("Loaded Fries Kip = €9,95", () => {
    const r = priceOrderLines([{ productId: "loaded-kip", qty: 1, optionIds: [] }]);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.subtotalCents).toBe(995);
  });

  it("Losse friet = €3,50", () => {
    const r = priceOrderLines([{ productId: "fries", qty: 1, optionIds: [] }]);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.subtotalCents).toBe(350);
  });

  it("Saus = €0,50 met keuze", () => {
    const r = priceOrderLines([
      { productId: "sauce", qty: 1, optionIds: [], sauceChoice: "Mayonaise" },
    ]);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.subtotalCents).toBe(50);
  });

  it("Saus zonder keuze geweigerd", () => {
    const r = priceOrderLines([{ productId: "sauce", qty: 1, optionIds: [] }]);
    expect(r.ok).toBe(false);
  });

  it("Double + bacon = €12,74", () => {
    const r = priceOrderLines([
      { productId: "double-smash", qty: 1, optionIds: ["bacon"] },
    ]);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.subtotalCents).toBe(1274);
  });

  it("Single + ei = €8,99", () => {
    const r = priceOrderLines([
      { productId: "single-smash", qty: 1, optionIds: ["egg"] },
    ]);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.subtotalCents).toBe(899);
  });

  it("Triple + ei + bacon = €16,74", () => {
    const r = priceOrderLines([
      { productId: "triple-smash", qty: 1, optionIds: ["egg", "bacon"] },
    ]);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.subtotalCents).toBe(1674);
  });

  it("Augurkwissel verandert prijs niet", () => {
    const r = priceOrderLines([
      { productId: "single-smash", qty: 1, optionIds: ["pickle-swap"] },
    ]);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.subtotalCents).toBe(799);
  });

  it("Ongeldige optie geweigerd", () => {
    const r = priceOrderLines([
      { productId: "single-smash", qty: 1, optionIds: ["niet-bestaand"] },
    ]);
    expect(r.ok).toBe(false);
  });

  it("Dubbele bacon geweigerd", () => {
    const r = priceOrderLines([
      { productId: "single-smash", qty: 1, optionIds: ["bacon", "bacon"] },
    ]);
    expect(r.ok).toBe(false);
  });

  it("Niet-toegestane optie op chicken geweigerd", () => {
    const r = priceOrderLines([
      { productId: "spicy-chicken", qty: 1, optionIds: ["egg"] },
    ]);
    expect(r.ok).toBe(false);
  });

  it("Client nepprijs genegeerd", () => {
    const r = priceOrderLines([
      {
        productId: "single-smash",
        qty: 1,
        optionIds: [],
        // @ts-expect-error client price ignored
        priceEur: 0.01,
      },
    ]);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.subtotalCents).toBe(799);
  });

  it("Negatief/nul/te groot aantal geweigerd", () => {
    expect(priceOrderLines([{ productId: "single-smash", qty: -1, optionIds: [] }]).ok).toBe(false);
    expect(priceOrderLines([{ productId: "single-smash", qty: 0, optionIds: [] }]).ok).toBe(false);
    expect(priceOrderLines([{ productId: "single-smash", qty: 99, optionIds: [] }]).ok).toBe(false);
  });

  it("Onbekend product geweigerd", () => {
    expect(priceOrderLines([{ productId: "classic-smash", qty: 1, optionIds: [] }]).ok).toBe(false);
  });
});
