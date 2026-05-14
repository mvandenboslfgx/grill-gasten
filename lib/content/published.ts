import fs from "node:fs";
import path from "node:path";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";
import { mdxComponents } from "@/components/mdx-elements";

export const CONTENT_SECTIONS = ["events", "campaigns", "seasonal-drops", "menu"] as const;
export type ContentSection = (typeof CONTENT_SECTIONS)[number];

export function isContentSection(value: string): value is ContentSection {
  return (CONTENT_SECTIONS as readonly string[]).includes(value);
}

export function getPublishedStaticParams(): { section: string; slug: string }[] {
  const out: { section: string; slug: string }[] = [];
  for (const section of CONTENT_SECTIONS) {
    const dir = path.join(process.cwd(), "content", section);
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (!name.endsWith(".mdx")) continue;
      out.push({ section, slug: name.slice(0, -4) });
    }
  }
  return out;
}

export type PublishedDoc = {
  content: ReactNode;
  frontmatter: Record<string, unknown>;
};

export async function loadPublished(
  section: ContentSection,
  slug: string,
): Promise<PublishedDoc | null> {
  const safe = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  if (!safe.test(slug)) return null;

  const filePath = path.join(process.cwd(), "content", section, `${slug}.mdx`);
  if (!fs.existsSync(filePath)) return null;

  const source = fs.readFileSync(filePath, "utf8");
  const { content, frontmatter } = await compileMDX({
    source,
    options: { parseFrontmatter: true },
    components: mdxComponents,
  });

  return { content, frontmatter: frontmatter as Record<string, unknown> };
}

export function pickMeta(frontmatter: Record<string, unknown>, fallback: string) {
  const title = typeof frontmatter.title === "string" ? frontmatter.title : fallback;
  const description =
    typeof frontmatter.description === "string" ? frontmatter.description : undefined;
  return { title, description };
}
