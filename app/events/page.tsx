import type { Metadata } from "next";
import { AnimatedContainer } from "@/components/animated-container";
import { EventCard } from "@/components/event-card";
import { SectionTitle } from "@/components/section-title";
import { upcomingEvents } from "@/lib/data/events";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Waar je Grill Gasten vindt — festivals, events en streetfood door Nederland. Vanuit de Hoeksche Waard.",
};

export default function EventsPage() {
  return (
    <div className="border-t border-white/10 bg-[#0a0a0a] pb-16 pt-24 sm:pt-28 md:pb-24 md:pt-32">
      <div className="mx-auto max-w-6xl space-y-12 px-4 md:px-6 lg:px-8">
        <AnimatedContainer>
          <SectionTitle
            eyebrow="Tour schedule"
            title="Festivals & locations"
            description="Kom langs, proef de smash, voel de bass. Nieuwe stops worden regelmatig toegevoegd."
          />
        </AnimatedContainer>

        <div className="grid gap-6 md:grid-cols-2">
          {upcomingEvents.map((event, index) => (
            <AnimatedContainer key={event.id} delay={index * 0.05}>
              <EventCard event={event} />
            </AnimatedContainer>
          ))}
        </div>
      </div>
    </div>
  );
}
