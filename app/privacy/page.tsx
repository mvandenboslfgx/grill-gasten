import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Privacyverklaring Grill Gasten — contact, gegevens en website.",
};

export default function PrivacyPage() {
  return (
    <div className="border-t border-white/10 bg-[#080808] pb-20 pt-28 md:pb-28 md:pt-32">
      <div className="mx-auto max-w-2xl space-y-10 px-4 md:px-6 lg:px-8">
        <header className="space-y-3">
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.35em]">Juridisch</p>
          <h1 className="font-heading text-4xl uppercase tracking-wide text-white md:text-5xl">Privacy</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Korte, eerlijke uitleg — geen corporate law wall. Vragen?{" "}
            <a className="text-primary hover:underline" href={site.whatsapp} rel="noreferrer" target="_blank">
              WhatsApp
            </a>{" "}
            of{" "}
            <a className="text-primary hover:underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
        </header>

        <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-heading text-xl uppercase tracking-wide text-white">Wie wij zijn</h2>
          <p>
            {site.name} ({site.founders}, {site.region}). Website:{" "}
            <a className="text-primary hover:underline" href={site.url}>
              {site.url.replace(/^https:\/\//, "")}
            </a>
            .
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-heading text-xl uppercase tracking-wide text-white">Formulieren &amp; contact</h2>
          <p>
            Aanvragen via de site openen <strong className="text-white/90">jouw eigen WhatsApp</strong> (of mail-app)
            met een door jou ingevuld bericht. Wij slaan die invoer <strong className="text-white/90">niet op</strong> op
            onze server: er is geen achterliggende database voor die formulieren. Als je ons mailt, gelden de gebruikelijke
            mail-praktijken van jouw provider en de onze.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-heading text-xl uppercase tracking-wide text-white">Cookies &amp; analytics</h2>
          <p>
            Zonder aparte analytics- of marketingtags gebruikt deze site vooral wat nodig is om de pagina te tonen. Als
            jullie later cookies of meetpixels toevoegen, wordt dit document bijgewerkt.
          </p>
        </section>

        <section className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <h2 className="font-heading text-xl uppercase tracking-wide text-white">Je rechten</h2>
          <p>
            Je mag altijd vragen wat we van je verwerken, rectificatie of verwijdering vragen waar dat past, en een
            klacht indienen bij de Autoriteit Persoonsgegevens. Praktisch: start het gesprek via WhatsApp of e-mail
            hierboven.
          </p>
        </section>

        <p className="text-xs text-muted-foreground">Laatst bijgewerkt: mei 2026</p>
      </div>
    </div>
  );
}
