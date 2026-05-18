import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";

export const LOGO_SRC = "/brand/grill-gasten-logo.png" as const;

const LOGO_WIDTH = 512;
const LOGO_HEIGHT = 560;

type BrandLogoSize = "sm" | "md" | "nav" | "footer";

type BrandLogoProps = {
  className?: string;
  imageClassName?: string;
  size?: BrandLogoSize;
  linked?: boolean;
  priority?: boolean;
};

/** Breedte-gestuurd zodat tekst in het badge-logo leesbaar blijft op mobiel */
const sizeClass: Record<BrandLogoSize, string> = {
  sm: "h-11 w-auto max-w-[9.5rem] sm:max-w-[10.5rem]",
  md: "h-12 w-auto max-w-[10.5rem] sm:max-w-[12rem] md:h-14 md:max-w-[13.5rem]",
  nav: "h-12 w-auto max-w-[min(58vw,12.5rem)] sm:h-14 sm:max-w-[14rem] md:h-16 md:max-w-[15.5rem] lg:h-[4.25rem] lg:max-w-[17rem]",
  footer:
    "h-auto w-full max-w-[min(88vw,16rem)] sm:max-w-[18rem] md:max-w-[20rem] lg:max-w-[22rem]",
};

const imageSizes: Record<BrandLogoSize, string> = {
  sm: "(max-width: 640px) 152px, 168px",
  md: "(max-width: 768px) 168px, 216px",
  nav: "(max-width: 640px) 200px, (max-width: 1024px) 248px, 272px",
  footer: "(max-width: 640px) 256px, (max-width: 1024px) 288px, 352px",
};

export function BrandLogo({
  className,
  imageClassName,
  size = "md",
  linked = false,
  priority = false,
}: BrandLogoProps) {
  const image = (
    <Image
      src={LOGO_SRC}
      alt={`${site.name} logo`}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      priority={priority}
      sizes={imageSizes[size]}
      className={cn("object-contain object-left", sizeClass[size], imageClassName)}
    />
  );

  const wrap = (
    <span className={cn("inline-flex max-w-full shrink-0 items-center", className)}>{image}</span>
  );

  if (!linked) return wrap;

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex max-w-full shrink-0 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
        className,
      )}
      aria-label={`${site.name} — naar home`}
    >
      {image}
    </Link>
  );
}
