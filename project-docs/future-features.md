# Future features (backlog)

Ideas to implement when product/marketing asks — **not** all at once.

## Conversion & ops

- [ ] Catering: Resend email on submit + admin CC
- [ ] Catering: Supabase table `catering_leads` + RLS (service role from server action)
- [ ] WhatsApp deep links with prefilled order line (menu SKU later)
- [ ] QR → `/m/[eventSlug]` dynamic menu for festivals

## Content ops (non-code)

- [ ] Grow `social-hooks/hooks-database.md` from real posts (what won)
- [ ] One file per campaign under `campaigns/` (copy `_template.md`)
- [ ] Reuse `prompts/caption-batch.md` + `prompts/campaign-plan.md` in Cursor with `@content-system/brand-voice-brief.md`

## CMS & site content (later code)

- MDX editorial baseline: **`/published/{section}/{slug}`** + `content/**/*.mdx` (no Supabase required for copy updates).
- [ ] Supabase-backed `events` (or Sanity/Contentlayer) + ISR/revalidate — *optional now that MDX exists for editorial*
- [ ] Replace social “mock grid” with CMS-driven or Instagram Basic Display API (rate limits / approval)

## Commerce (later)

- [ ] Stripe / Mollie checkout for deposits or merch
- [ ] Simple loyalty / stamp card (avoid until volume justifies)

## Internal

- [ ] POS integration — only if physical ops need it
- [ ] Admin dashboard — after real data model stabilizes

## Analytics

- [ ] Plausible or PostHog, key events: `cta_catering_click`, `form_submit`, `whatsapp_click`

---

**Rule:** Branding + content + social proof before accounts, loyalty, and heavy automation.
