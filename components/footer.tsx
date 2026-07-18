import Link from "next/link";
import { Mail, MapPin, MessageCircle, Music2, Phone, Share2 } from "lucide-react";
import { PhoneLink } from "@/components/phone-link";
import { BrandLogo } from "@/components/brand-logo";
import { navLinks, site } from "@/lib/site";
import { getWhatsAppHref } from "@/lib/whatsapp";

const footerWhatsApp = getWhatsAppHref("footer");

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505]">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-2 md:px-6 lg:grid-cols-4 lg:px-8">
        <div className="flex flex-col items-center space-y-4 text-center md:items-start md:text-left">
          <BrandLogo linked size="footer" className="mx-auto md:mx-0" />
          <p className="text-primary max-w-xs text-xs font-semibold uppercase tracking-[0.22em] sm:text-sm sm:tracking-[0.26em]">
            {site.slogan}
          </p>
          <p className="text-muted-foreground text-sm leading-relaxed">{site.description}</p>
          <div className="flex w-full flex-col gap-2 pt-2 sm:flex-row sm:flex-wrap sm:justify-start">
            <a
              href={footerWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#25D366]/40 bg-[#25D366]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white hover:bg-[#25D366]/20"
            >
              <MessageCircle className="size-4 text-[#25D366]" aria-hidden />
              WhatsApp
            </a>
            <PhoneLink className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white">
              <Phone className="size-4 text-primary" aria-hidden />
              {site.phoneDisplay}
            </PhoneLink>
          </div>
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
            <li className="flex items-center gap-2">
              <Phone className="size-4 shrink-0 text-primary" aria-hidden />
              <PhoneLink />
            </li>
            <li className="flex items-center gap-2">
              <Mail className="size-4 shrink-0 text-primary" aria-hidden />
              <a className="hover:text-white" href={`mailto:${site.email}`}>
                {site.email}
              </a>
            </li>
            <li>
              <a className="hover:text-white" href={footerWhatsApp} target="_blank" rel="noopener noreferrer">
                WhatsApp — boekingen en vragen
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white">Socials</p>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Share2 className="size-4 shrink-0 text-primary" aria-hidden />
              <a className="hover:text-white" href={site.instagram} rel="noopener noreferrer" target="_blank">
                Instagram
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Music2 className="size-4 shrink-0 text-primary" aria-hidden />
              <a className="hover:text-white" href={site.tiktok} rel="noopener noreferrer" target="_blank">
                TikTok
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
            <Link className="hover:text-white" href="/voorwaarden">
              Voorwaarden
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
