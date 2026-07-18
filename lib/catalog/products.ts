import { FOOD } from "@/lib/data/food-imagery";
import type { CatalogProduct, ProductCategory } from "@/lib/catalog/types";

const BURGER_OPTIONS = ["egg", "bacon", "pickle-swap"] as const;

/**
 * Officiële productcatalogus — bron van waarheid voor prijzen.
 * Prijzen alleen in centen (integers).
 */
export const catalogProducts: readonly CatalogProduct[] = [
  {
    id: "single-smash",
    name: "Single Smash Burger",
    description:
      "Een verse smashburger met kaas en de standaard Grill Gasten-opbouw.",
    priceCents: 799,
    category: "smashburgers",
    imageSrc: FOOD.heroSmash.src,
    availability: "available",
    badge: null,
    spicyLevel: 0,
    allowedOptionIds: BURGER_OPTIONS,
    allergens: [],
    sortOrder: 10,
    featured: false,
  },
  {
    id: "double-smash",
    name: "Double Smash Burger",
    description:
      "Twee smashpatties met kaas en de standaard Grill Gasten-opbouw.",
    priceCents: 1199,
    category: "smashburgers",
    imageSrc: FOOD.smashHands.src,
    availability: "available",
    badge: "meest-gekozen",
    spicyLevel: 0,
    allowedOptionIds: BURGER_OPTIONS,
    allergens: [],
    sortOrder: 20,
    featured: true,
  },
  {
    id: "triple-smash",
    name: "Triple Smash Burger",
    description:
      "Drie smashpatties met kaas en de standaard Grill Gasten-opbouw.",
    priceCents: 1499,
    category: "smashburgers",
    imageSrc: FOOD.heroDisplay.src,
    availability: "available",
    badge: "liefhebber",
    spicyLevel: 0,
    allowedOptionIds: BURGER_OPTIONS,
    allergens: [],
    sortOrder: 30,
    featured: false,
  },
  {
    id: "spicy-chicken",
    name: "Spicy Chicken Burger",
    description: "Krokante kipburger met spicy saus.",
    priceCents: 895,
    category: "chicken",
    imageSrc: FOOD.smashHands.src,
    availability: "available",
    badge: "pittig",
    spicyLevel: 2,
    allowedOptionIds: ["egg", "bacon"],
    allergens: [],
    sortOrder: 40,
    featured: true,
  },
  {
    id: "loaded-truffle",
    name: "Loaded Fries Truffel & Parmezaan",
    description: "Friet met truffelsaus en Parmezaanse kaas.",
    priceCents: 875,
    category: "loaded-fries",
    imageSrc: FOOD.loadedTray.src,
    availability: "available",
    badge: null,
    spicyLevel: 0,
    allowedOptionIds: [],
    allergens: [],
    sortOrder: 50,
    featured: true,
  },
  {
    id: "loaded-kip",
    name: "Loaded Fries Kip",
    description: "Friet met kip en bijpassende saus/toppings.",
    priceCents: 995,
    category: "loaded-fries",
    imageSrc: FOOD.loadedBacon.src,
    availability: "available",
    badge: "populair",
    spicyLevel: 0,
    allowedOptionIds: [],
    allergens: [],
    sortOrder: 60,
    featured: true,
  },
  {
    id: "fries",
    name: "Losse friet",
    description: "Portie friet — ideaal erbij of apart.",
    priceCents: 350,
    category: "fries-sauces",
    imageSrc: FOOD.loadedTray.src,
    availability: "available",
    badge: null,
    spicyLevel: 0,
    allowedOptionIds: ["sauce-choice"],
    allergens: [],
    sortOrder: 70,
    featured: false,
  },
  {
    id: "sauce",
    name: "Saus naar keuze",
    description:
      "Vraag naar de beschikbare sauzen of kies tijdens het bestellen. €0,50 per saus.",
    priceCents: 50,
    category: "fries-sauces",
    imageSrc: FOOD.drinkLemonade.src,
    availability: "available",
    badge: null,
    spicyLevel: 0,
    allowedOptionIds: [],
    allergens: [],
    sortOrder: 80,
    featured: false,
  },
] as const;

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  smashburgers: "Smashburgers",
  chicken: "Chicken",
  "loaded-fries": "Loaded fries",
  "fries-sauces": "Friet en sauzen",
  extras: "Extra opties",
};

export const CATEGORY_ORDER: ProductCategory[] = [
  "smashburgers",
  "chicken",
  "loaded-fries",
  "fries-sauces",
  "extras",
];

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

export function getProductsByCategory(category: ProductCategory): CatalogProduct[] {
  return getVisibleProducts().filter((p) => p.category === category);
}

/** Format centen naar NL-euroweergave. */
export function formatPriceCents(cents: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export const ALLERGEN_NOTICE =
  "Heb je een allergie? Neem vóór het bestellen contact met ons op. In onze keuken kan kruisbesmetting niet volledig worden uitgesloten.";
