import { FOOD } from "@/lib/data/food-imagery";

export type MenuCategory = "Smash Burgers" | "Loaded Fries" | "Snacks" | "Drinks";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  category: MenuCategory;
  popular?: boolean;
  spicy?: 1 | 2 | 3;
};

/** Prijzen zijn indicatief — pas aan zodra definitief vastligt. */
export const menuItems: MenuItem[] = [
  {
    id: "classic-smash",
    name: "Classic Smash",
    description: "Dubbele smash, American cheese, augurk, ui, GG-saus — het signatuurgerecht waar alles op voortbouwt.",
    price: "€11,50",
    category: "Smash Burgers",
    popular: true,
  },
  {
    id: "double-trouble",
    name: "Double Trouble",
    description: "Twee patties, dubbele kaas, bacon, BBQ-glaze — voor als één laag niet genoeg is.",
    price: "€14,00",
    category: "Smash Burgers",
    popular: true,
  },
  {
    id: "bbq-beast",
    name: "BBQ Beast",
    description: "Smash, pulled-style topping, knapperige ui, smoky BBQ — recht van de grill.",
    price: "€13,50",
    category: "Smash Burgers",
  },
  {
    id: "hot-flame",
    name: "Hot Flame",
    description: "Jalapeño, pepper jack, hot honey — pit waar je om vroeg.",
    price: "€13,00",
    category: "Smash Burgers",
    spicy: 3,
    popular: true,
  },
  {
    id: "cheesy-madness",
    name: "Cheesy Madness",
    description: "Extra cheese pull, gekarameliseerde ui, geheime drizzle — geen excuses.",
    price: "€12,50",
    category: "Smash Burgers",
  },
  {
    id: "pulled-chicken-loaded",
    name: "Pulled Chicken Loaded Fries",
    description: "Gouden friet, pulled chicken, gesmolten kaas en saus — een tray die je event onthoudt.",
    price: "€10,50",
    category: "Loaded Fries",
    popular: true,
  },
  {
    id: "bbq-bacon-fries",
    name: "BBQ Bacon Fries",
    description: "Smoky BBQ, bacon bits, gesmolten kaas — festivalcomfort.",
    price: "€10,00",
    category: "Loaded Fries",
  },
  {
    id: "flame-fries",
    name: "Flame Fries",
    description: "Spicy dust, jalapeño, aioli — vuur op je tray.",
    price: "€9,50",
    category: "Loaded Fries",
    spicy: 2,
  },
  {
    id: "dirty-cheese-fries",
    name: "Dirty Cheese Fries",
    description: "Dubbele kaas, knapperige topping, GG-afwerking — lekker rommelig op het juiste niveau.",
    price: "€10,00",
    category: "Loaded Fries",
  },
  {
    id: "crispy-chicken-bites",
    name: "Crispy Chicken Bites",
    description: "Knapperig van buiten, sappig van binnen — dip naar keuze.",
    price: "€8,50",
    category: "Snacks",
    popular: true,
  },
  {
    id: "loaded-frikandel",
    name: "Loaded Frikandel Special",
    description: "Streetfood-classic met volle toppings — Nederlandse energie.",
    price: "€7,50",
    category: "Snacks",
  },
  {
    id: "chili-cheese",
    name: "Chili Cheese Snacks",
    description: "Gesmolten kaas, chili-kick — perfect als snack.",
    price: "€7,00",
    category: "Snacks",
    spicy: 2,
  },
  {
    id: "onion-rings",
    name: "Crunchy Onion Rings",
    description: "Goudbruin en knapperig — perfect naast je smash.",
    price: "€6,00",
    category: "Snacks",
  },
  {
    id: "lemonade",
    name: "Fresh Lemonade",
    description: "Citrus, munt en crushed ice — verfrissend tussen bites.",
    price: "€4,00",
    category: "Drinks",
  },
  {
    id: "cola",
    name: "Ice Cold Cola",
    description: "Klassieke combinatie — ijskoud.",
    price: "€3,00",
    category: "Drinks",
  },
];

export const featuredHighlights = [
  {
    title: "Smash Burgers",
    description: "Smaak, kwaliteit, heet van de grill — waar je voor terugkomt.",
    image: FOOD.heroSmash.src,
    width: FOOD.heroSmash.width,
    height: FOOD.heroSmash.height,
  },
  {
    title: "Loaded Fries",
    description: "Lagen toppings, kaas en attitude — delen mag, hoeven niet.",
    image: FOOD.loadedTray.src,
    width: FOOD.loadedTray.width,
    height: FOOD.loadedTray.height,
  },
  {
    title: "Snacks",
    description: "Bites, crunch en late-night favorieten — perfect naast het hoofdgerecht.",
    image: FOOD.loadedBacon.src,
    width: FOOD.loadedBacon.width,
    height: FOOD.loadedBacon.height,
  },
  {
    title: "Drinks",
    description: "Huisgemaakte iced tea en verse lemonade — koel naast de grill.",
    image: FOOD.drinkPeach.src,
    width: FOOD.drinkPeach.width,
    height: FOOD.drinkPeach.height,
  },
] as const;
