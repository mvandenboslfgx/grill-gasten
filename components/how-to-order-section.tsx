import { AnimatedContainer } from "@/components/animated-container";

const STEPS = [
  {
    n: "1",
    title: "Kies je gerechten",
    body: "Smashburgers, loaded fries, chicken en extras — met echte prijzen.",
  },
  {
    n: "2",
    title: "Kies afhalen of bezorgen",
    body: "Afhalen zonder bezorgkosten, of bezorgen in de Hoeksche Waard.",
  },
  {
    n: "3",
    title: "Selecteer een beschikbaar moment",
    body: "Alleen echte afhaalmomenten of bezorgtijdvakken van 30 minuten.",
  },
  {
    n: "4",
    title: "Betaal veilig",
    body: "Online via Mollie (iDEAL en meer).",
  },
  {
    n: "5",
    title: "Haal af of ontvang je bestelling",
    body: "Je krijgt een bestelnummer en duidelijke status.",
  },
] as const;

export function HowToOrderSection() {
  return (
    <section className="border-t border-white/10 bg-[#080808] py-14 md:py-20" aria-labelledby="howto-heading">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <AnimatedContainer>
          <h2 id="howto-heading" className="font-heading text-2xl uppercase tracking-wide text-white md:text-3xl">
            Zo werkt bestellen
          </h2>
        </AnimatedContainer>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s, i) => (
            <AnimatedContainer key={s.n} delay={i * 0.04}>
              <li className="list-none rounded-2xl border border-white/10 bg-[#111] p-5">
                <span className="text-primary font-heading text-3xl">{s.n}</span>
                <h3 className="mt-3 font-heading text-base uppercase text-white">{s.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{s.body}</p>
              </li>
            </AnimatedContainer>
          ))}
        </ol>
      </div>
    </section>
  );
}
