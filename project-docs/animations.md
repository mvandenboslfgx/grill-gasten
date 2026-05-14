# Animations

## Principles

- **Premium, not noisy:** one hero idea per viewport; avoid competing loops.
- **Performance:** prefer `transform` and `opacity`; avoid animating `box-shadow` on large layers except controlled pulses (e.g. CTA).
- **Accessibility:** use `useReducedMotion()` from Framer Motion; skip or simplify parallax / continuous motion when reduced motion is requested.

## Building blocks

| Piece | Role |
|-------|------|
| `AnimatedContainer` | Scroll-triggered fade/slide for sections |
| `GlowButton` | Subtle scale + glow on primary actions |
| Hero | Optional pointer-based tilt on burger card (desktop) |
| `globals.css` | `@keyframes` smoke-drift, glow-pulse; utilities `animate-smoke`, `animate-glow-pulse`, `text-gradient-silver` |

## Adding new motion

1. Default to `AnimatedContainer` + short duration (0.55–0.75s), ease `[0.22, 1, 0.36, 1]`.
2. New shared variants → small module under `lib/` or co-locate in `components/` if single-use.
3. List new global keyframes here when added.
