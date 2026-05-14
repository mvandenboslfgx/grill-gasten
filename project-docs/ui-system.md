# UI system

## Stack

- Next.js 15 App Router, TypeScript, Tailwind v4
- shadcn/ui (Radix) — `components/ui/*`
- Framer Motion — motion in client components
- Lucide icons

## Patterns

- **Layout:** `SiteShell` → `Navbar` + `main` + `Footer`
- **Sections:** Prefer dedicated section components (`hero-section`, `featured-food-section`, …) over one mega page file.
- **Motion:** `AnimatedContainer` for scroll reveals; `useReducedMotion()` for heavy effects.
- **CTAs:** `GlowButton` (`components/button.tsx`) for brand CTAs; shadcn `Button` for dense UI.

## Tokens

Brand tokens are CSS variables (`:root` / `.dark` in `globals.css`). Prefer `bg-background`, `text-primary`, `border-border`, etc., over raw hex in components unless intentional (e.g. one-off gradients).

## Anti-patterns

- Duplicated card/layout strings across pages → extract data to `lib/data/*` or small feature modules.
- Inline one-off animations on every element → shared variants in one place when patterns repeat.
