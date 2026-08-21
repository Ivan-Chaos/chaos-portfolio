# 0005 — Field figures, and the locator withdrawn

## Problem

Two verdicts from Ivan on 0004. The locator under the masthead index did not earn its place —
withdrawn, decision reversed. And the ground behind the page still reads as poor: one faint grid,
nothing drawn on it, nothing moving. The brief: geometric shapes, and motion in the background.

## Solution

1. **The locator goes.** The panel column returns to the index alone, closed by the location line
   — which keeps the coordinates, since the fact outlived the graphic that introduced it.

2. **The page field gets major gridlines.** Every fourth cell rules at near-full hairline
   strength, minor cells stay diluted — the major/minor rule of actual plotter paper. One utility
   change, and the ground stops reading as a faint wash and starts reading as a sheet.

3. **Field figures** — hairline instruments idling in the margins the page field already owns,
   outside the content measure and only at viewports wide enough to have margins:
   - a **dial**: nested squares whose outer frame indexes round in 45° clicks,
   - a **stepper**: a marker stepping down a tick scale and wrapping,
   - a **beacon**: a register cross blinking a slow square wave,
   - a **hatch plate**: a statically hatched square, because not everything should move.

   All of it is geometry in hairline ink, all motion is stepped (`steps()`, the anchor's easing),
   slow (multi-second periods, offset so nothing syncs), and transform/opacity only. The figures
   live in the fixed field layer, so the page travels over them the way the drawing travels over
   the plotter's paper.

## Why this and not the reflexes

Floating blobs, particles, parallax and gradient meshes are the standard "make the background
richer" moves, and every one of them is the soft-edged decoration ADR 0004 rejected by name. A
ground station's idle screen does not drift — it ticks. Stepped rotation, stepped travel, square
waves: motion that reads as mechanism, not atmosphere.

## Amber accounting

None. Every figure is ink and hairline; the field stays a ground. An amber mark in the margins
would put the signal on something that means nothing, which is precisely what the signal is not
for.

## Out of scope

- Figures inside the content measure or over text at any viewport — they exist only where the
  margins do.
- Any figure that implies a reading: no needles pointing at values, no counters, no coordinates.
  The instruments are idling, not measuring.
- Pointer-reactive or scroll-reactive motion in the field. The ground does not respond; the page
  does.

## Testing

- The field is decoration: `aria-hidden`, `pointer-events-none`, no text, so no contrast surface.
  Reduced motion collapses every figure to a clean resting frame (base transform, full opacity).
- Verified visually in the running app in both themes; `pnpm check`'s gates (typecheck, lint,
  unit, stories) stay green — the field renders outside the band stories, so the check is the dev
  loop, not axe.
