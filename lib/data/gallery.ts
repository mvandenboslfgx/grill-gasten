import type { FoodAssetMeta } from "@/lib/data/food-imagery";
import { FOOD } from "@/lib/data/food-imagery";

export type GalleryTile = FoodAssetMeta & { alt: string };

export type GalleryCategory = {
  id: string;
  label: string;
  tagline: string;
  tiles: readonly GalleryTile[];
};

export const GALLERY_CATEGORIES: readonly GalleryCategory[] = [
  {
    id: "live-fire",
    label: "Live Fire",
    tagline: "Vuur op de plaat — sissende smash, gesmolten kaas, pure grillenergie.",
    tiles: [
      { ...FOOD.heroSmash, alt: "Dubbele smash op de grill — close-up van live fire" },
      { ...FOOD.loadedBacon, alt: "Loaded fries met bacon van de grill" },
    ],
  },
  {
    id: "signature-burgers",
    label: "Signature Burgers",
    tagline: "De smash die gasten terugbrengt.",
    tiles: [
      { ...FOOD.smashHands, alt: "Signature smashburger in handen" },
      { ...FOOD.heroSmash, alt: "Premium double cheese smash" },
    ],
  },
  {
    id: "late-night",
    label: "Late Night",
    tagline: "Hongerige gasten, volle trays, tempo van de grill.",
    tiles: [
      { ...FOOD.smashHands, alt: "Smashburger — late-night comfort food" },
      { ...FOOD.loadedTray, alt: "Volgeladen tray van de grill" },
      { ...FOOD.drinkPeach, alt: "Huisgemaakte peach iced tea" },
    ],
  },
  {
    id: "private-events",
    label: "Private Events",
    tagline: "Tuinfeesten, bruiloften en bedrijfsborrels — premium zonder gedoe.",
    tiles: [
      { ...FOOD.loadedTray, alt: "Cateringtray voor een privégelegenheid" },
      { ...FOOD.drinkLemonade, alt: "Verse lemonade voor gasten" },
      { ...FOOD.loadedBacon, alt: "Comfort food met een stevige uitstraling" },
    ],
  },
] as const;
