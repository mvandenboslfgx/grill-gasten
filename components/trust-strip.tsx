import { trustInzetbaar } from "@/lib/data/trust";

export function TrustStrip() {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#111] p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white">Grill Gasten</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {trustInzetbaar.map((label) => (
          <li
            key={label}
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-muted-foreground"
          >
            {label}
          </li>
        ))}
      </ul>
      <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
        Bestel online of vraag naar catering voor je feestje — we denken graag mee.
      </p>
    </div>
  );
}
