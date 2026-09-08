# The Industrial anchor, and its one deviation

The design system commits to a single aesthetic direction: **Industrial** — the register of a
ground-station telemetry readout. Monospace for display and body, a warm-black `#0B0C0A` ground with
a warm-neutral ramp taking its hue, flat 1px borders instead of shadows, square corners, and one
decorative signal colour: amber `#FFB800`. Recorded because the tokens in `app/globals.css` only make
sense as a set — a reader who does not know the anchor will see square corners and a neutralised
shadow scale as omissions to be fixed rather than as the direction holding.

Space is the site's subject, and the reflex for space is a violet-to-cyan mesh gradient with neon
glow. That was ruled out explicitly. This direction gets the subject from structure and restraint
instead.

## Considered options

**Swiss (International Style)** was the other serious candidate: hairline grid rules, a grotesk, one
accent — International Orange, the real high-visibility colour of launch hardware — and condensed
tabular figures as composition elements. It has the better light mode of the two and would have
suited a large component kit slightly more comfortably. Rejected in favour of the stronger
mission-readout character.

**Aurora Maximalism** and **Retro-Futuristic synthwave** are the conventional space directions.
Rejected outright: both are the gradient-and-glow cliché this project set out to avoid, and both are
dark-native to the point of having no credible light mode.

## The deviation: a proportional face for prose

Industrial specifies monospace for body text as well as display. This system breaks that in exactly
one place — **long-form prose sets in Archivo**, a proportional grotesk, reached only through the
`prose-face` utility. Archivo's `wdth` axis additionally supplies the oversized condensed section
figures via `figure-condensed`.

The trade was readability against fidelity. Monospace paragraphs read measurably slower and take
roughly 15% more horizontal space at the same size, which is a real cost on a site meant to carry
writing. The deviation is scoped so it cannot spread: Archivo is not available to buttons, labels,
inputs, table headers or badges, and the two utilities are the only sanctioned entry points.

This is the item most likely to look like drift to a future reader, which is why it is written down.
If the scope creeps — if a heading or a button label starts setting in Archivo — the anchor has
stopped holding and that is a bug, not an evolution.

### What an MDX body takes, and what it does not

A dispatch body is the first thing on this site that is unambiguously long-form prose, so it is
where the deviation earns its place — and where the scope has to be stated element by element,
because markdown produces a good deal more than paragraphs.

The **running text** takes Archivo, through `Prose` and nothing else. Everything below stays chrome:

- **Headings**, via `Heading`'s own `font-heading`, which resolves to the monospace face. A heading
  is a structural label — the same object as a section title or a table header. If one starts
  setting in Archivo, the boundary has moved from "running text" to "anything inside an article",
  which is exactly the widening this section exists to prevent.
- **Inline and fenced code**, which needs no rule at all: Tailwind's preflight sets
  `code, kbd, samp, pre` to the mono family, `globals.css` points that at `--font-mono`, and an
  author-origin rule on the element beats an inherited family. It looks like an omission in the
  element map, which is why there is a comment there saying it is not.
- **An ordered list's counter**, which does have to be asked for — `marker:font-mono`, because a
  numeral is chrome and would otherwise inherit the face the list body legitimately has.
- **Figure captions**, which are a label rather than running text.
- **Every piece of a dispatch's metadata** — the kicker, the date, the standfirst, the topics. The
  standfirst is the one that looks wrong and is not: two sentences do not accumulate the way thirty
  paragraphs do, and a typeface change two lines under the title would spend the deviation for
  nothing.

`components/news/prose-components.tsx` is the record of that boundary. The block rules live there
rather than on `Prose` because the two cannot both hold it: `Prose`'s rules are descendant selectors
and would outrank any class the map sets on the element itself, so whichever is on `Prose` silently
wins.

One consequence that is easy to miss until it looks subtly wrong on screen: asking `next/font` for a
variable axis does not get you an italic. The proportional face needs `style: ["normal", "italic"]`
requested explicitly, or emphasis in a body resolves to a _synthesised oblique_ — a sheared roman,
which at prose size is wrong in a way that is hard to name if you are not looking for it. The
monospace face never needed it, because chrome has no emphasis in it.

## Signal versus status

The anchor allows exactly one signal colour. A component kit still needs form errors and destructive
actions to be distinguishable, so the system separates two concerns:

- **Signal** — amber, the one decorative accent. Buttons, focus rings, marks.
- **Status** — red and green, **functional only**: validation errors, destructive confirms, alerts,
  toasts. Never decoration, never a background, never a gradient.

The alternative was to render every state in amber and differentiate by icon and copy alone. Rejected
on accessibility grounds: a destructive confirm and a success toast becoming indistinguishable at a
glance is a real cost, and "colour is not the only signal" is not meant to mean "there is no colour
signal."

## Consequences

Amber needs **three** tokens, not one, and this is the part that is genuinely surprising without
context. Amber as a fill is theme-stable — `#FFB800` under near-black ink measures 11.42:1 in both
themes. Amber as text on the ground is not: `#FFB800` on the light ground `#F4F5F2` is **1.57:1**, a
hard failure. The reflex of pairing a coloured fill with white text also fails, at 1.58:1.

The amber ramp also **rotates hue as it darkens**, from 80.53 at the anchor to 65 at the darkest
steps. This is not decoration: a yellow-amber darkened at constant hue reads olive-brown and stops
looking related to `#FFB800` at all, which was visible on screen before it was fixed. Radix's amber
scale rotates for the same reason.

Every `-text` token is solved against the **worst-case surface in its theme, not the page ground** —
the sunken surface in light, the raised surface in dark. This was learned the expensive way: values
solved against the ground passed on the page and then failed inside an input and on a card, where
the ground is a different colour. `--muted-foreground` in dark measured 4.67:1 on the page and
4.36:1 on a card, and muted text lives on cards constantly. Solve against the surface furthest from
the text, and every placement is covered.

So `--signal` fills, `--signal-edge` borders (3:1 is the correct threshold for a non-text boundary),
and `--signal-text` is the only one safe at prose size in both themes — with light mode dropping to a
solved value. Red and green follow the same pattern. Practically: **amber sets marks and fills; it
does not set paragraphs.** Every ratio was solved numerically rather than eyeballed, and
`stories/tokens.stories.tsx` re-checks them under axe in both themes on every `pnpm check`.

Light mode is the weaker register — the anchor is dark-native and the light theme is a translation of
it. It is the mode to review first, because it is the one that will fail first.

`--radius: 0` and a `--shadow-*` scale resolving to `0 0 #0000` mean vendored shadcn components
arrive square and flat **without being edited**. That is what makes retheming ~60 third-party
components tractable, and it is why neither should be "fixed" by reintroducing a radius or a shadow
for one component's benefit.
