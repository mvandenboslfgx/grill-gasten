# SEO

## Implemented

- `app/layout.tsx`: `metadataBase`, title template, description, keywords, Open Graph, Twitter card
- `app/opengraph-image.tsx`: dynamic OG (keep styles Satori-friendly: `rgb()`, no invalid shorthand in combined backgrounds)
- Per-route `metadata` on pages (title + description)
- Semantic structure: one `h1` per page where applicable; sections with headings
- `lang="nl"` on `<html>`

## Checklist when shipping

- [ ] Set **`site.url`** in `lib/site.ts` to production domain (affects canonical + OG).
- [ ] Replace placeholder contact (phone, WhatsApp, email).
- [ ] Add `robots.txt` / `sitemap.xml` if needed for indexing (Next can expose `app/robots.ts`, `app/sitemap.ts`).
- [ ] Real OG image asset optional if design team provides static 1200×630.

## Content

- Dutch copy for primary audience; keep meta descriptions under ~160 chars where possible.
- Image `alt` text descriptive (food, context), not keyword stuffed.
