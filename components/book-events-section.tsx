import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { AnimatedContainer } from "@/components/animated-container";
import { SectionTitle } from "@/components/section-title";
import { bookEventCards } from "@/lib/data/home";

export function BookEventsSection() {
  return (
    <section className="border-t border-white/10 bg-[#080808] py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <AnimatedContainer>
          <SectionTitle
            align="center"
            eyebrow="Waarom Grill Gasten"
            title="Boek ons voor jouw moment"
            description="Van privéfeest tot bedrijfsmoment — smashburgers en loaded fries, prijs op aanvraag."
          />
        </AnimatedContainer>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {bookEventCards.map((card, index) => (
            <AnimatedContainer key={card.title} delay={index * 0.05}>
              <Link
                href={card.href}
                className="premium-card group flex h-full flex-col rounded-3xl border border-white/10 bg-gradient-to-b from-[#151515] to-[#0a0a0a] p-7"
              >
                <div className="mb-5 inline-flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-primary">
                  <card.icon className="size-6" aria-hidden />
                </div>
                <h3 className="font-heading text-2xl uppercase tracking-wide text-white">{card.title}</h3>
                <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">{card.body}</p>
                <span className="text-primary mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em]">
                  Meer info
                  <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </section>
  );
}
