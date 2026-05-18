import { Star, Flame, MapPin, Zap } from "lucide-react";
import { AnimatedContainer } from "@/components/animated-container";
import { site } from "@/lib/site";

const items = [
  {
    icon: Star,
    title: "5-sterren ervaring",
    body: "Festival- en eventklanten komen terug voor de smash.",
  },
  {
    icon: Zap,
    title: "Snelle service",
    body: "Rijen die doorlopen — ook bij drukte.",
  },
  {
    icon: Flame,
    title: "Premium kwaliteit",
    body: "Vers van de grill, geen standaard foodtruck.",
  },
  {
    icon: MapPin,
    title: "Heel Nederland",
    body: site.serviceArea,
  },
] as const;

export function TrustBar() {
  return (
    <section className="border-y border-white/10 bg-[#080808] py-10 md:py-12" aria-label="Waarom vertrouwen">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <AnimatedContainer>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <li
                key={item.title}
                className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition hover:border-[color-mix(in_oklab,#d4af37_40%,transparent)]"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-[#d4af37]/35 bg-[#d4af37]/10 text-[#d4af37]">
                  <item.icon className="size-5" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.12em] text-white">{item.title}</p>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">{item.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </AnimatedContainer>
      </div>
    </section>
  );
}
