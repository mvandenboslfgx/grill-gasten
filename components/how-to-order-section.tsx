import { AnimatedContainer } from "@/components/animated-container";

const STEPS = [
  {
    n: "1",
    title: "Kies je gerechten",
    body: "Smashburgers, loaded fries, chicken en extras — met echte prijzen.",
  },
  {
    n: "2",
    title: "Kies je afhaalmoment",
    body: "Alleen beschikbare dagen en tijdsloten. Geen giswerk.",
  },
  {
    n: "3",
    title: "Betaal veilig en haal af",
    body: "Betaal online via Mollie (iDEAL en meer). Daarna afhalen op je gekozen moment.",
  },
] as const;

export function HowToOrderSection() {
  return (
    <section className="border-t border-white/10 bg-[#0a0a0a] py-14 md:py-20" aria-labelledby="howto-heading">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <AnimatedContainer>
          <h2 id="howto-heading" className="font-heading text-2xl uppercase tracking-wide text-white md:text-3xl">
            Zo werkt bestellen
          </h2>
        </AnimatedContainer>
        <ol className="mt-8 grid gap-6 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <AnimatedContainer key={s.n} delay={i * 0.05}>
              <li className="list-none">
              <div className="rounded-2xl border border-white/10 bg-[#111] p-5">
                <span className="text-primary font-heading text-3xl">{s.n}</span>
                <h3 className="mt-3 font-heading text-lg uppercase text-white">{s.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">{s.body}</p>
              </div>
              </li>
            </AnimatedContainer>
          ))}
        </ol>
      </div>
    </section>
  );
}
