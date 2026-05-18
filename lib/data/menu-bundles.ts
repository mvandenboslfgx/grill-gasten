export type MenuBundle = {
  id: string;
  name: string;
  description: string;
  price: string;
  savings?: string;
  includes: string[];
  popular?: boolean;
  anchor?: boolean;
};

export const menuBundles: MenuBundle[] = [
  {
    id: "festival-combo",
    name: "Festival Combo",
    description: "De bestseller op drukke events — smash + loaded + drink.",
    price: "€18,50",
    savings: "Bespaar €4",
    includes: ["Classic Smash", "Pulled Chicken Loaded Fries", "Ice Cold Cola"],
    popular: true,
  },
  {
    id: "crew-pack",
    name: "Crew Pack (10 pers.)",
    description: "Groepsbestelling voor teams — scherpe prijs per persoon.",
    price: "€165",
    savings: "Bespaar €25",
    includes: ["10× Classic Smash", "2× Loaded Fries trays", "Sauzen"],
    anchor: true,
  },
  {
    id: "vip-lane",
    name: "VIP Lane",
    description: "Premium selectie voor zakelijke borrels en openings.",
    price: "€24,00",
    includes: ["Double Trouble", "BBQ Bacon Fries", "Fresh Lemonade"],
  },
];
