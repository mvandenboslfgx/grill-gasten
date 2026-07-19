/** Mollie EUR amount string from integer eurocents (no float arithmetic). */
export function mollieAmountFromCents(totalCents: number): string {
  if (!Number.isInteger(totalCents) || totalCents < 0) {
    throw new Error("INVALID_AMOUNT_CENTS");
  }
  return (totalCents / 100).toFixed(2);
}

/** Compare Mollie payment amount/currency to server order total. */
export function mollieAmountMatchesOrder(params: {
  mollieValue: string | undefined | null;
  mollieCurrency: string | undefined | null;
  orderTotalCents: number;
}): boolean {
  if (!params.mollieValue || params.mollieCurrency !== "EUR") return false;
  try {
    return params.mollieValue === mollieAmountFromCents(params.orderTotalCents);
  } catch {
    return false;
  }
}
