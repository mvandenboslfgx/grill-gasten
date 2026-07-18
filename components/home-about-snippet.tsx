import Link from "next/link";
import { AnimatedContainer } from "@/components/animated-container";
import { site } from "@/lib/site";

export function HomeAboutSnippet() {
  return (
    <section className="border-t border-white/10 bg-[#080808] py-14 md:py-20" aria-labelledby="about-snippet">
      <div className="mx-auto max-w-6xl px-4 md:px-6 lg:px-8">
        <AnimatedContainer className="max-w-2xl">
          <p className="text-primary text-xs font-semibold uppercase tracking-[0.28em]">Over ons</p>
          <h2 id="about-snippet" className="font-heading mt-3 text-2xl uppercase tracking-wide text-white md:text-3xl">
            Mike en Matthijs
          </h2>
          <p className="text-muted-foreground mt-4 text-sm leading-relaxed md:text-base">
            Grill Gasten is begonnen vanuit een gedeelde liefde voor goed eten, stevige burgers en gezelligheid.
            We maken gerechten waar we zelf enthousiast van worden: verse smashburgers, loaded fries en
            combinaties zonder onnodig gedoe — uit de {site.region}.
          </p>
          <Link
            href="/about"
            className="mt-6 inline-flex min-h-11 items-center text-sm font-semibold uppercase tracking-wider text-primary hover:underline"
          >
            Meer over ons
          </Link>
        </AnimatedContainer>
      </div>
    </section>
  );
}
