import Image from "next/image";
import Link from "next/link";
import { FOOD } from "@/lib/data/food-imagery";
import { site } from "@/lib/site";
import { getWhatsAppHref } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/**
 * Server-rendered hero — LCP image without client JS / framer on the critical path.
 */
export function HeroSection() {
  const img = FOOD.smashHands;

  return (
    <section className="relative isolate flex min-h-[100dvh] min-h-[100svh] flex-col justify-end overflow-hidden bg-[#030303]">
      <div className="absolute inset-0">
        <Image
          src={img.src}
          alt=""
          fill
          priority
          fetchPriority="high"
          quality={75}
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 100vw, 1280px"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#030303] via-[#030303]/75 to-[#030303]/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#030303]/90 via-transparent to-transparent" />
      </div>

      <div className="site-page-hero-pad relative z-10 mx-auto w-full max-w-6xl px-4 pb-28 md:px-6 md:pb-32 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#ff8a50]">
          {site.name}
        </p>
        <h1 className="font-heading mt-4 max-w-3xl text-4xl uppercase leading-[0.95] tracking-[0.04em] text-white sm:text-5xl md:text-6xl lg:text-7xl">
          Smashburgers waar je voor terugkomt.
        </h1>
        <p className="text-muted-foreground mt-5 max-w-xl text-base leading-relaxed sm:text-lg">
          Verse smashburgers, loaded fries en spicy chicken. Afhalen of bezorgd in de Hoeksche Waard.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <HeroCta href="/bestellen" variant="flame">
            Bestel nu
          </HeroCta>
          <HeroCta href="/menu" variant="outline">
            Bekijk menu
          </HeroCta>
          <HeroCta href={getWhatsAppHref("home")} variant="outline" external>
            WhatsApp
          </HeroCta>
        </div>
      </div>
    </section>
  );
}

function HeroCta({
  href,
  children,
  variant,
  external,
}: {
  href: string;
  children: React.ReactNode;
  variant: "flame" | "outline";
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      {...(external
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={cn(
        "inline-flex min-h-12 items-center justify-center rounded-full px-7 text-sm font-bold uppercase tracking-wider transition",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        variant === "flame"
          ? "bg-primary text-primary-foreground hover:brightness-110"
          : "border border-white/25 text-white hover:border-white/50 hover:bg-white/5",
      )}
    >
      {children}
    </Link>
  );
}
