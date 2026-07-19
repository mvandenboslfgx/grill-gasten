/**
 * Grill Gasten food imagery — lokale assets onder `public/images/food/`.
 * Catering/truck blijft tijdelijk Pexels tot echte truckfoto beschikbaar is.
 */

/** Intrinsieke afmetingen bronbestanden — voorkomt onnodige upscale in next/image */
export type FoodAssetMeta = {
  src: string;
  width: number;
  height: number;
};

const FOOD = {
  /** Vervang door ≥1600px bron wanneer beschikbaar — hero gebruikt nu smashHands */
  heroSmash: {
    src: "/images/food/hero-smash-double-cheese.webp",
    width: 491,
    height: 450,
  },
  /** Beste huidige hero-visual (963×1024) */
  heroDisplay: {
    src: "/images/food/smash-hands-neon.webp",
    width: 963,
    height: 1024,
  },
  smashHands: {
    src: "/images/food/smash-hands-neon.webp",
    width: 963,
    height: 1024,
  },
  loadedTray: {
    src: "/images/food/loaded-fries-tray.webp",
    width: 612,
    height: 344,
  },
  loadedBacon: {
    src: "/images/food/loaded-fries-bacon.webp",
    width: 625,
    height: 350,
  },
  drinkPeach: {
    src: "/images/food/drink-peach-iced-tea.webp",
    width: 612,
    height: 408,
  },
  drinkLemonade: {
    src: "/images/food/drink-lemonade-mint.webp",
    width: 1024,
    height: 768,
  },
} as const satisfies Record<string, FoodAssetMeta>;

export { FOOD };

/** @deprecated Alleen voor truck-placeholder; vervang door `/images/truck/…` */
export function foodImage(id: number, width: number) {
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}&fit=crop`;
}

/** Hero smashburger */
export const IMG_HERO_BURGER = FOOD.heroSmash.src;

/** Story / founders-sectie — smash in handen */
export const IMG_BURGER_PLATE = FOOD.smashHands.src;

/** Catering visual — stock tot eigen foto */
export const IMG_FOOD_TRUCK = foodImage(4393021, 2000);

/** Experience / sfeerachtergrond */
export const IMG_FESTIVAL_FOOD = FOOD.loadedTray.src;

/** Homepage social grid + featured categorieën */
export const FOOD_ASSETS = {
  heroSmash: FOOD.heroSmash.src,
  smashHands: FOOD.smashHands.src,
  loadedTray: FOOD.loadedTray.src,
  loadedBacon: FOOD.loadedBacon.src,
  drinkPeach: FOOD.drinkPeach.src,
  drinkLemonade: FOOD.drinkLemonade.src,
} as const;

export type SocialFoodTile = FoodAssetMeta & { alt: string };

export const SOCIAL_FOOD_TILES: readonly SocialFoodTile[] = [
  { ...FOOD.heroSmash, alt: "Dubbele smashburger met gesmolten kaas en ui" },
  { ...FOOD.loadedTray, alt: "Loaded fries met vlees, kaas en saus" },
  { ...FOOD.smashHands, alt: "Smashburger vastgehouden — Grill Gasten" },
  { ...FOOD.loadedBacon, alt: "Loaded fries met bacon en creamy sauce" },
  { ...FOOD.drinkPeach, alt: "Huisgemaakte peach iced tea met vers fruit" },
  { ...FOOD.drinkLemonade, alt: "Verse lemonade met citroen en munt" },
  { ...FOOD.heroSmash, alt: "Premium smashburger close-up Grill Gasten" },
  { ...FOOD.loadedTray, alt: "Volgeladen fries tray van de grill" },
  { ...FOOD.loadedBacon, alt: "Knapperige loaded fries met toppings" },
] as const;
