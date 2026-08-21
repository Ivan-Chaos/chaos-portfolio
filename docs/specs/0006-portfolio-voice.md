# 0006 — Portfolio voice: the developer first, the employers second

## Problem

Ivan's verdict: the page reads as a resume — a guy who worked there and there — when it should
read as a portfolio of a developer. The employment framing leaks everywhere: the standfirst leads
with the current employer, the band titles ("Engagements", "Track record") are CV vocabulary, and
the skills are a bare keyword list, which is the most resume-shaped element a page can carry.

## Solution

Reframe, not refabricate. Every fact keeps tracing to the CVs; what changes is whose story the
sentence tells.

1. **The standfirst tells the developer's story.** Employer names leave the masthead prose — the
   kicker already names the current position, and that is enough. What replaces them is the work:
   architecture, rendering strategy, design systems, and the numbers they were held to.

2. **Employment talk moves where it belongs.** The bands the public sees are retitled **Projects**
   (03) and **Experience** (04): the platforms as built things first, the positions as the context
   they were delivered inside, second. Band ids, anchors and the domain words — engagement, role —
   do not change; the glossary distinction between a project and a position is the reason the page
   can make this move without the record blurring.

3. **Instruments replace the bare list.** The core of the stack becomes a grid of cards — the
   tool's mark, its name, and a **field note**: one sentence saying where it actually earned its
   place, each traceable to an engagement or a role. Marks render in ink, never brand colours —
   the anchor has one signal and it is not React blue. An instrument without a real story does not
   get a card; it stays in the **inventory**, the compact grouped readout kept below the grid,
   which is also what keeps the page scannable for keywords.

4. **The ops chart follows the retitle** — its group kickers say Experience and Projects, so the
   drawn version and the written version of the record use the same words.

## What deliberately does not change

- **Readout hints keep naming employers.** A figure with no provenance is a claim; "at YachtWay"
  in 11px under a number is evidence, not a resume voice.
- **Education stays.** Two degrees earned while working full-time is a fact about the developer.
- **No invented projects, testimonials, or availability claims.** The portfolio voice comes from
  arrangement and emphasis, not new material.

## Testing

- Existing assertions read titles from `BANDS` and content from `content/`, so the retitle
  propagates; the capability inventory keeps the term/definition counts the stories pin.
- New assertions: every instrument renders as a level-3 heading with its field note, in the story
  and in the page test.
- `pnpm check` gates stay green (modulo the pre-existing failures recorded in 0003's session).
