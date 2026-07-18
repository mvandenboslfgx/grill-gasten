import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const routes = [
  "",
  "/menu",
  "/bestellen",
  "/catering",
  "/about",
  "/contact",
  "/privacy",
  "/voorwaarden",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((path) => ({
    url: `${site.url}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/bestellen" || path === "/menu" ? 0.9 : 0.7,
  }));
}
