# Cursor workflow — Grill Gasten

## Project rules (enforced)

See **`.cursor/rules/grill-gasten.mdc`** — always-on standards for UI, architecture, a11y, performance.

## Chat strategy

- **One architect / product thread** for direction and tradeoffs.
- **Feature branches + focused chats** per large system (e.g. ordering, CMS, loyalty) to avoid context pollution.

## High-value prompts

### Lead engineer (default mindset)

> You are the autonomous lead engineer for Grill Gasten. Maintain premium cinematic branding, reusable architecture, scalable systems, high-conversion UX, mobile-first layouts, performance, and clean code. Never generate generic UI; everything must feel custom and premium.

### Audit mode

> Audit the entire codebase. Detect duplicated logic, scalability issues, performance bottlenecks, accessibility issues, SEO weaknesses, mobile rendering issues, animation performance risks, inconsistent styling, and bad component patterns. Refactor where necessary. Maintain visual consistency.

## Docs as memory

When changing brand tokens, routes, or major UX flows, update **`project-docs/`** in the same PR when practical.

For **marketing and social**, use **`content-system/`**, **`social-hooks/`**, **`campaigns/`**, and **`prompts/`** (start at `content-system/overview.md`).

For **shippable site pages without code**, add **`.mdx`** under **`content/{events|campaigns|seasonal-drops|menu}/`** → routes **`/published/{section}/{slug}`** (see `content/README.md`).
