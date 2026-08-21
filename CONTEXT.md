# chaos-portfolio

Ivan's personal portfolio site. This file is the project's ubiquitous language: the words we use for
domain concepts, in code, tests, commits, specs and conversation.

## Language

### Design system

**Anchor**:
The single aesthetic direction the whole system commits to — currently Industrial, the register of a
ground-station telemetry readout. It names a fixed set of tokens, not a mood, so a rendered result
that falls outside them means the anchor did not hold.
_Avoid_: theme (that word is taken by light/dark), style, aesthetic, vibe

**Deviation**:
A rule the anchor specifies that this project deliberately breaks, recorded in an ADR with its
reason and its scope. There is exactly one — the proportional face for prose. Anything else that
falls outside the anchor is drift, which is a defect.
_Avoid_: exception, override

**Signal**:
Amber — the one colour the system spends on decoration. Buttons, focus rings, active states, marks.
_Avoid_: accent (`--accent` is the neutral hover fill and means something else), brand, primary
(`--primary` is ink), highlight

**Status**:
The functional-only hues, danger and success. Permitted in validation, destructive actions, alerts
and toasts, and nowhere else — never as decoration, a background, or a gradient.
_Avoid_: semantic colour, state colour, alert colour

**Ramp**:
A raw named colour scale with no meaning attached — `--ink-*`, `--amber-*`, `--red-*`, `--green-*`.
Ramps exist so semantic tokens have something to point at; using one directly in a component is a
defect.
_Avoid_: palette, scale, swatch set

**Semantic token**:
A named role that a component actually references — `--background`, `--signal`, `--control`. Every
one is redefined per theme, which is what makes light and dark a value change rather than a
different stylesheet.
_Avoid_: alias, variable

**Surface**:
One of the three flat planes: the ground, raised, and sunken. The anchor has no elevation model,
because it has no shadows — a surface change plus a rule is the whole vocabulary of depth.
_Avoid_: elevation, layer, level, z-plane

**Hairline**:
A decorative 1px rule — dividers, table rules, section separators. Deliberately low contrast, and
therefore not permitted on anything interactive.
_Avoid_: divider, separator, rule (`Separator` and `Divider` are component names, not this token)

**Control border**:
The border that tells a user where an interactive element is, held to 3:1. Distinct from a hairline,
and picking the wrong one of the two is an accessibility bug rather than a style preference.
_Avoid_: input border, field border, outline (that word means the focus ring)

**Corner ticks**:
The four short hairline brackets that register a surface at its corners instead of enclosing it in a
box. The system's signature treatment.
_Avoid_: crop marks, brackets, corners, reticle

**Treatment**:
One of the ways a control can be rendered — `filled`, `signal`, `outline`,
`transparent`, `underline`, `danger`. A treatment is appearance only; it never
changes what the control does or what element it renders.
_Avoid_: variant (that word means the cva prop generally), style, kind, type

**Control surface**:
The shared appearance of anything the user types into — sunken ground, 1px
`control` border, square. Exported as `controlSurface` from the Input module so
Textarea, NumberField and the date and time inputs cannot drift away from it.
_Avoid_: input style, field style

**Chrome**:
Every part of the interface that is not long-form prose — labels, buttons, inputs, headings, table
data, numerals, code. Chrome always sets in the monospace face.
_Avoid_: UI text, interface copy

**Prose**:
Long-form running text, and the only context permitted the proportional face. The distinction from
chrome is what keeps the one deviation from spreading.
_Avoid_: body text, copy, content

### Page structure

**Band**:
One numbered section of a page, carrying its own figure, title and content. The home page is eight
of them read top to bottom; the figures running 01→07 down the left edge are the structure, not
decoration.
_Avoid_: block, strip, region, panel, slice

**Masthead**:
The unnumbered opening band, above the first hairline. It carries the name, the positioning line and
the standfirst, and it is the only band with no figure.
_Avoid_: hero, banner, splash, jumbotron

**Standfirst**:
The short paragraph under the positioning line that says what the work actually is. Two sentences,
set in chrome — it is short enough that the proportional face would be spending the deviation for
nothing.
_Avoid_: intro, blurb, tagline, bio, summary

