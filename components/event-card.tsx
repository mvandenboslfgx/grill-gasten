"use client";

import type { FestivalEvent } from "@/lib/data/events";

/** @deprecated */
export function EventCard({ event }: { event: FestivalEvent }) {
  return (
    <article className="rounded-2xl border border-white/10 p-4 text-white">
      <p className="font-heading text-lg uppercase">{event.name}</p>
      <p className="text-muted-foreground text-sm">
        {event.city} — {event.date}
      </p>
    </article>
  );
}
