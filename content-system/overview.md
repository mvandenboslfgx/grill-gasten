# Content system (repo map)

AI and humans use this tree for **velocity + consistent branding** — not a runtime CMS (yet).

| Path | Purpose |
|------|--------|
| `content-system/` | Brand voice, guardrails, long-form briefs, **`social-bios.md`** (IG/TikTok copy) |
| `social-hooks/` | Reusable hook lines (extend `hooks-database.md`) |
| `campaigns/` | Time-boxed plans; copy `_template.md` per campaign |
| `prompts/` | Paste-ready Cursor / LLM prompts |
| **`content/`** | **Shippable MDX** (events, campaigns, seasonal-drops, menu) — rendered at **`/published/{section}/{slug}`** (see `content/README.md`) |

**Workflow:** `@` these files in Cursor when generating captions or campaign plans.  
**Sprint order:** see `project-docs/roadmap.md` (Sprint 1 visuals → 2 catering → 3 QR → 4 content engine).

**Canonical facts** (site copy): founders Mike & Matthijs, regio Hoeksche Waard — zie `lib/site.ts` en `project-docs/brand.md`.
