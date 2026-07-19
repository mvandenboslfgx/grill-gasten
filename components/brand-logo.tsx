import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

export const LOGO_SRC = "/brand/grill-gasten-logo.webp" as const;

const LOGO_WIDTH = 432;
const LOGO_HEIGHT = 432;

type BrandLogoSize = "sm" | "md" | "nav" | "footer";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  size?: BrandLogoSize;
  linked?: boolean;
  priority?: boolean;
};

/**
 * Hoogte-gestuurd; vaste renderbox zodat transparante marges in het PNG
 * de header niet uitrekken. Geen flex-1 — logo mag ruimte niet opeisen.
 */
const sizeClass: Record<BrandLogoSize, string> = {
  sm: "h-11 w-auto max-w-[9rem]",
  md: "h-12 w-auto max-w-[10.5rem] md:h-14",
  nav: "h-12 w-auto max-w-[10.5rem] sm:h-[3.25rem] sm:max-w-[11.5rem] xl:h-14 xl:max-w-[12.5rem] 2xl:h-16 2xl:max-w-[13.5rem]",
  footer: "h-auto w-full max-w-[min(88vw,16rem)] sm:max-w-[18rem] md:max-w-[20rem]",
};

const imageSizes: Record<BrandLogoSize, string> = {
  sm: "144px",
  md: "(max-width: 768px) 168px, 200px",
  nav: "(max-width: 640px) 168px, (max-width: 1280px) 184px, 216px",
  footer: "(max-width: 640px) 256px, (max-width: 1024px) 288px, 320px",
};

export function BrandLogo({
  className,
  imageClassName,
  size = "md",
  linked = false,
  priority = false,
}: BrandLogoProps) {
  const image = (
    <span
      className={cn(
        "relative inline-flex h-full max-h-full max-w-full shrink-0 items-center overflow-hidden",
        size === "nav" && "h-12 sm:h-[3.25rem] xl:h-14 2xl:h-16",
      )}
    >
      <Image
        src={LOGO_SRC}
        alt={linked ? "" : `${site.name} logo`}
        width={LOGO_WIDTH}
        height={LOGO_HEIGHT}
        priority={priority}
        sizes={imageSizes[size]}
        className={cn(
          "object-contain object-left",
          sizeClass[size],
          imageClassName,
        )}
      />
    </span>
  );

  if (!linked) {
    return (
      <span className={cn("inline-flex shrink-0 items-center", className)}>
        {image}
      </span>
    );
  }

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex shrink-0 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
        className,
      )}
      aria-label={`${site.name} — naar home`}
    >
      {image}
    </Link>
  );
}
