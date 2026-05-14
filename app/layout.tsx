import type { Metadata } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import { site } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const bebas = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ogImage = `${site.url}/opengraph-image`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Loaded. Gegrild. Legendarisch.`,
    template: `%s — ${site.name}`,
  },
  description: site.metaDescriptionHome,
  keywords: [
    "foodtruck Hoeksche Waard",
    "smashburgers Hoeksche Waard",
    "catering foodtruck Nederland",
    "festival foodtruck",
    "premium streetfood",
    "loaded fries foodtruck",
    "smash burger catering",
    "streetfood events Nederland",
    "Grill Gasten",
  ],
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — premium smashburgers & streetfood`,
    description: site.metaDescriptionHome,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${site.name} smashburger hero`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — Loaded. Gegrild. Legendarisch.`,
    description: site.metaDescriptionHome,
    images: [ogImage],
  },
  alternates: {
    canonical: site.url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className="dark">
      <body
        className={`${inter.variable} ${bebas.variable} ${geistMono.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
