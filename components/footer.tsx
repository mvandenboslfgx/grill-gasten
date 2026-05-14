import Link from "next/link";
import { MapPin, Music2, Share2 } from "lucide-react";
import { navLinks, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505]">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-2 md:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-4">
          <p className="font-heading text-3xl tracking-[0.12em] text-white uppercase">
            Grill <span className="text-primary">Gasten</span>
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">{site.description}</p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white">Navigatie</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link className="hover:text-white" href={l.href}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white">Contact</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <span>{site.address}</span>
            </li>
            <li>
              <a className="hover:text-white" href={site.whatsapp} rel="noreferrer" target="_blank">
                WhatsApp — boekingen & vragen
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white">Socials</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Share2 className="size-4 shrink-0 text-primary" aria-hidden />
              <a className="hover:text-white" href={site.instagram} rel="noreferrer" target="_blank">
                Instagram
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Music2 className="size-4 shrink-0 text-primary" aria-hidden />
              <a className="hover:text-white" href={site.tiktok} rel="noreferrer" target="_blank">
                TikTok
              </a>
            </li>
            <li>
              <a className="hover:text-white" href={site.whatsapp} rel="noreferrer" target="_blank">
                WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {site.name}. Alle rechten voorbehouden.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
            <Link className="hover:text-white" href="/privacy">
              Privacy
            </Link>
            <p className="text-gradient-silver font-medium uppercase tracking-[0.25em]">
              Loaded. Gegrild. Legendarisch.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
