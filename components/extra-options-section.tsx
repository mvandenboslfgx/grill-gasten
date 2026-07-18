import { AnimatedContainer } from "@/components/animated-container";
import { catalogOptions } from "@/lib/catalog/options";
import { formatPriceCents } from "@/lib/catalog/products";

export function ExtraOptionsSection() {
  const extras = catalogOptions;

  return (
    <section className="border-t border-white/10 bg-[#080808] py-14 md:py-20" aria-labelledby="extras-heading">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <AnimatedContainer>
          <h2 id="extras-heading" className="font-heading text-2xl uppercase tracking-wide text-white md:text-3xl">
            Extra opties
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl text-sm">
            Ei en bacon zijn optioneel — niet standaard inbegrepen. Augurk kan gratis als vervanging voor
            komkommer en tomaat.
          </p>
        </AnimatedContainer>
        <ul className="mt-8 grid gap-4 sm:grid-cols-3">
          {extras.map((o, i) => (
            <AnimatedContainer key={o.id} delay={i * 0.04}>
              <li className="list-none">
              <div className="rounded-2xl border border-white/10 bg-[#111] p-5">
                <p className="font-heading text-lg uppercase text-white">{o.name}</p>
                <p className="mt-2 text-sm font-semibold text-[#d4af37]">
                  {o.priceCents === 0 ? "Gratis" : `+ ${formatPriceCents(o.priceCents)}`}
                </p>
                <p className="text-muted-foreground mt-2 text-sm">{o.description}</p>
              </div>
              </li>
            </AnimatedContainer>
          ))}
        </ul>
      </div>
    </section>
  );
}
