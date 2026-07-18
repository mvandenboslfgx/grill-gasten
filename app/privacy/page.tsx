import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacyverklaring",
  description: `Privacyverklaring van ${site.name} — hoe we persoonsgegevens verwerken bij bestellingen en contact.`,
};

const UPDATED = "18 juli 2026";

export default function PrivacyPage() {
  return (
    <div className="border-t border-white/10 bg-[#080808] pb-16 pt-24 sm:pt-28 md:pb-24 md:pt-32">
      <article className="prose-invert mx-auto max-w-3xl space-y-8 px-4 text-sm leading-relaxed text-muted-foreground md:px-6">
        <header className="space-y-3">
          <h1 className="font-heading text-3xl uppercase tracking-wide text-white">Privacyverklaring</h1>
          <p>Laatst bijgewerkt: {UPDATED}</p>
        </header>

        <section className="space-y-3">
          <h2 className="font-heading text-xl uppercase text-white">Wie zijn wij</h2>
          <p>
            {site.name} ({site.founders}) — regio {site.region}. Contact:{" "}
            <a className="text-white hover:underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            , telefoon {site.phoneDisplay}.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl uppercase text-white">Welke gegevens verwerken wij</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Contactgegevens: naam, telefoonnummer, e-mailadres</li>
            <li>Bestelgegevens: producten, aantallen, extras, opmerkingen, totaalbedrag</li>
            <li>Afhaaldatum en -tijd</li>
            <li>Betaalstatus en betalingsreferenties via onze betaaldienstverlener</li>
            <li>Catering- of contactberichten die je zelf stuurt</li>
            <li>
              Eventuele loyalty-/rewardsgegevens alleen wanneer je je hiervoor expliciet hebt aangemeld
              (indien die functie actief is)
            </li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl uppercase text-white">Doeleinden</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Uitvoering van de overeenkomst (bestelling, betaling, afhalen)</li>
            <li>Klantenservice en beantwoorden van vragen</li>
            <li>Administratieve en fiscale verplichtingen</li>
            <li>Fraude- en misbruikpreventie (o.a. spamfilters, rate limiting)</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl uppercase text-white">Verwerkers en diensten</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-white">Supabase</strong> — database voor bestellingen en gerelateerde
              gegevens (wanneer online bestellen actief is)
            </li>
            <li>
              <strong className="text-white">Mollie</strong> — betaaldienstverlener (iDEAL en andere methoden)
            </li>
            <li>
              <strong className="text-white">Resend</strong> en/of <strong className="text-white">Formspree</strong>{" "}
              — e-mailbezorging van formulieren en bestelmeldingen (wanneer geconfigureerd)
            </li>
            <li>
              <strong className="text-white">Vercel</strong> — hosting van de website
            </li>
          </ul>
          <p>
            Deze partijen verwerken gegevens in opdracht of als zelfstandige verwerkingsverantwoordelijke
            voor hun eigen diensten (bijv. betalingen). Raadpleeg hun privacyverklaringen voor details.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl uppercase text-white">Bewaartermijnen</h2>
          <p>
            Bestel- en contactgegevens bewaren we zo lang als nodig voor de uitvoering van de bestelling,
            klantenservice en wettelijke bewaarplichten (bijv. administratie). Daarna worden gegevens
            verwijderd of geanonimiseerd waar mogelijk.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl uppercase text-white">Jouw rechten</h2>
          <p>
            Je hebt onder de AVG onder meer recht op inzage, rectificatie, verwijdering, beperking van
            verwerking en dataportabiliteit, voor zover van toepassing. Neem contact op via{" "}
            <a className="text-white hover:underline" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            .
          </p>
          <p>
            Je kunt ook een klacht indienen bij de{" "}
            <a
              className="text-white hover:underline"
              href="https://www.autoriteitpersoonsgegevens.nl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Autoriteit Persoonsgegevens
            </a>
            .
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl uppercase text-white">Cookies</h2>
          <p>
            We gebruiken functionele technieken die nodig zijn voor de werking van de site (bijv. winkelmand
            in je browser). Geen marketingcookies zonder jouw toestemming.
          </p>
        </section>

        <p>
          Zie ook onze{" "}
          <Link href="/voorwaarden" className="text-white hover:underline">
            bestelvoorwaarden
          </Link>
          .
        </p>
      </article>
    </div>
  );
}
