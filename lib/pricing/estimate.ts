/** Indicatieve cateringprijzen — geen bindende offerte. */

export type BudgetTier = "compact" | "festival" | "premium";

const BASE_BY_TIER: Record<BudgetTier, number> = {
  compact: 850,
  festival: 2400,
  premium: 4500,
};

const PER_GUEST: Record<BudgetTier, number> = {
  compact: 12,
  festival: 9.5,
  premium: 14,
};

export function estimateCateringPrice(guests: number, tier: BudgetTier = "festival"): {
  fromEur: number;
  label: string;
} {
  const g = Math.max(1, Math.min(500, Math.floor(guests) || 1));
  const fromEur = Math.round(BASE_BY_TIER[tier] + g * PER_GUEST[tier]);
  const formatted = new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(fromEur);

  return {
    fromEur,
    label: `Indicatie vanaf ${formatted} (excl. btw, afhankelijk van menu en locatie)`,
  };
}

export function tierFromGuests(guests: number): BudgetTier {
  if (guests <= 75) return "compact";
  if (guests <= 250) return "festival";
  return "premium";
}
