import Link from "next/link";
import { MessageCircle, UtensilsCrossed, Clock3 } from "lucide-react";
import { GlowButton } from "@/components/button";
import { PhoneLink } from "@/components/phone-link";
import { CLOSED_ORDERING_COPY } from "@/features/order/closed-ordering-content";
import { getWhatsAppHref } from "@/lib/whatsapp";

const benefitIcons = [MessageCircle, UtensilsCrossed, Clock3] as const;

/**
 * Server-rendered closed ordering experience when orderingEnabled is false.
 * Does not replace API fail-closed guards.
 */
export function ClosedOrderingExperience() {
  const whatsappHref = getWhatsAppHref("order");
  const copy = CLOSED_ORDERING_COPY;

  return (
    <section
      className="mx-auto w-full max-w-3xl px-4 py-10 md:px-6 md:py-14 lg:px-8"
      aria-labelledby="closed-ordering-heading"
    >
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#ff8a50]">
        Bestellen
      </p>

      <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-white/90">
        <span className="size-1.5 rounded-full bg-[#ff8a50]" aria-hidden />
        {copy.badge}
      </p>

      <h1
        id="closed-ordering-heading"
        className="font-heading mt-6 text-4xl uppercase leading-[0.95] tracking-[0.04em] text-white sm:text-5xl"
      >
        {copy.h1}
      </h1>

      <p className="text-muted-foreground mt-5 max-w-xl text-base leading-relaxed">{copy.intro}</p>

      <p className="mt-4 text-sm font-medium text-white/80">{copy.statusLine}</p>

      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap">
        <GlowButton href={whatsappHref} variant="flame" className="min-h-12 w-full sm:w-auto">
          {copy.primaryCta}
        </GlowButton>
        <GlowButton href="/menu" variant="outline" className="min-h-12 w-full sm:w-auto">
          {copy.secondaryCta}
        </GlowButton>
      </div>

      <ul className="mt-12 grid gap-4 sm:grid-cols-3">
        {copy.benefits.map((item, index) => {
          const Icon = benefitIcons[index] ?? MessageCircle;
          return (
            <li key={item.title} className="rounded-2xl border border-white/10 bg-[#111] p-5">
              <Icon className="size-5 text-primary" aria-hidden />
              <h2 className="mt-3 text-sm font-semibold uppercase tracking-[0.1em] text-white">
                {item.title}
              </h2>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{item.body}</p>
            </li>
          );
        })}
      </ul>

      <div className="mt-12 rounded-2xl border border-white/10 bg-[#0d0d0d] p-5 sm:p-6">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-white">
          {copy.contactHeading}
        </h2>
        <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
          <li>
            WhatsApp:{" "}
            <Link
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-white underline-offset-4 hover:underline"
            >
              {copy.phoneDisplay}
            </Link>
          </li>
          <li>
            Bellen: <PhoneLink className="font-medium text-white underline-offset-4 hover:underline" />
          </li>
          <li>
            Mail:{" "}
            <a
              href={`mailto:${copy.email}`}
              className="font-medium text-white underline-offset-4 hover:underline"
            >
              {copy.email}
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
