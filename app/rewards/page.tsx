import type { Metadata } from "next";
import { AnimatedContainer } from "@/components/animated-container";
import { GlowButton } from "@/components/button";
import { SectionTitle } from "@/components/section-title";
import { RewardsWaitlistForm } from "@/features/rewards/rewards-waitlist-form";
import { rewardCatalog, rewardTiers } from "@/lib/data/rewards";
import { getWhatsAppHref } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Grill Rewards",
  description:
    "Spaar punten bij Grill Gasten — €1 = 1 punt. Gratis burgers, loaded fries en VIP deals. Meld je aan voor early access.",
};

export default function RewardsPage() {
  return (
    <div className="border-t border-white/10 bg-[#080808] pb-16 pt-24 sm:pt-28 md:pb-24 md:pt-32">
      <div className="mx-auto max-w-6xl space-y-14 px-4 md:px-6 lg:px-8">
        <AnimatedContainer>
          <SectionTitle
            eyebrow="Grill Rewards"
            title="Spaar. Claim. Geniet."
            description="€1 besteed = 1 punt. Verzilver rewards bij de truck — loyalty gebouwd voor festivals en events."
          />
        </AnimatedContainer>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {rewardTiers.map((tier, i) => (
            <AnimatedContainer key={tier.id} delay={i * 0.05}>
              <article className="h-full rounded-2xl border border-white/10 bg-[#111] p-5">
                <p className="text-[#d4af37] text-xs font-semibold uppercase tracking-[0.2em]">
                  {tier.fromPoints}+ punten
                </p>
                <h2 className="font-heading mt-2 text-2xl uppercase text-white">{tier.name}</h2>
                <ul className="text-muted-foreground mt-3 space-y-2 text-sm">
                  {tier.perks.map((p) => (
                    <li key={p}>· {p}</li>
                  ))}
                </ul>
              </article>
            </AnimatedContainer>
          ))}
        </div>

        <AnimatedContainer>
          <h2 className="font-heading text-2xl uppercase tracking-wide text-white">Rewards catalogus</h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {rewardCatalog.map((r) => (
              <li
                key={r.id}
                className="rounded-2xl border border-white/10 bg-gradient-to-b from-[#151515] to-[#0c0c0c] p-4"
              >
                <p className="font-heading text-lg text-white">{r.title}</p>
                <p className="text-primary mt-1 text-sm font-semibold">{r.points} punten</p>
              </li>
            ))}
          </ul>
        </AnimatedContainer>

        <AnimatedContainer className="rounded-3xl border border-[#d4af37]/30 bg-[#111] p-6 md:p-8">
          <h2 className="font-heading text-2xl uppercase text-white">Early access</h2>
          <p className="text-muted-foreground mt-2 max-w-xl text-sm">
            Account, QR-scan en wallet komen in fase 2 (Supabase + app). Meld je nu aan — eerste leden krijgen bonuspunten.
          </p>
          <div className="mt-6 max-w-md">
            <RewardsWaitlistForm />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <GlowButton href={getWhatsAppHref("home")} variant="outline">
              WhatsApp
            </GlowButton>
            <GlowButton href="/bestellen" variant="flame">
              Bestel en spaar straks
            </GlowButton>
          </div>
        </AnimatedContainer>
      </div>
    </div>
  );
}
