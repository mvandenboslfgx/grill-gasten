import type { CatalogOption } from "@/lib/catalog/types";

/** Selecteerbare burgeropties en swaps. */
export const catalogOptions = [
  {
    id: "egg",
    name: "Gebakken ei",
    description: "Optioneel — niet standaard inbegrepen.",
    priceCents: 100,
    kind: "addon",
    unique: true,
  },
  {
    id: "bacon",
    name: "Bacon",
    description: "Optioneel — niet standaard inbegrepen.",
    priceCents: 75,
    kind: "addon",
    unique: true,
  },
  {
    id: "pickle-swap",
    name: "Augurk i.p.v. komkommer en tomaat",
    description: "Gratis vervanging van de standaard groenten.",
    priceCents: 0,
    kind: "swap",
    unique: true,
  },
  {
    id: "sauce-choice",
    name: "Saus naar keuze",
    description: "Vraag naar beschikbare sauzen bij bestellen.",
    priceCents: 50,
    kind: "addon",
    unique: false,
  },
] as const satisfies readonly CatalogOption[];

export type CatalogOptionId = (typeof catalogOptions)[number]["id"];

export function getOptionById(id: string): CatalogOption | undefined {
  return catalogOptions.find((o) => o.id === id);
}
