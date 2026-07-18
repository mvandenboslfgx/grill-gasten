import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPriceCents } from "@/lib/catalog/products";
import { getOrderByNumber } from "@/lib/orders/create-order";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getWhatsAppHref } from "@/lib/whatsapp";
import { GlowButton } from "@/components/button";

type Props = { params: Promise<{ orderNumber: string }> };

export const metadata: Metadata = {
  title: "Bestelstatus",
  robots: { index: false, follow: false },
};

function paymentLabel(status: string): string {
  switch (status) {
    case "paid":
      return "Betaling geslaagd";
    case "pending":
    case "unpaid":
      return "Betaling in behandeling";
    case "failed":
      return "Betaling mislukt";
    case "canceled":
      return "Betaling geannuleerd";
    case "expired":
      return "Betaling verlopen";
    case "refunded":
      return "Terugbetaald";
    default:
      return "Status wordt gecontroleerd";
  }
}

function orderLabel(status: string): string {
  switch (status) {
    case "ready":
      return "Bestelling gereed";
    case "picked_up":
      return "Bestelling afgehaald";
    case "preparing":
      return "Op de grill";
    case "confirmed":
      return "Bevestigd";
    case "cancelled":
      return "Geannuleerd";
    default:
      return "In behandeling";
  }
}

export default async function OrderStatusPage({ params }: Props) {
  const { orderNumber } = await params;
  const decoded = decodeURIComponent(orderNumber);

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-lg px-4 py-32 text-center">
        <h1 className="font-heading text-2xl uppercase text-white">Status tijdelijk niet beschikbaar</h1>
        <p className="text-muted-foreground mt-3 text-sm">Neem contact op via WhatsApp.</p>
        <GlowButton href={getWhatsAppHref("home")} variant="flame" className="mt-6">
          WhatsApp
        </GlowButton>
      </div>
    );
  }

  let order;
  try {
    order = await getOrderByNumber(decoded);
  } catch {
    notFound();
  }

  if (!order) notFound();

  const lines = Array.isArray(order.lines) ? order.lines : [];

  return (
    <div className="border-t border-white/10 bg-[#080808] pb-16 pt-24 sm:pt-28 md:pb-24 md:pt-32">
      <div className="mx-auto max-w-lg space-y-6 px-4 md:px-6">
        <p className="text-primary text-xs font-semibold uppercase tracking-[0.28em]">Bestelling</p>
        <h1 className="font-heading text-3xl uppercase tracking-wide text-white">
          {paymentLabel(order.payment_status)}
        </h1>
        <p className="font-mono text-sm text-[#d4af37]">{order.order_number}</p>
        <dl className="space-y-2 rounded-2xl border border-white/10 bg-[#111] p-5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Orderstatus</dt>
            <dd className="text-white">{orderLabel(order.status)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Afhalen</dt>
            <dd className="text-white">
              {order.pickup_date} om {order.pickup_time}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Totaal</dt>
            <dd className="font-semibold text-white">{formatPriceCents(order.total_cents)}</dd>
          </div>
        </dl>

        <ul className="space-y-2 rounded-2xl border border-white/10 bg-[#111] p-5 text-sm">
          {lines.map((line: Record<string, unknown>, i: number) => (
            <li key={i} className="flex justify-between gap-3 text-muted-foreground">
              <span>
                {String(line.qty)}× {String(line.name)}
                {Array.isArray(line.optionLabels) && line.optionLabels.length
                  ? ` (${(line.optionLabels as string[]).join(", ")})`
                  : ""}
              </span>
              <span className="text-white">
                {typeof line.lineTotalCents === "number"
                  ? formatPriceCents(line.lineTotalCents)
                  : ""}
              </span>
            </li>
          ))}
        </ul>

        <p className="text-muted-foreground text-sm leading-relaxed">
          {order.payment_status === "paid"
            ? "Bedankt! Kom op het gekozen moment afhalen. Vragen? WhatsApp ons."
            : order.payment_status === "pending" || order.payment_status === "unpaid"
              ? "We controleren je betaling. Vernieuw deze pagina over een moment."
              : "De betaling is niet gelukt. Probeer opnieuw te bestellen of neem contact op."}
        </p>

        <div className="flex flex-wrap gap-3">
          <GlowButton href={getWhatsAppHref("home")} variant="flame">
            WhatsApp
          </GlowButton>
          <Link
            href="/bestellen"
            className="inline-flex min-h-11 items-center rounded-full border border-white/20 px-6 text-sm font-semibold uppercase tracking-wider text-white"
          >
            Opnieuw bestellen
          </Link>
        </div>
      </div>
    </div>
  );
}
