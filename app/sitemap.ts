import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

const routes = [
  "",
  "/menu",
  "/bestellen",
  "/rewards",
  "/catering",
  "/contact",
  "/about",
  "/events",
  "/foodtruck",
  "/zakelijk",
  "/festival",
  "/privacy",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return routes.map((path) => ({
    url: `${site.url}${path}`,
    lastModified,
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : path === "/catering" ? 0.9 : 0.7,
  }));
}
