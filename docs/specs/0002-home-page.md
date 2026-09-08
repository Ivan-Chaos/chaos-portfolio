# Home page

## Problem

The site has a finished design system and no site. `/` currently renders a design-system index — a
tour of the components with placeholder copy — and says so in its own source: the portfolio content
is not there because it had not been written, and inventing it would have produced a page that
looked finished and said nothing true.

Both halves of that blocker are gone. The content exists, in three CVs. The system that would
consume it is complete: a two-layer token set, roughly sixty rethemed components, and a Storybook
that checks contrast in both themes on every run. Spec 0001 listed portfolio content as explicitly
out of scope, so this is the work that closes it.

What is missing is the thing the whole system was built to carry. Anyone who follows a link to this
domain today lands on a component gallery.

## Solution

A single-scroll home page: a masthead, then eight numbered bands, read top to bottom. No navigation
tree, no case-study pages.

> **Amended by spec 0007.** This was seven bands and "no second route" when written. News is now
> band 07, Contact renumbered to 08, and `/news` and `/news/<slug>` exist. The rest of this spec
> stands.

The organising idea is that a career reads well as a **telemetry readout** — which is the register
the anchor already commits to. Measured claims first, then what the practice actually is, then the
platforms, then the positions that contained them, then capabilities, credentials, and a way to make
contact. Every figure on the page traces to a line in a CV.

### The bands

| #   | Band         | Carries                                                           |
| --- | ------------ | ----------------------------------------------------------------- |
| —   | Masthead     | Name, positioning, standfirst, the current position, four actions |
| 01  | Readout      | Four readings — the measured claims                               |
| 02  | Practice     | What the work is, and the facts that qualify it                   |
| 03  | Engagements  | Four client platforms, with stacks and windows                    |
| 04  | Track record | Three roles, reverse-chronological                                |
| 05  | Capabilities | The stack, grouped by discipline, plus spoken languages           |
| 06  | Education    | Two credentials                                                   |
| 07  | News         | The three latest dispatches, and the way to all of them           |
| 08  | Contact      | Email, LinkedIn, GitHub, location                                 |

Engagements comes before Track record deliberately. The platforms are the substance and the roles
are the context for them; several engagements ran concurrently inside a single role, so leading with
chronology would gain nothing and imply a sequence that did not happen.

### The page is a panel, not a document

Three things carry that, and without them the same content reads as a CV that happens to be on the
web:

- **A page field.** A fixed hairline grid behind everything, with column rules flanking the measure
  and register ticks stepping down them. It is the plotted ground the rest is drawn on. None of it
  is text, so none of it has a contrast threshold to meet.
- **A rail.** From wide viewports each band's figure and title move into a fixed left column. The
  figures then line up down the page edge as a single sequence, and the content gets the width a
  stacked header would have taken.
- **An index.** A legend beside the masthead listing all eight bands. It fills the half of a wide
  hero that would otherwise be empty, and it is the only place the page's whole shape is visible at
  once.

### Where the theme control lives

In the footer, once, and nowhere else. A preference switch is not a primary action and does not earn
a permanent seat in a sticky bar that is a tenth of a phone's viewport. The footer also carries a
colophon and the full band list, so the page ends rather than stopping.

### Motion

Restrained, and mechanical rather than organic — the anchor's word for a state change is a relay
closing. Three effects and no more:

- Each band below the fold fades and rises very slightly as it enters the viewport, once.
- Its rule draws itself in from the leading edge as it does, and its figure clicks into place in
  three discrete steps rather than sliding.
- Inside a band, a grid of cards or figures steps its items in one after another, capped at four
  steps so a long list never becomes a queue.
- The name resolves from noise into itself, once, on load.
- The four readings count to their values, once.

Everything except the name and the readings is CSS, and therefore covered by the existing global
reduced-motion guard. The two that are not — both rewrite text from script — carry their own.

The masthead itself never fades. It is the largest element above the fold, and hiding it to fade it
in would make the page measurably slower to render its main content.

### Positioning, stated honestly

The name is followed by **Frontend Lead / Architect**, which describes the practice — directing
architecture and delivery across ten-plus applications. The current title at the current employer is
Front-end Engineer, and Track record shows the real title for every role. The positioning line is
therefore a description of what the work is, not a claim about a current job title, and the page
never has to be quietly walked back in an interview.

No availability is claimed, because no source states one.

## Decisions

