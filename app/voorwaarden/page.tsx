import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Voorwaarden",
  description: `Algemene en bestelvoorwaarden van ${site.name}.`,
};

const UPDATED = "18 juli 2026";

export default function VoorwaardenPage() {
  return (
    <div className="border-t border-white/10 bg-[#080808] pb-16 pt-24 sm:pt-28 md:pb-24 md:pt-32">
      <article className="prose-invert mx-auto max-w-3xl space-y-8 px-4 text-sm leading-relaxed text-muted-foreground md:px-6">
        <header className="space-y-3">
          <h1 className="font-heading text-3xl uppercase tracking-wide text-white">
            Algemene en bestelvoorwaarden
          </h1>
          <p>Laatst bijgewerkt: {UPDATED}</p>
          <p>
            {/* TODO eigenaar: vul KvK / btw / vestigingsadres in wanneer beschikbaar — niet verzinnen */}
            {site.name} — {site.founders}. Contact: {site.email}, {site.phoneDisplay}. Regio{" "}
            {site.region}.
          </p>
        </header>

        <section className="space-y-3">
          <h2 className="font-heading text-xl uppercase text-white">1. Toepasselijkheid</h2>
          <p>
            Deze voorwaarden gelden op bestellingen via onze website en op aanverwante diensten (afhalen
            en bezorgen). Afwijkingen gelden alleen schriftelijk.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl uppercase text-white">2. Productaanbod en prijzen</h2>
          <p>
            Prijzen op de website zijn in euro&apos;s en gelden voor online bestellingen zolang het product
            beschikbaar is. Kennelijke prijs- of typefouten mogen worden gecorrigeerd; een bestelling kan
            dan worden geweigerd of aangepast na overleg.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl uppercase text-white">3. Bestellen en betalen</h2>
          <p>
            Een bestelling komt tot stand na succesvolle betaling via onze betaaldienstverlener (Mollie),
            tenzij anders overeengekomen. Bij mislukte, geannuleerde of verlopen betaling wordt de
            bestelling niet bereid.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl uppercase text-white">4. Afhalen</h2>
          <p>
            Je haalt de bestelling af op het gekozen moment. Kom op tijd. Bij te laat afhalen kunnen we
            niet garanderen dat het eten nog warm is of nog klaarstaat; terugbetaling is dan in beginsel
            niet verschuldigd tenzij wij in gebreke zijn.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl uppercase text-white">5. Bezorgen</h2>
          <p>
            We bezorgen in de Hoeksche Waard tot maximaal 25 km enkele reis vanaf Klaaswaal.
            Bezorgkosten en een minimum bestelbedrag (exclusief bezorgkosten) hangen af van de zone.
            Je kiest een bezorgtijdvak van 30 minuten. Tiengemeten is alleen mogelijk in overleg.
          </p>
          <p>
            Zorg dat het adres klopt en dat iemand de bestelling kan aannemen. Bij een onjuist adres,
            niet thuis zonder instructie, of vertraging buiten onze schuld, zijn wij niet verplicht tot
            gratis herbezorging of terugbetaling.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl uppercase text-white">6. Wijzigen en annuleren</h2>
          <p>
            Wijzigen of annuleren na betaling is alleen mogelijk in overleg en zolang bereiding nog niet
            is gestart. Neem direct contact op via WhatsApp of telefoon.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl uppercase text-white">7. Terugbetaling</h2>
          <p>
            Bij een aantoonbare fout van onze kant (verkeerde bestelling, niet geleverd terwijl betaald)
            herstellen we dit of betalen we terug via dezelfde betaalmethode waar mogelijk.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl uppercase text-white">8. Beschikbaarheid</h2>
          <p>
            Producten kunnen uitverkocht of tijdelijk niet beschikbaar zijn. Openingstijden en
            bestelvensters kunnen wijzigen.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl uppercase text-white">9. Allergenen</h2>
          <p>
            Heb je een allergie? Neem vóór het bestellen contact op. In onze keuken kan kruisbesmetting
            niet volledig worden uitgesloten.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl uppercase text-white">10. Klachten</h2>
          <p>
            Meld klachten zo snel mogelijk via {site.email} of WhatsApp, bij voorkeur met bestelnummer.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl uppercase text-white">11. Aansprakelijkheid</h2>
          <p>
            Onze aansprakelijkheid is beperkt tot het bedrag van de betreffende bestelling, voor zover
            dwingend recht niet anders bepaalt. Wij zijn niet aansprakelijk voor schade door te laat
            afhalen, bezorgen bij een onjuist adres, of onjuiste gegevens die je zelf hebt doorgegeven.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl uppercase text-white">12. Catering</h2>
          <p>
            Offertes voor feesten of evenementen zijn vrijblijvend tot schriftelijke bevestiging. Prijzen
            op aanvraag.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-heading text-xl uppercase text-white">13. Recht</h2>
          <p>Op deze voorwaarden is Nederlands recht van toepassing.</p>
        </section>

        <p>
          Zie ook onze{" "}
          <Link href="/privacy" className="text-white hover:underline">
            privacyverklaring
          </Link>
          .
        </p>
      </article>
    </div>
  );
}