**Rail**:
The fixed left column a band's figure and title move into at wide viewports, leaving the content the
rest of the measure. What makes a stack of bands read as a datasheet rather than as a document: the
figures line up down the page edge and the eye tracks them.
_Avoid_: sidebar, gutter (that word means the container's padding), aside

**Index**:
The legend beside the masthead listing every band by figure and title. The only place the whole
page's shape is visible at once, and the mobile substitute for a header nav that cannot fit seven
links.
_Avoid_: table of contents, menu, nav (that word means the element)

**Page field**:
The fixed hairline grid behind everything — the plotted ground an instrument is drawn on, with the
column rules and register ticks that flank the measure. Decoration with no contrast threshold to
meet, because none of it is text.
_Avoid_: background, backdrop, texture, pattern

**Ops chart**:
The plotted track record — every role and engagement as a bar on one time axis, drawn from the
stored ranges and never from the clock. The one place the concurrency of the engagements is
visible. Hidden from assistive tech because the timeline below tells the same facts in full.
_Avoid_: Gantt, timeline chart (the Timeline is the accessible telling), graph

**Field figure**:
A hairline instrument idling in the page field's margins — the dial, the stepper, the beacon, the
hatch plate. Geometry only, motion stepped and slow, never text and never a reading; they exist
only at viewports wide enough to have margins. Instruments idling, not measuring.
_Avoid_: background shapes, particles, ornaments, blobs

**Register cross**:
The small drafting cross where a band's top rule meets each end, riding the same armed state as
the rule it marks. The sheet-alignment mark of a technical drawing.
_Avoid_: plus, crosshair, target

### Portfolio content

**Role**:
A paid position held at one employer, with a title, a location and a date range. Three exist. Only
one is ever current. Rendered under the public band title **Experience** — the code keeps the
domain word.
_Avoid_: job, position, gig, experience (as a domain word — it is only the band title)

**Engagement**:
A client platform delivered inside a role, with its own stack and its own date range. Distinct from
a role because several engagements ran concurrently inside one of them — collapsing the two words
would make the record read as though far more positions were held than were. Rendered under the
public band title **Projects** — the code keeps the domain word, because the role/engagement
distinction is exactly what "project" blurs.
_Avoid_: project (as a domain word — it is only the band title), work, case study, client

**Instrument**:
A featured tool of the practice, rendered as a card in the Capabilities band: the tool's mark, its
name, and a field note. Admission requires a real story — a tool nothing on the page vouches for
stays in the inventory. Never carries a proficiency; a self-assessed percentage is not a
measurement.
_Avoid_: skill card, tech card, badge

**Field note**:
The one sentence on an instrument's card saying where the tool actually earned its place, traceable
to an engagement or a role like every other claim on the page.
_Avoid_: description, blurb, usage note

**Inventory**:
The compact grouped readout of the full stack, kept under the instrument grid. It is what lets the
instruments be selective — nothing is lost by not being featured — and the part that survives a
recruiter's keyword scan.
_Avoid_: skill list, tech list, tag cloud

**Capability**:
A named skill belonging to a discipline group. The unit the Capabilities band lists; the group is
the term, the capabilities are the definition.
_Avoid_: skill, tech, tool, tag, competency

**Reading**:
A single measured claim about the work, rendered as a `Stat` — a figure, a label, and the context
that makes the figure mean something. Every reading traces to a line in a CV; there are no rounded
approximations and no invented ones.
_Avoid_: metric, KPI, proof point, achievement, highlight

**Credential**:
A completed qualification, with an institution and a date range. Both are degrees; both carry a
distinction.
_Avoid_: degree, education item, qualification

### Motion

**Reveal**:
The scroll-triggered entrance applied to a band as it enters the viewport — opacity and transform
only, once, never repeating. It is composed around a band from the outside; a band never contains
its own.
_Avoid_: scroll animation, fade-in, AOS, on-scroll, entrance

**Decode**:
The stepped character-substitution entrance that resolves noise into a final string. Spent exactly
once, on the masthead name, for the same reason the signal colour is spent sparingly.
_Avoid_: scramble, glitch, typewriter, matrix effect

**Armed**:
The state of a `Reveal` that has been claimed by JavaScript but has not yet entered the viewport,
and the only state in which content is hidden. It cannot exist in server-rendered output, which is
what guarantees the page is never blank without JavaScript.
_Avoid_: pending, idle, hidden, initial

**Caret**:
The blinking block mark after the masthead name — the terminal's idiom, set in signal amber,
blinking as a square wave rather than a fade. Spent once, like the decode it follows; under
reduced motion it holds solid.
_Avoid_: cursor (that word means the pointer), text cursor, prompt

**Gauge**:
The 2px signal line along the header's bottom rule that fills with scroll progress — the page
reading itself out. Scroll-driven CSS with no script; it stays at zero under reduced motion and in
browsers without scroll timelines.
_Avoid_: progress bar, scroll indicator, reading bar

**Latch**:
The held hover state of an engagement card: accent fill, title to signal text, corner ticks
extended to the signal edge. It closes like a relay — colours jump, only the tick length animates
— and holds only while the pointer does.
_Avoid_: hover effect, highlight, active state

### Conventions

Add a term the moment it is decided, not in a later batch. The format:

```md
**Term**:
One or two sentences. Define what it IS, not what it does.
_Avoid_: rejected synonym, another rejected synonym
```

Rules that matter here:

- **Be opinionated.** When several words mean the same thing, pick one and list the rest under
  `_Avoid_`.
- **Project-specific concepts only.** General programming vocabulary does not belong, however much
  the project uses it. Before adding a term, ask whether it is unique to this project or just
  programming.
- Group under subheadings once natural clusters appear; a flat list is fine until then.
