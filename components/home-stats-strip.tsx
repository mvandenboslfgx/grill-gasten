import { AnimatedContainer } from "@/components/animated-container";
import { homeStats } from "@/lib/data/home";
import { site } from "@/lib/site";

export function HomeStatsStrip() {
  return (
    <section className="border-y border-white/10 bg-[#0a0a0a] py-10">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <AnimatedContainer>
          <p className="text-center text-xs font-semibold uppercase tracking-[0.35em] text-primary">
            {site.serviceArea}
          </p>
          <ul className="mt-6 grid gap-6 sm:grid-cols-3">
            {homeStats.map((stat) => (
              <li key={stat.label} className="text-center">
                <p className="font-heading text-3xl uppercase tracking-wide text-white md:text-4xl">
                  {stat.value}
                </p>
                <p className="text-muted-foreground mt-1 text-xs font-semibold uppercase tracking-[0.2em]">
                  {stat.label}
                </p>
              </li>
            ))}
          </ul>
        </AnimatedContainer>
      </div>
    </section>
  );
}
