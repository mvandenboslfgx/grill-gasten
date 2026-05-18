import { Phone } from "lucide-react";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

type PhoneLinkProps = {
  className?: string;
  children?: React.ReactNode;
  /** Icoon tonen (knoppen / sticky bar) */
  showIcon?: boolean;
  /**
   * compact — label + nummer (sticky bar)
   * inline — alleen het nummer (default)
   */
  variant?: "inline" | "compact";
  compactLabel?: string;
};

export function PhoneLink({
  className,
  children,
  showIcon = false,
  variant = "inline",
  compactLabel = "Bel direct",
}: PhoneLinkProps) {
  const content =
    children ??
    (variant === "compact" ? (
      <span className="flex flex-col items-center leading-tight">
        <span>{compactLabel}</span>
        <span className="mt-0.5 text-[10px] font-medium normal-case tracking-normal text-white/90">
          {site.phoneDisplay}
        </span>
      </span>
    ) : (
      site.phoneDisplay
    ));

  return (
    <a
      href={site.phoneTel}
      className={cn(
        "hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        className,
      )}
      aria-label={`Bel Grill Gasten op ${site.phoneDisplay}`}
    >
      {showIcon ? (
        <span className="inline-flex items-center gap-2">
          <Phone className="size-4 shrink-0 text-primary" aria-hidden />
          {content}
        </span>
      ) : (
        content
      )}
    </a>
  );
}
