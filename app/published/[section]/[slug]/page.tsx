import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getPublishedStaticParams,
  isContentSection,
  loadPublished,
  pickMeta,
} from "@/lib/content/published";
import { site } from "@/lib/site";

type PageProps = {
  params: Promise<{ section: string; slug: string }>;
};

export async function generateStaticParams() {
  return getPublishedStaticParams();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { section, slug } = await params;
  if (!isContentSection(section)) return {};
  const doc = await loadPublished(section, slug);
  if (!doc) return {};
  const { title, description } = pickMeta(doc.frontmatter, slug);
  return {
    title,
    description,
    openGraph: {
      title: `${title} — ${site.name}`,
      description,
      url: `${site.url}/published/${section}/${slug}`,
    },
  };
}

export default async function PublishedMdxPage({ params }: PageProps) {
  const { section, slug } = await params;
  if (!isContentSection(section)) notFound();

  const doc = await loadPublished(section, slug);
  if (!doc) notFound();

  const { title, description } = pickMeta(doc.frontmatter, slug);
  const date = typeof doc.frontmatter.date === "string" ? doc.frontmatter.date : null;

  return (
    <div className="border-t border-white/10 bg-[#080808] pb-20 pt-24 sm:pt-28 md:pt-32">
      <div className="mx-auto max-w-3xl px-4 md:px-6 lg:px-8">
        <p className="text-primary text-xs font-semibold uppercase tracking-[0.35em]">
          {section.replace(/-/g, " ")}
        </p>
        <h1 className="font-heading mt-3 text-4xl uppercase tracking-wide text-white md:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="text-muted-foreground mt-3 text-lg leading-relaxed">{description}</p>
        ) : null}
        {date ? (
          <p className="text-muted-foreground mt-2 text-xs uppercase tracking-[0.2em]">{date}</p>
        ) : null}

        <div className="mt-10 border-t border-white/10 pt-10">{doc.content}</div>

        <p className="text-muted-foreground mt-12 text-sm">
          <Link className="text-primary hover:underline" href="/catering">
            ← Catering
          </Link>
          {" · "}
          <Link className="text-primary hover:underline" href="/">
            Home
          </Link>
        </p>
      </div>
    </div>
  );
}
