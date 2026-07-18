/** Format centen naar NL-euroweergave. */
export function formatPriceCents(cents: number): string {
  return new Intl.NumberFormat("nl-NL", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function formatPriceDiffCents(cents: number): string {
  if (cents === 0) return "Gratis";
  return `+ ${formatPriceCents(cents)}`;
}
