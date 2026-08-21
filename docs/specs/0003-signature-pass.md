# 0003 — Signature pass on the home page

## Problem

The home page is correct and coherent, but it under-spends its own character. The anchor's
signature devices — the signal, the corner ticks, the stepped mechanical motion, the instrument
register — are all present, yet each is used exactly once and quietly. A visitor who does not
scroll carefully can leave without the page having registered as _a developer's instrument panel_
rather than as a tasteful CV. The brief: more appealing, more creative, unmistakably a developer's
page — without drifting from the Industrial anchor (docs/adr/0004).

## Solution

Four small additions, each an amplification of a device the system already owns. Nothing new is
imported; no gradient, no glow, no radius, no shadow.

1. **The caret.** A blinking block caret in signal amber sits after the masthead name, at the end
   of the decode. It is the terminal's own idiom — the one mark that says "a developer works here"
   — and it blinks as a square wave (`steps(1)`), never a fade, because the anchor's motion is
   stepped. Decorative, hidden from assistive tech, and under reduced motion it holds solid
   instead of blinking.

2. **The gauge.** A 2px signal-amber line along the header's bottom edge that fills with scroll
   progress — the page reading itself out, which is what a telemetry register does. Pure CSS
   (scroll-driven animation): no scroll listener, no hydration cost. Browsers without scroll
   timelines and readers with reduced motion get no gauge, and lose only decoration.

3. **The latch, completed.** An engagement card's hover already latches — accent fill, title to
   signal. Now the corner ticks take part: they extend (the brackets reach further in, animated as
   a size change) and switch to the signal edge (instantly — a relay closes, it does not fade).
   The card reads as _registered_ while the pointer holds it.

4. **Selection in signal.** Selecting text anywhere fills in amber with ink text (11.42:1). Text
   selection is the reader's own mark, and it is the cheapest place on the page to show a
   deliberate hand.

## Amber accounting

The signal's value is scarcity, so each new spend is argued, not assumed. All three additions are
**marks** — the category CONTEXT.md already permits ("buttons, focus rings, active states,
marks") — not fills or text:

- The caret is a mark on the one name on the page. It rhymes with the current-position dot above
  it.
- The gauge is an instrument reading, 2px tall, and is the only permanent amber in the viewport
  besides the focus ring — which it matches in weight.
- The latch's tick change is an active state, visible only while the pointer holds a card.

The "one amber button" rule is untouched: there is still exactly one signal-treatment button.

## Out of scope

- Any change to the band structure, content, or copy — every fact still traces to the CV.
- Skill meters, availability claims, invented telemetry strings ("SYS ONLINE"), ASCII art:
  decoration that fabricates data is out, permanently.
- A scroll-spy active state in the header nav (needs JS and a design for the active mark; separate
  spec if wanted).

## Testing

- The story suite already renders every band under axe in both themes; all three visible additions
  are non-text decoration (`aria-hidden`), so the contrast gate keeps meaning what it meant.
- Reduced motion: caret holds solid (animation collapses to its resting frame), gauge does not
  render motion (media-query guarded), latch remains a color/size state with near-zero duration.
- `pnpm check` green.
