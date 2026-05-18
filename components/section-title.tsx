import { cn } from "@/lib/utils";

type SectionTitleProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionTitle({
  id,
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionTitleProps) {
  return (
    <div
      className={cn(
        "max-w-3xl space-y-4",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="text-primary text-xs font-semibold uppercase tracking-[0.35em]">
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className="font-heading text-4xl leading-[0.92] tracking-[0.04em] text-white uppercase sm:text-5xl md:text-6xl lg:text-[3.5rem]"
      >
        {title}
      </h2>
      {description ? (
        <p className="text-muted-foreground max-w-2xl text-base leading-relaxed text-balance md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
