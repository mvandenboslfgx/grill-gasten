# Roadmap — sprint framing

**Principle:** visual dominance + consistency + velocity before enterprise backend.  
**Ship > perfect.**

## Done (baseline)

- Marketing site: home, menu, events, catering, about, contact
- Brand theme, motion primitives, SEO metadata + OG image route
- Forms UI (client-only success states — no backend yet)
- `project-docs/`, `.cursor/rules/`, **content tree:** `content-system/`, `social-hooks/`, `campaigns/`, `prompts/`
- **MDX publishing:** `content/{events,campaigns,seasonal-drops,menu}/*.mdx` → live at **`/published/...`** (`next-mdx-remote` RSC)
- **Asset pipeline folders:** `public/images/*`, `public/videos/*`, `public/logos/*` (+ `public/ASSET-PIPELINE.txt`)

---

## Priority order (operational)

| Step | Focus |
|------|--------|
| **A** | Real visuals → drop into `public/images/...` and swap `next/image` srcs |
| **B** | Catering funnel + **Resend** (lead mail) |
| **C** | QR menu system (`/m/[slug]`) |
| **D** | **MDX content engine** (baseline done — grow `content/` files) |
| **E** | Analytics (Plausible / PostHog) + optional heatmaps |
| **F** | Online ordering (later) |

---

## Sprint 1 — Asset overhaul (highest ROI now)

**Goal:** craving + festival energy + social virality — replace “demo” feel.

- Food: real smash, loaded fries, macro meat, cheese pulls, smoke in frame
- Truck: night festival, matte black, neon, crowd ambiance
- Brand: SVG logo pack, favicon, icon system, merch mockups
- Motion: smoke loops, ember/glow loops, subtle background video (compress for web)

*Technical:* swap Unsplash → `/public/images/...`, tune `next/image` sizes, keep Lighthouse.

---

## Sprint 2 — Conversion layer

**Goal:** first revenue machine — **catering funnel**.

- Multi-step booking, event type, guest count, budget range
- WhatsApp handoff + **Resend** notifications
- Lead storage (Supabase when ready — not before you need exports)

---

## Sprint 3 — Festival operations

**Goal:** **QR menu** — offline → online acquisition.

- Flow: festival → QR → mobile-first menu → CTA → socials
- Route e.g. `/m/[slug]` + printable QR asset

---

## Sprint 4 — Content engine

**Goal:** socials > site as traffic driver; **ship copy without deploys**.

- **MDX:** author in `content/` → `/published/{section}/{slug}` (live).
- Templates: `campaigns/` (planning), `social-hooks/`, `prompts/`.
- Later: upload workflow, CMS, or scheduled exports — only when volume justifies.

---

## Later (avoid early)

- Accounts, loyalty, POS, full payments — after pipeline proves demand
- Upstash / heavy queues — when scale requires

## Deployment target

- **Vercel** · **Resend** · **Supabase** (when data) · **Plausible** or **PostHog**
