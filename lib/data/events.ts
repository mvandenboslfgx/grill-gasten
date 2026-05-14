export type FestivalEvent = {
  id: string;
  name: string;
  city: string;
  date: string;
  location: string;
  href: string;
  /** Optional MDX story under `/published/events/{slug}` */
  storyHref?: string;
};

export const upcomingEvents: FestivalEvent[] = [
  {
    id: "amsterdam-beats",
    name: "Amsterdam Beats",
    city: "Amsterdam",
    date: "2026-06-14",
    location: "NDSM Wharf — Food Stage",
    href: "/contact",
    storyHref: "/published/events/amsterdam-beats",
  },
  {
    id: "rotterdam-rush",
    name: "Rotterdam Rush",
    city: "Rotterdam",
    date: "2026-06-28",
    location: "Maashaven — Night Market",
    href: "/contact",
  },
  {
    id: "utrecht-lights",
    name: "Utrecht Lights",
    city: "Utrecht",
    date: "2026-07-05",
    location: "Lepelenburg Park",
    href: "/contact",
  },
  {
    id: "tilburg-sound",
    name: "Tilburg Sound",
    city: "Tilburg",
    date: "2026-07-19",
    location: "Spoorpark — Main Lane",
    href: "/contact",
  },
  {
    id: "groningen-pulse",
    name: "Groningen Pulse",
    city: "Groningen",
    date: "2026-08-02",
    location: "EM2 Venue — Outdoor",
    href: "/contact",
  },
];
