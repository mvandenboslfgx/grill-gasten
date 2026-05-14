"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { GlowButton } from "@/components/button";
import type { FestivalEvent } from "@/lib/data/events";

type EventCardProps = {
  event: FestivalEvent;
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("nl-NL", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

export function EventCard({ event }: EventCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={reduceMotion ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 260, damping: 24 }}
    >
      <Card className="h-full border-white/10 bg-[#111] shadow-[0_20px_60px_-40px_rgba(0,0,0,0.9)] transition hover:border-primary/35">
        <CardHeader className="space-y-2">
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.3em]">
            {event.city}
          </p>
          <h3 className="font-heading text-3xl tracking-wide text-white uppercase">
            {event.name}
          </h3>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p className="flex items-start gap-2">
            <CalendarDays className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <span>{formatDate(event.date)}</span>
          </p>
          <p className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
            <span>{event.location}</span>
          </p>
          {event.storyHref ? (
            <p>
              <Link
                href={event.storyHref}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-primary hover:text-white"
              >
                Lees verhaal →
              </Link>
            </p>
          ) : null}
        </CardContent>
        <CardFooter>
          <GlowButton href={event.href} variant="outline">
            Plan een meet
          </GlowButton>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