**One page, and cards that do not link.** A card that looks clickable and is not is a worse outcome
than a card that plainly is not. Engagement cards are content, not navigation, until case-study
pages exist to receive them.

**Content lives as typed data, separate from the components that render it.** Every fact appears in
exactly one place, so a correction is one edit, and the data is testable independently of any
markup. Nothing on the page is a string typed into a component.

**No date is ever computed from the current time.** Ranges carry their display string as data.
Deriving "7 years" or "Present" from the clock makes static output drift, and can render differently
on the server and the client for no benefit.

**Reduced motion means no motion, and content is never hidden behind JavaScript.** The hidden state
of a reveal is applied by JavaScript and therefore cannot exist in what the server sends. With
scripting off, with a failed hydration, or to a crawler, every band is visible. This is the single
most important behavioural guarantee on the page.

**Spec 0001 promises more than WCAG requires, and the stricter promise is kept.** WCAG 2.3.3 carves
out changes of opacity that do not alter perceived size, shape or position — so a fade is arguably
permitted under reduced motion. Spec 0001 says nothing animates. Nothing animates. Loosening that is
a spec amendment, not an implementation detail.

**One signal per view is already the rule, and the page has room for a handful of amber marks and no
more.** They are spent on the current-position dot, the primary masthead action, the current role in
Track record, and the scroll gauge along the header's rule. The contact call to action is outlined,
not amber — by the time a reader reaches the last band the signal has done its work. Spec 0007
declines a fifth for the same reason: marking the current route in amber would leave it permanently
lit on two of three pages.

**No contact form.** Every comparable site uses a mail link. A form needs a backend, a spam story
and a success state to be worse than `mailto:`.

**One measurement is disputed and the conservative figure is used.** Two CVs give different customer
counts for the same platform. The lower is on the page. Changing it is one edit.

## User stories

- As a recruiter with thirty seconds, I can read the name, the positioning and four measured claims
  without scrolling on a desktop, and after one scroll on a phone.
- As a hiring manager, I can see which platforms were built, what each was built with, and when —
  and separately, which positions contained them.
- As a keyboard user, the first thing I reach is a link that skips the navigation, and I can see
  what is focused at every step.
- As a screen reader user, every band is a landmark with a name, the name in the masthead is read as
  written and never as partially-resolved noise, and no figure is announced repeatedly while it
  animates.
- As a visitor who has asked for reduced motion, nothing animates and nothing is missing.
- As a visitor with scripting disabled, the entire page is present and readable.
- As a visitor on a 390px phone, nothing scrolls sideways and every target is comfortably tappable.
- As a visitor in either theme, every pairing on the page meets its contrast threshold.
- As the author, correcting a date, a figure or a stack entry is one edit in one file.

## Out of scope

- ~~Case-study pages, and any route other than `/`.~~ Case-study pages are still out; routes are
  superseded by spec 0007.
- Side projects and open-source work. Client work only, by decision.
- ~~A blog, writing, or an RSS feed.~~ Superseded by spec 0007 — the blog exists; a feed is still
  out.
- A contact form, analytics, or any backend.
- A downloadable CV. The three source documents are tailored per-application and are not a single
  artefact to publish.
- Open Graph imagery beyond static metadata.
- Visual regression snapshots, which spec 0001 also excludes.

## Test plan

Automated, on every run:

- Every band renders as a story in **both** themes and is checked by an accessibility engine at
  error level. The page itself is not story-tested, so without a story per band the page's contrast
  would be unverified.
- Interaction tests assert what regresses silently: exactly one top-level heading, and its
  accessible name is the full name rather than a half-resolved string; each reading exposes a term
  and a definition; exactly one role is marked current; external links carry their relationship
  attributes and an indication that they open elsewhere; the mail action is a link, not a button.
- The rendered output of the whole page is asserted to contain **no hidden element**, which is the
  automated form of the never-blank-without-JavaScript guarantee.
- The content data is checked independently of any rendering: identifiers unique, every date range
  parses and does not run backwards, roles ordered newest-first with exactly one current, contact
  details well-formed.
- Each motion primitive is asserted to render its final state and start nothing when reduced motion
  is requested.

Manual, before it ships:

- Light theme first. The anchor is dark-native, so light is where it fails.
- All four breakpoints in both themes, with no horizontal scroll at any of them.
- Scripting disabled: every band still present.
- Reduced motion emulated: nothing moves, nothing missing.
- Tab from the top through to the footer: skip link first, visible focus throughout, no trap, and
  anchors that land below the sticky header rather than under it.
