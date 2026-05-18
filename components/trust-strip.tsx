import { trustInzetbaar } from "@/lib/data/testimonials";

export function TrustStrip() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111] px-4 py-5 md:px-6">
      <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-primary md:text-left">
        Inzetbaar voor
      </p>
      <ul className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start" aria-label="Type events">
        {trustInzetbaar.map((label) => (
          <li
            key={label}
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground"
          >
            {label}
          </li>
        ))}
      </ul>
      <p className="text-muted-foreground mt-4 text-center text-xs leading-relaxed md:text-left">
        Van intiem bedrijfsfeest tot festivalterrein — vertel ons je datum en wij denken mee over setup en menu.
      </p>
    </div>
  );
}
