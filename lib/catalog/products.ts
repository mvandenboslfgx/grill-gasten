import { FOOD } from "@/lib/data/food-imagery";
import type { CatalogProduct } from "@/lib/catalog/types";
import { CATEGORY_LABELS, CATEGORY_ORDER } from "@/lib/catalog/categories";
import { formatPriceCents } from "@/lib/catalog/format-money";

const BURGER_OPTIONS = ["egg", "bacon", "pickle-swap"] as const;

/**
 * Officiële productcatalogus — bron van waarheid voor prijzen (centen).
 */
export const catalogProducts: readonly CatalogProduct[] = [
  {
    id: "single-smash",
    slug: "single-smash-burger",
    name: "Single Smash Burger",
    shortDescription:
      "Een verse smashburger met kaas, komkommer, tomaat en de vaste Grill Gasten-opbouw.",
    longDescription:
      "Een verse smashburger met kaas, komkommer, tomaat en de vaste Grill Gasten-opbouw. Ei en bacon zijn optioneel bij te bestellen.",
    description:
      "Een verse smashburger met kaas, komkommer, tomaat en de vaste Grill Gasten-opbouw.",
    priceCents: 799,
    category: "smashburgers",
    imageSrc: FOOD.heroSmash.src,
    availability: "available",
    badge: null,
    spicyLevel: 0,
    allowedOptionIds: BURGER_OPTIONS,
    allergenStatus: "on_request",
    allergens: [],
    sortOrder: 10,
    featured: false,
    maxQuantityPerOrder: 20,
  },
  {
    id: "double-smash",
    slug: "double-smash-burger",
    name: "Double Smash Burger",
    shortDescription:
      "Twee verse smashpatties met kaas, komkommer, tomaat en de vaste Grill Gasten-opbouw.",
    longDescription:
      "Twee verse smashpatties met kaas, komkommer, tomaat en de vaste Grill Gasten-opbouw. Meest gekozen. Ei en bacon optioneel.",
    description:
      "Twee verse smashpatties met kaas, komkommer, tomaat en de vaste Grill Gasten-opbouw.",
    priceCents: 1199,
    category: "smashburgers",
    imageSrc: FOOD.smashHands.src,
    availability: "available",
    badge: "meest-gekozen",
    spicyLevel: 0,
    allowedOptionIds: BURGER_OPTIONS,
    allergenStatus: "on_request",
    allergens: [],
    sortOrder: 20,
    featured: true,
    maxQuantityPerOrder: 20,
  },
  {
    id: "triple-smash",
    slug: "triple-smash-burger",
    name: "Triple Smash Burger",
    shortDescription:
      "Drie verse smashpatties met kaas, komkommer, tomaat en de vaste Grill Gasten-opbouw.",
    longDescription:
      "Drie verse smashpatties met kaas, komkommer, tomaat en de vaste Grill Gasten-opbouw. Voor de echte liefhebber.",
    description:
      "Drie verse smashpatties met kaas, komkommer, tomaat en de vaste Grill Gasten-opbouw.",
    priceCents: 1499,
    category: "smashburgers",
    imageSrc: FOOD.heroDisplay.src,
    availability: "available",
    badge: "liefhebber",
    spicyLevel: 0,
    allowedOptionIds: BURGER_OPTIONS,
    allergenStatus: "on_request",
    allergens: [],
    sortOrder: 30,
    featured: false,
    maxQuantityPerOrder: 20,
  },
  {
    id: "spicy-chicken",
    slug: "spicy-chicken-burger",
    name: "Spicy Chicken Burger",
    shortDescription: "Krokante kipburger met spicy saus.",
    longDescription: "Krokante kipburger met spicy saus.",
    description: "Krokante kipburger met spicy saus.",
    priceCents: 895,
    category: "chicken",
    imageSrc: FOOD.smashHands.src,
    availability: "available",
    badge: "pittig",
    spicyLevel: 2,
    allowedOptionIds: [],
    allergenStatus: "on_request",
    allergens: [],
    sortOrder: 40,
    featured: true,
    maxQuantityPerOrder: 20,
  },
  {
    id: "loaded-truffle",
    slug: "loaded-fries-truffel-parmezaan",
    name: "Loaded Fries Truffel & Parmezaan",
    shortDescription: "Krokante friet met truffelsaus en Parmezaanse kaas.",
    longDescription: "Krokante friet met truffelsaus en Parmezaanse kaas.",
    description: "Krokante friet met truffelsaus en Parmezaanse kaas.",
    priceCents: 875,
    category: "loaded-fries",
    imageSrc: FOOD.loadedTray.src,
    availability: "available",
    badge: null,
    spicyLevel: 0,
    allowedOptionIds: [],
    allergenStatus: "on_request",
    allergens: [],
    sortOrder: 50,
    featured: true,
    maxQuantityPerOrder: 20,
  },
  {
    id: "loaded-kip",
    slug: "loaded-fries-kip",
    name: "Loaded Fries Kip",
    shortDescription: "Krokante friet met kip en bijpassende saus en toppings.",
    longDescription: "Krokante friet met kip en bijpassende saus en toppings.",
    description: "Krokante friet met kip en bijpassende saus en toppings.",
    priceCents: 995,
    category: "loaded-fries",
    imageSrc: FOOD.loadedBacon.src,
    availability: "available",
    badge: "populair",
    spicyLevel: 0,
    allowedOptionIds: [],
    allergenStatus: "on_request",
    allergens: [],
    sortOrder: 60,
    featured: true,
    maxQuantityPerOrder: 20,
  },
  {
    id: "fries",
    slug: "losse-friet",
    name: "Losse friet",
    shortDescription: "Portie krokante friet.",
    longDescription: "Portie krokante friet — ideaal erbij of apart.",
    description: "Portie krokante friet.",
    priceCents: 350,
    category: "fries",
    imageSrc: FOOD.loadedTray.src,
    availability: "available",
    badge: null,
    spicyLevel: 0,
    allowedOptionIds: [],
    allergenStatus: "on_request",
    allergens: [],
    sortOrder: 70,
    featured: false,
    maxQuantityPerOrder: 20,
  },
  {
    id: "sauce",
    slug: "saus-naar-keuze",
    name: "Saus naar keuze",
    shortDescription:
      "Vraag naar de beschikbare sauzen of geef je keuze aan tijdens het bestellen.",
    longDescription:
      "Vraag naar de beschikbare sauzen of geef je keuze aan tijdens het bestellen. €0,50 per saus.",
    description:
      "Vraag naar de beschikbare sauzen of geef je keuze aan tijdens het bestellen.",
    priceCents: 50,
    category: "sauces",
    imageSrc: FOOD.drinkLemonade.src,
    availability: "available",
    badge: null,
    spicyLevel: 0,
    allowedOptionIds: [],
    allergenStatus: "on_request",
    allergens: [],
    sortOrder: 80,
    featured: false,
    maxQuantityPerOrder: 30,
    requiresSauceChoice: true,
  },
] as const;

export { CATEGORY_LABELS, CATEGORY_ORDER, formatPriceCents };

export function getProductById(id: string): CatalogProduct | undefined {
  return catalogProducts.find((p) => p.id === id);
}

export function getVisibleProducts(): CatalogProduct[] {
  return catalogProducts
    .filter((p) => p.availability !== "hidden")
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getFeaturedProducts(): CatalogProduct[] {
  return getVisibleProducts().filter((p) => p.featured);
}

export function getProductsByCategory(
  category: CatalogProduct["category"],
): CatalogProduct[] {
  return getVisibleProducts().filter((p) => p.category === category);
}

export const ALLERGEN_NOTICE =
  "Heb je een allergie? Neem vóór het bestellen contact met ons op. In onze keuken kan kruisbesmetting niet volledig worden uitgesloten.";
