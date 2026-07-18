import type { CatalogOption } from "@/lib/catalog/types";

/** Selecteerbare burgeropties (alleen smashburgers). */
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
    description: "Gratis vervanging van komkommer en tomaat.",
    priceCents: 0,
    kind: "swap",
    unique: true,
  },
] as const satisfies readonly CatalogOption[];

export type CatalogOptionId = (typeof catalogOptions)[number]["id"];

export function getOptionById(id: string): CatalogOption | undefined {
  return catalogOptions.find((o) => o.id === id);
}
