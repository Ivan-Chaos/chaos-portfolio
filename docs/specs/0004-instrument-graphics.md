# 0004 — Instrument graphics

## Problem

After the signature pass (0003) the page still reads as type on type: every band is text, and the
only non-text elements are hairline decoration. The anchor has a native graphic language — the
plots, scales and schematics of a ground-station readout — and the page draws none of it. The
brief: add graphics, without importing photography, illustration, or any decoration that fabricates
data.

## Solution

Four graphics, from loudest to quietest. Every mark that _looks_ like data _is_ data — plotted from
`content/` — or is plainly a drafting mark with no data reading.

1. **The ops chart.** The track record, plotted: every role and engagement as a bar on a shared
   time axis with year gridlines. This is the one fact the text version cannot show — four
   engagements running _concurrently_ inside one role — made visible. The current role's bar is
   the only signal-coloured one and runs into an open zone at the right edge labelled with the
   stored `Present` label; nothing is derived from the clock, so the chart is exactly as static as
   the content. It complements the timeline below rather than replacing it, and is hidden from
   assistive tech because the timeline already tells the same story in full — but its labels still
   meet text contrast, because decorative is not an exemption (the footer watermark lesson).

2. **The locator.** A small schematic under the masthead index: nested hairline frames, a
   crosshair, and one signal mark at the intersection — the station's position readout. The
   coordinates it is captioned with are the real coordinates of the stated city, stored in
   `content/` like every other fact. Squares, not circles: the anchor has no round geometry.

3. **The scale strips.** Each reading in band 01 gains a ruler edge under its figure — the same
   `tick-scale` device the footer signs off with — so a stat reads as a value on an instrument
   face rather than a big numeral. Pure decoration, no data reading, no contrast threshold.

4. **The register crosses.** A small drafting cross where each band's top rule meets its ends,
   the way a technical drawing registers its sheets. They fade in with the band's reveal, riding
   the same armed state as the rule they mark.

## Amber accounting

One new spend: the ops chart's current-role bar, in `signal-edge` — an active-state mark with the
same meaning as the timeline's current marker and the masthead's current dot. Same signal, same
meaning, third telling. The locator's centre mark also uses `signal-edge`; it is the "you are here"
mark, which is the definition of a mark. Everything else in all four graphics is hairline or ink.

## Out of scope

- Photography, screenshots, logos, illustration — nothing exists in the source material to show.
- Waveforms, sparklines, radar sweeps, activity indicators: decoration that implies a measurement
  nobody took.
- Skill bars or proficiency meters in Capabilities: a percentage nobody measured is an invented
  reading.

## Testing

- All four graphics render inside existing band stories, so both themes pass under axe with no new
  story files; chart and axis labels use solved text tokens.
- The chart's geometry is pure arithmetic on `content/` ranges — covered by the type system and by
  rendering; no snapshot of pixel positions.
- `pnpm check` green (modulo the pre-existing failures recorded in 0003's session).
