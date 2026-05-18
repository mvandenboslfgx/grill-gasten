import { menuItems } from "@/lib/data/menu";

export type CartLine = {
  id: string;
  name: string;
  priceEur: number;
  qty: number;
};

const STORAGE_KEY = "gg-preorder-cart";

export function parsePriceEur(price: string): number {
  const n = parseFloat(price.replace(/[^\d,]/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

export function getMenuItemById(id: string) {
  return menuItems.find((m) => m.id === id);
}

export function loadCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CartLine[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCart(lines: CartLine[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
}

export function cartTotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + l.priceEur * l.qty, 0);
}

export function formatEur(amount: number): string {
  return new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(amount);
}

export function cartToMessage(lines: CartLine[]): string {
  return lines.map((l) => `${l.qty}× ${l.name} (${formatEur(l.priceEur * l.qty)})`).join("\n");
}
