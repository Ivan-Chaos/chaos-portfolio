# Design system and component toolkit

## Problem

The site has no design. Every colour token is stock shadcn neutral with no identity, there is no
type scale, no spacing or motion vocabulary, and the dark theme is inert — the variant is wired up
but nothing ever applies the class that activates it, so every dark style in the tree is dead code.
The landing page is still framework boilerplate.

Nothing else can be built until this is settled. Every page and feature will consume these tokens, so
choosing them later means rebuilding whatever was made in the meantime.

## Solution

A single design system with a stated direction — **Industrial**, the register of a ground-station
telemetry readout — expressed as a two-layer token set, and a component toolkit built on it. The
system supports light and dark, is responsive at four breakpoints, and is documented in a Storybook
that doubles as the review surface.

Deliberately _not_ the conventional treatment of the subject: no gradient grounds, no neon glow. The
direction comes from structure and restraint.

### Colour

Two layers. **Ramps** are named scales with no meaning attached. **Semantic tokens** point at them and
are redefined per theme. Only semantic tokens are used when building; reaching past them into a ramp
is a defect.

One decorative **signal** — amber. **Status** colours (danger, success) exist but are functional only:
validation, destructive actions, alerts, toasts. They are never decoration.

The constraint that shapes the whole palette: a hue behaves differently as a fill than as text. Amber
under near-black ink is legible in both themes; the same amber as text on the light ground is not,
by a wide margin. So each hue is split into a fill, an edge, and a text token, and the light theme
substitutes solved values.

### Themes

The site follows the operating system preference by default, and offers an explicit three-way choice
— light, system, dark. Three rather than two: with a system default, a binary toggle gives no way back
to following the OS once touched.

Switching must not flash, must not shift layout, and must survive a reload.

### Components

Roughly sixty, delivered in three stages. Stage one is the foundation — tokens, theming, and the
Storybook. Stage two is the requested set: buttons in four treatments each supporting icons, cards,
the full input family including numeric-with-increments and date/time, typography, links, layout
primitives, tabs, dialogs, tooltips, accordions, toggles, skeleton loaders, toasts and icons. Stage
three fills the gaps that set leaves — selection controls, field anatomy, overlays, data display,
navigation — without which a contact form cannot be built.

Every component is documented with all its variants and states, in both themes, and checked at each
breakpoint.

## Decisions

**One direction, held.** Mixing directions is not available. A component that reaches for a rounded
corner or a drop shadow has left the system, not extended it.

**Prose is the one exception.** The direction calls for monospace throughout. Long-form prose is
allowed a proportional face, because monospace paragraphs read slower and run wider, and this site is
meant to carry writing. The exception is scoped to prose and to oversized section figures, and to
nothing else.

**Accessibility is a gate, not a review step.** Every colour pairing is solved numerically against its
real threshold — 4.5:1 for text, 3:1 for anything that only needs to be distinguishable — and checked
automatically in both themes on every run. A contrast regression fails the build.

**Decorative and structural rules are different tokens.** A divider may be faint. The border that
tells a user where an input is may not. These are separate tokens and choosing the wrong one is a
correctness bug.

## User stories

- As a visitor, the site opens in whatever theme my system already uses.
- As a visitor, I can override that, and my choice persists.
- As a visitor using a keyboard, I can always see what is focused.
- As a visitor who has asked for reduced motion, nothing animates.
- As a visitor on a phone, every component is usable without horizontal scrolling.
- As the developer, I can see any component in both themes side by side without switching context.
- As the developer, a change that breaks colour contrast fails before I ship it.

## Out of scope

- Actual portfolio content — the writing, the projects, the biography. The foundation deliberately
  does not invent it.
- Charts and data visualisation.
- An application shell (sidebar, multi-level navigation). This is a portfolio.
- Visual regression snapshots against a hosted baseline.
- Internationalisation and right-to-left layout.

## Test plan

Automated, on every run:

- Every semantic colour pairing renders as real text on its real ground and is checked by an
  accessibility engine in **both** themes. Swatches alone would not catch this; the check needs text
  on a background.
- Interaction tests assert the parts that regress silently — accessible names on icon-only controls,
  grouping, and state attributes.
- Type checking and linting.

Manual, at each stage checkpoint:

- Light theme reviewed first. The direction is dark-native, so light is where it will fail.
- Every component at all four breakpoints.
- Theme switching with no flash, no layout shift, and no console noise.
