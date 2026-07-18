/** Rewards-data — niet publiek beloven tot wallet live is. Alleen voor interne/API-gebruik. */
export const rewardTiers = [
  { id: "bronze", name: "Bronze", fromPoints: 0, perks: ["Welkomstpunten bij aanmelding"] },
  { id: "silver", name: "Silver", fromPoints: 250, perks: ["Extra deals"] },
  { id: "gold", name: "Gold", fromPoints: 750, perks: ["Extra voordelen"] },
  { id: "black", name: "Black", fromPoints: 1500, perks: ["Hoogste niveau"] },
] as const;

export const rewardCatalog = [
  { id: "fries", title: "Loaded fries reward", points: 120 },
  { id: "burger", title: "Burger reward", points: 280 },
  { id: "drink", title: "Drankje", points: 60 },
] as const;
