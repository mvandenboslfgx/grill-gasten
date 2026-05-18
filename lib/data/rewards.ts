export const rewardTiers = [
  {
    id: "bronze",
    name: "Bronze",
    fromPoints: 0,
    perks: ["Welkomstpunt bij aanmelding", "Exclusieve deals via e-mail"],
  },
  {
    id: "silver",
    name: "Silver",
    fromPoints: 250,
    perks: ["5% korting op loaded fries", "Vroege toegang specials"],
  },
  {
    id: "gold",
    name: "Gold",
    fromPoints: 750,
    perks: ["Gratis drankje", "Priority lane op events"],
  },
  {
    id: "black",
    name: "Black",
    fromPoints: 1500,
    perks: ["Gratis burger reward", "VIP invites", "Birthday treat"],
  },
] as const;

export const rewardCatalog = [
  { id: "fries", title: "Gratis loaded fries", points: 120 },
  { id: "burger", title: "Gratis smash burger", points: 280 },
  { id: "drink", title: "Gratis drankje", points: 60 },
  { id: "vip", title: "VIP deal op events", points: 400 },
] as const;
