# Home page for chaos-portfolio

## Context

`app/page.tsx` is currently a design-system index, not a portfolio. Its own docstring says why:

> The actual portfolio content is still not here, because it has not been written. Inventing a bio
> and a project list would produce a page that looks finished and says nothing true.

Both halves of that blocker are now gone. The content exists — Ivan's CVs in `D:\work\resumes` give
seven years of real roles, projects and measured outcomes. And the system it consumes is finished:
~60 rethemed components, a two-layer token set, and a Storybook that runs axe in both themes at
`error` level on every `pnpm check`. `docs/specs/0001-design-system.md` listed portfolio content as
explicitly out of scope, so this is new work and, per `AGENTS.md`, gets its own spec first.

Outcome: a single-scroll home page that reads as a ground-station telemetry readout of a career —
which is what the Industrial anchor was chosen for — responsive at all four checked widths, animated
with restraint that fits "mechanical, not springy", passing `pnpm check` in light and dark.

## Decisions taken with the user

| Question      | Answer                                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Positioning   | **Frontend Lead / architect** — directing architecture and delivery, not just hands-on                                                           |
| Links         | LinkedIn, email, GitHub (`https://github.com/Ivan-Chaos` — verified live), location + availability                                               |
| Work items    | Named cards, **no outbound links**. No `/work/[slug]` routes in this build.                                                                      |
| Scope         | Single-scroll home page. `app/page.tsx` is the only route touched.                                                                               |
| Motion level  | **Instrument-panel restraint** — scroll reveal, stepped stagger, hairline draw-in, count-up stats, one hero decode. No ticker, no ambient clock. |
| Side projects | No. Client work only; the pinned GitHub repos stay off the page.                                                                                 |

## Content source of truth

From `Ivan_Chaus_Software_Engineer_frontend.pdf` and `..._fullstack.pdf`, cross-checked against
`CV_Ivan_Chaus.pdf`. Nothing below is invented.

**Identity.** Ivan Chaus · Pardubice, Czech Republic · ivan13oct@gmail.com ·
linkedin.com/in/ivan-chaus · github.com/Ivan-Chaos. Master's and Bachelor's in Software Engineering,
Lviv Polytechnic National University, both with Honors, both completed while working full-time.
English C1, Ukrainian native.

**Roles.**

- **YachtWay** — Miami, USA (remote) — Front-end Engineer — Dec 2024 → present. Performance overhaul
  cutting page latency 50% and lifting Core Web Vitals to passing across the marketplace, via SSR
  optimisation and image pipeline tuning. Reusable component libraries standardising the design
  system. Frontend architecture for multiple sub-services. Introduced Claude Code and automated
  code-consistency checks to a distributed team.
- **Beleven** — Lviv, Ukraine — Front-end Lead — May 2021 → Dec 2024. Directed architecture and
  delivery for 10+ applications built from scratch. Standardised responsive UI across Tailwind, MUI,
  Chakra and SASS. Led legacy React refactors. Security-sensitive builds: HIPAA telehealth, WebRTC,
  BankID, dynamic 2FA, digital signatures.
- **Beleven** — Full Stack Engineer — Jul 2019 → May 2021. React, Express, Django, Firebase
  realtime. Redux and custom design tokens for high-traffic apps. Web3 contract interaction layers.

**Projects** — concurrent agency engagements; end dates reflect departure from Beleven.

| Project       | Domain                | Stack                                       | Window            |
| ------------- | --------------------- | ------------------------------------------- | ----------------- |
| Lamina Clinic | Telehealth            | React, TS, WebRTC, BankID, HIPAA            | Nov 2022–Dec 2024 |
| PEAKDEFI      | Crypto launchpad      | TS, React, Web3.js                          | Jun 2020–Dec 2024 |
| Influencers   | Real-time analytics   | TS, React, React Query, Chakra UI, Keycloak | Aug 2022–Dec 2024 |
| Candylink VPN | Subscription platform | Angular, TS, Django, REST                   | Jul 2024–Dec 2024 |

> **Unresolved conflict, flagged not silently picked:** the frontend CV says Candylink served
> **50,000+** active customers, the fullstack CV says **100,000+**. The build uses **50,000+**, the
> conservative figure. Say the word and it changes in one place (`content/readings.ts`).

**Stack.** TypeScript, JavaScript, Python, C++, C# · React, Next.js, Angular · Redux, RTK, Zustand,
TanStack Query, SWR, Axios · Node.js, Express, Django, REST, Firebase · Git, Docker, AWS, Linux,
Storybook, Jest, Figma, Web3.js, WebRTC, Keycloak, OAuth2 · Claude Code, Cursor, Copilot, MCP
servers, spec-driven development · Tailwind, SASS, MUI, Chakra UI, Styled Components.

## Reuse — verified by reading the files

Rebuilding any of this would be a defect, and `code-quality-reviewer` will be asked to check exactly
that.

| Need           | Use                                                                                                                                             |
| -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Page frame     | `Container` (`prose`/`default`/`wide`/`full`) — `components/ui/layout.tsx`                                                                      |
| Numbered band  | `Section` (`id`, `index`, `title`, `description`) — renders `border-t border-hairline py-10` + oversized `SectionFigure`, and `aria-labelledby` |
| Career metrics | `Stat` + `StatGroup` — `components/ui/stat.tsx`. Corner-ticks card, hairline-gutter grid, already `sm:2 lg:4`                                   |
| Role history   | `Timeline*` — `components/ui/timeline.tsx`. `TimelineItem current` flips the marker to the signal                                               |
| Project cards  | `Card` — corner-ticks by default; `bordered` for a hairline box                                                                                 |
| Type           | `Heading`, `Text`, `Prose`, `Kicker`, `Numeral` — `components/ui/typography.tsx`                                                                |
| Stack chips    | `Badge` (`outline` / `ghost`) — `components/ui/badge.tsx`                                                                                       |
| Links          | `Link` — auto-detects external, adds `rel="noopener noreferrer"` + sr-only "(opens in a new tab)"                                               |
| Icons          | `Icon as={…} label?=…` — bakes `strokeWidth={1.75}`, forces the a11y decision                                                                   |
| Theme control  | `ThemeToggle` — three-way light/system/dark                                                                                                     |
| Utilities      | `corner-ticks`, `label-caps`, `prose-face`, `figure-condensed`, `no-scrollbar`                                                                  |

`components/ui/skip-link.tsx` **exists and is unused**, and no `<main>` in the app carries
`id="main"`. Wiring both up is part of this work — a clean win the current page never took.

## Non-negotiable constraints

From `docs/adr/0004-industrial-anchor.md`, `app/globals.css` and `stories/05-motion.mdx`:

1. Monospace everywhere. Archivo reaches the page only through `prose-face` (long-form prose) and
   `figure-condensed` (section numerals). A heading or button label in Archivo is a bug.
2. `--radius: 0`; every `--shadow-*` is transparent. Separation is a 1px rule on a solid surface.
3. `border-hairline` is decorative and below 3:1 — **never** on anything interactive.
   `border-control` is the interactive boundary, solved to 3:1.
4. `bg-signal` pairs with `text-signal-foreground` (dark ink), never white. `text-signal-text` is the
   only amber safe as text in both themes. **One `signal` button per view** — it goes on the contact
   CTA and nowhere else.
5. `--danger` / `--success` are functional only. Not decoration.
6. Never reference `--ink-*` / `--amber-*` from a component.
7. Motion tokens only: `duration-instant|fast|base|slow` (60/110/180/280ms), `ease-snap`
   (`steps(3, end)`), `ease-mech-out`, `ease-mech-in`. No springs.
8. Focus is global (`:focus-visible { outline: 2px solid var(--ring) }`). Never add a per-component
   ring.

## Section architecture

One `Container width="default"` for the whole page — a single consistent gutter is most of what
"perfectly responsive" means here. A masthead above the first hairline, then seven numbered bands.
The oversized `SectionFigure` running 01→07 down the left edge _is_ the mission-control device, and
it comes free from `Section index`.

**Site header** — `sm:sticky sm:top-0 z-40` (the layout doc reserves explicit `z-*` for exactly this;
Base UI portals its own overlays above). Fixed `h-14`, solid `bg-background border-b border-hairline`
— **no `backdrop-blur`**, a soft edge is off-anchor. Brand plus `ThemeToggle` at all widths; three
anchor links appear from `sm`. No hamburger: three links on a numbered scroll page do not justify a
`Sheet`.

**Masthead** — unnumbered, no `Section`.

1. Status line — a `size-1.5 bg-signal` mark (rhyming with `TimelineMarker`'s `current` treatment)
   plus `label-caps`: `CURRENT — YACHTWAY, MIAMI (REMOTE) · PARDUBICE, CZ`.
2. `<h1>` **Ivan Chaus** — `Heading level={1} size="3xl"` with `sm:text-6xl lg:text-7xl`.
3. Role line — `Frontend Lead / Architect`, `Text size="lg"` with `sm:text-xl lg:text-2xl`.
4. Standfirst — two sentences, `Text size="lg" tone="muted" max-w-[56ch]`. **Mono, not `Prose`.**
   Forty words is not long-form; `prose-face` here would be the first step in widening the deviation.
5. Actions — `Link` + `buttonVariants({ variant: "signal", size: "lg" })` to `#engagements`;
   `outline` to `mailto:`; `Link variant="quiet"` to LinkedIn and GitHub, which get the external
   arrow and "(opens in a new tab)" automatically.

| #   | `id`           | Title            | Content                                  | Built from                           |
| --- | -------------- | ---------------- | ---------------------------------------- | ------------------------------------ |
| 01  | `readout`      | **Readout**      | The four measured claims                 | `StatGroup` + 4× `Stat`              |
| 02  | `practice`     | **Practice**     | What a Frontend Lead does here           | `Prose` + hairline `<dl>`            |
| 03  | `engagements`  | **Engagements**  | The four client platforms                | hairline grid + `EngagementCard`     |
| 04  | `track-record` | **Track record** | Three roles, reverse-chronological       | `Timeline*`, YachtWay `current`      |
| 05  | `capabilities` | **Capabilities** | Grouped stack + spoken languages         | hairline `<dl>` rows                 |
| 06  | `education`    | **Education**    | Two Honors degrees, earned while working | `Kicker`, `Heading`, `Text`, `Badge` |
| 07  | `contact`      | **Contact**      | Email, LinkedIn, GitHub, location        | hairline `<dl>` + `buttonVariants`   |

Engagements sits _before_ Track record deliberately: the platforms are the substance, and the three
roles then contextualise them. The Beleven engagements are concurrent with the Beleven role anyway,
so leading with chronology gains nothing.

**Resolving the positioning tension honestly.** The chosen h1 framing is "Frontend Lead / Architect",
but the current title at YachtWay is Front-end Engineer. Track record shows the real titles for every
role, which makes the h1 a description of practice rather than a claim about a current title. The
status line says only what is true — it names the current position, and asserts no availability that
no CV states. Swap in an availability claim if you want one; I won't invent it.

**Display type — use `text-6xl`/`text-7xl`, keep `Heading`, no bespoke element, no clamp.** The
tokens were provisioned for exactly this and are otherwise dead, and `--text-7xl` carries tuned
display metrics (`0.95` leading, `-0.04em` tracking) that only make sense on a hero. `Heading` merges
through `cn()`, so `sm:text-6xl lg:text-7xl` composes with the cva base and each step keeps its
paired line-height and tracking. A bespoke element would re-derive `font-heading`, `text-balance`
and `text-foreground` by hand — duplication, not expression. The hero stays entirely in **chrome**
register: no `prose-face`, no `figure-condensed`.

## New code

```
content/schema.ts                        types only
content/profile.ts                       identity, standfirst, current position
content/readings.ts                      the four Stat entries
content/engagements.ts                   four Engagements
content/roles.ts                         three Roles
content/capabilities.ts                  grouped stack + languages
content/education.ts                     two Credentials
content/profile.test.ts                  data invariants (unit project)

components/motion/reveal.tsx             "use client"  scroll-entry, arms a CSS animation
components/motion/decode.tsx             "use client"  stepped character substitution
components/motion/count-up.tsx           "use client"  animated figure, width-pinned
components/motion/*.stories.tsx
components/motion/*.test.tsx
components/icons/                        only if the Tabler brand marks don't sit right

components/home/site-header.tsx          server
components/home/masthead-band.tsx        server
components/home/readout-band.tsx         server
components/home/practice-band.tsx        server
components/home/engagements-band.tsx     server
components/home/engagement-card.tsx      server
components/home/track-record-band.tsx    server
components/home/capabilities-band.tsx    server
components/home/education-band.tsx       server
components/home/contact-band.tsx         server
components/home/readout-row.tsx          server — shared hairline <dl> row (02, 05, 07)
components/home/site-footer.tsx          server
components/home/*.stories.tsx            one per band

app/page.tsx                             rewritten — synchronous, composition only
app/layout.tsx                           SkipLink; <main id="main" tabIndex={-1}>; real metadata
.storybook/preview.tsx                   add "Home" to storySort.order
stories/05-motion.mdx                    document the duration-* trap
```

`content/` at the repo root, not `lib/`: `lib/` means "helpers that do something" (`utils.ts`), and
this is data. `@/*` resolves to root so `@/content/engagements` works, `tsconfig` typechecks it, and
`.storybook/main.ts` doesn't glob it. No barrel file.

Types (`content/schema.ts`):

```ts
type Range = { display: string; start: string; end: string | null }; // ISO "YYYY-MM"; null = present
type Reading = { id; label; value: string; unit?; hint? }; // maps 1:1 onto Stat props
type Role = {
  id;
  title;
  organisation;
  location;
  range: Range;
  highlights: string[];
  stack: string[];
  current?: boolean;
};
type Engagement = {
  slug;
  name;
  category;
  range: Range;
  summary;
  highlights: string[];
  stack: string[];
};
type Capability = { id; label; items: string[] };
type Credential = {
  id;
  qualification;
  institution;
  range: Range;
  distinction?: string;
};
```

`Range.display` is a literal string ("Dec 2024 — Present"); `start`/`end` feed `<time dateTime>`.
**Never derive durations or "Present" from `new Date()`** — it makes static output time-dependent and
can desync server from client. The `7` in "7 years" is a literal with a comment saying to bump it.

**Every `components/home/*` file is a synchronous server component**, and `app/page.tsx` is a
non-async server component. That is deliberate: `AGENTS.md` forbids unit-testing _async_ server
components, so staying synchronous is what makes the whole page testable with RTL.

**`Reveal` wraps bands in `app/page.tsx`, and is never baked into a band.** Two reasons: bands stay
pure server components, and band stories then render with no animation at all — which matters more
than it sounds (see Risks).

## Dependencies to add

### One, not two — and this reverses an earlier recommendation

- **`@tabler/icons-react@^3.46.0`** (runtime dep), for exactly three brand marks — GitHub, LinkedIn,
  X. Verified on npm: `sideEffects: false`, peer `react >= 16`, and Next 16.3.0 already lists it in
  the **default** `optimizePackageImports` set, so its barrel export is optimised without config.
  Lucide stays the icon library for everything else, through the existing `Icon` wrapper.

  Needed because `node_modules/lucide-react/dist/esm/icons/` shows **`lucide-react@1.31` ships no
  `Github` or `Linkedin` glyph** — the only `x.*` file is the close icon, not the brand.

  **Why Tabler and not `@icons-pack/react-simple-icons`**, which was my first choice:

  1. **Style.** Simple Icons are solid-fill 24×24 glyphs; Lucide is 24×24 stroke-outline, and this
     kit pins `strokeWidth={1.75}` specifically so icons sit level with JetBrains Mono's stems
     (`stories/06-icons.mdx`). A solid-fill brand mark beside stroke-outline UI icons looks wrong,
     and that is exactly the kind of inconsistency the anchor exists to prevent. Tabler is
     stroke-outline on the same 24×24 grid and takes a `stroke` prop, so it can be set to 1.75.
  2. **Durability.** simple-icons **removed LinkedIn in v14.0.0 and will not re-add it**, citing
     LinkedIn's brand-usage policy. `@icons-pack/react-simple-icons@13.15.1` still ships
     `SiLinkedin` today because it tracks a 13.x dataset — I confirmed the file exists on unpkg — but
     it has no `SiX`, and the LinkedIn glyph disappears the moment that package tracks upstream v14.
     Building on a mark upstream has deleted is a liability for no benefit.

  **Verify at install:** `IconBrandGithub`, `IconBrandLinkedin`, `IconBrandX` all resolve. If any
  doesn't, fall back to three inline SVGs in `components/icons/` — for three glyphs that is ~40 lines
  and zero dependencies, and it is the better answer if the stroke weights still don't sit right.

- **~~`motion@^13.1.0`~~ — dropped.** It does not earn its place here.

**Why `motion` is out.** I originally planned to add it. Reading `node_modules` changed the answer:

- `tw-animate-css@1.4.0` is **already a runtime dependency** and already ships the entrance toolkit —
  `animate-in`, `fade-in`, `slide-in-from-bottom-*`, `delay-*`, `animation-duration-*`,
  `fill-mode-*`. Verified in `dist/tw-animate.css`.
- Its `--animate-in` is defined as
  `enter var(--tw-animation-duration, var(--tw-duration, .15s)) var(--tw-ease, ease) …`, so
  `animate-in fade-in slide-in-from-bottom-2 animation-duration-(--duration-base) ease-mech-out`
  drives a reveal **entirely off this project's motion tokens, with zero new keyframes**.
- The one thing still needing JS is deciding _when_ to arm that CSS animation — about twenty lines of
  `IntersectionObserver`. A 30kb+ library for twenty lines is a bad trade.
- The decisive point: CSS animation is covered by the existing global `prefers-reduced-motion` guard
  in `globals.css`. A JS library animates outside it and has to re-implement the guard. Fewer moving
  parts _and_ better a11y.
- Spring physics is the main thing `motion` would buy, and springs are explicitly outside the anchor.

The user asked for animation libraries. The honest answer is that the appropriate one is already
installed. If you'd rather have `motion` anyway, it is one `pnpm add motion` away and the `Reveal`
internals swap without touching any band — but I don't recommend it.

### The trap that makes this work: `duration-*` utilities do not exist here

Verified against `tailwindcss@4.3.3`: the `duration` utility resolves against the
**`--transition-duration-*`** namespace. This project defines `--duration-instant|fast|base|slow` in
`@theme inline`, which emits CSS custom properties but **generates no `duration-*` classes**.

So `duration-slow` and `duration-base` compile to **nothing at all** — no build error, no lint
warning, no visual effect. `ease-mech-out` and `ease-snap` _do_ work, because `ease` reads the
`--ease` namespace, which the project does populate.

Correct forms:

- transitions → `duration-(--duration-fast)`
- `tw-animate-css` entrances → `animation-duration-(--duration-base)`

`stories/05-motion.mdx` currently implies the bare utilities work. Fixing that doc is part of this
change — it is exactly the kind of thing the next person loses an hour to.

## Animation approach

CSS animation throughout, plus one thin client component whose only job is to set a data attribute
when an element enters the viewport. No new keyframes in `globals.css`. No new `@theme` entries.

### `Reveal` — the scroll-entry primitive

`components/motion/reveal.tsx`, roughly fifty lines. A **ref callback**, not `useEffect` +
`useState`: the React Compiler lint is active via `eslint-config-next/core-web-vitals` and rejects
setting state synchronously in an effect. `components/theme-toggle.tsx` documents hitting this
exact wall, and `useComputedColors` in `stories/foundation/kit.tsx` already uses the ref-callback
workaround. This is a hard constraint, not a preference.

The callback:

1. Reads `matchMedia("(prefers-reduced-motion: reduce)").matches`. If true → **do nothing at all.**
   No arming, no observer, content simply visible.
2. Otherwise sets `data-reveal-armed`, then _synchronously in the same block_ reads
   `getBoundingClientRect()`. Already in view → set `data-revealed` immediately. Ref callbacks run
   during commit, before paint, so above-the-fold content paints its final state once, no flash.
3. Not in view → `IntersectionObserver` (`threshold: 0.15`, `rootMargin: "0px 0px -10% 0px"`), set
   `data-revealed` on intersect, disconnect. Cleanup disconnects.

```
data-reveal-armed:opacity-0
data-revealed:animate-in data-revealed:fade-in data-revealed:slide-in-from-bottom-2
data-revealed:opacity-100
animation-duration-(--duration-base) ease-mech-out
```

Bare `data-*` variants are already used in this repo (`data-open:animate-in` in `dialog.tsx`), so the
syntax is proven here.

**Why it cannot hide content.** The hidden state comes from `data-reveal-armed`, which only ever
exists _after_ JS runs. The server HTML has no hidden state at all. JS disabled, hydration failed,
crawler that never executes — every band is visible. A unit test asserts no `opacity-0` in the
server-rendered output. This is the single most important decision in the animation plan.

**Why it cannot cause CLS.** It touches `opacity` and `transform` only. Neither reflows. That is
precisely why nothing else is in scope.

**Restraint.** One `Reveal` per band, applied in `app/page.tsx`. **No per-child stagger** —
staggering a CV delays content the reader is actively trying to read.

**The masthead is never wrapped in `Reveal`.** An element at `opacity: 0` is excluded from LCP
candidacy, and does not become one even after fading in unless it repaints. Fading the hero headline
is a direct, self-inflicted LCP regression. Reveals are for below-the-fold content only — which is
also the better a11y call, since it keeps motion out of the user's initial focal area.

**Never animate a CSS custom property.** Per Motion's own performance write-up, CSS variables always
trigger paint on affected elements, even when the value they feed is compositor-only. This whole
system is custom properties, so the rule matters: animate `opacity` and `transform` on the element,
never a token.

**A watchdog, because the failure mode is a blank page.** If `data-reveal-armed` is ever set and
`data-revealed` never follows — a chunk 404s, an observer misfires — the band stays invisible
forever. A ~2s timer that unconditionally reveals everything costs nothing and bounds the blast
radius.

### Card hover latch

On `EngagementCard`: `group transition-colors duration-(--duration-fast) hover:bg-accent`, with
`group-hover:text-signal-text` on the title. Pure CSS, covered by the global guard, and it is the
mechanical relay-closing feedback the anchor actually asks for.

### `Decode` and `CountUp` — building them as chosen, with the objections on record

You picked instrument-panel restraint, which includes both. They are built. But both rewrite text
content from JS, which puts them **outside** the CSS reduced-motion guard, so each needs its own
explicit bail. Non-negotiable rules:

- **The final value ships in the server HTML** and JS only takes over after mount. Otherwise the page
  serves scrambled text to crawlers, and a `CountUp` starting at `0` reflows the `StatGroup`.
- **Bail to the final state** on `prefers-reduced-motion: reduce`, and on
  `document.visibilityState !== "visible"`.
- `Decode` runs **once, on the masthead h1 only**, ≤ 2 × `--duration-slow`, with an identical
  character count every frame (monospace makes this width-stable). The animating node is
  `aria-hidden` with a `VisuallyHidden` real name beside it, so a screen reader never gets garbage.
- **Unresolved noise glyphs render one ink step dimmer than resolved ones** —
  `text-muted-foreground` resolving to `text-foreground`. Same-colour noise reads as corruption;
  dimmer noise reads as a value resolving, which is the whole point. This single detail is the
  difference between the effect looking deliberate and looking broken.
- Because the masthead is the LCP element, `Decode` must never set `opacity: 0` on it, and must run
  in **addition** to — never instead of — the fully-rendered server HTML.
- `CountUp` never sits in an `aria-live` region, and pins its width — `tabular-nums` is global, so a
  `ch` min-width sized to the final string holds the box.

**The counter-argument, recorded so the choice stays informed.** A telemetry readout displays the
current value; it does not perform a reveal. And a text scramble is the most over-used terminal
trope there is — ADR-0004 rejected this genre's clichés by name for the visual layer, and this is
the typographic equivalent. If you want motion on the figures but not a count-up, the on-anchor
alternative is a **`steps()` unmask**: the figure revealed in three discrete frames with
`--ease-snap`, which is literally the "mechanical counter" `05-motion.mdx` describes, is CSS-only,
and inherits the reduced-motion guard for free. It would need one new keyframe.

### Cut

**Ticker strip** — beyond WCAG 2.2.2 (auto-moving content over 5s needs a pause control), there is a
concrete bug: the global guard sets `animation-iteration-count: 1`, so an infinite marquee under
reduced motion runs _once_ and freezes mid-cycle, leaving half the content off-screen. That is a real
hole in the current guard, worth recording even though we aren't building the ticker.

**Hairline draw-in** — folded into `Reveal`'s `slide-in-from-bottom-2` rather than animated
separately. A separate `scaleX` on every rule is motion for its own sake.

## Responsive strategy

Checked at the four registered widths: Mobile 390 · Tablet 768 · Desktop 1280 · Wide 1536.

**Type scaling uses breakpoint utilities, not `clamp()`.** Each step in the `@theme` scale pairs a
size with a tuned `line-height` and `letter-spacing` — `--text-7xl` is `4.75rem / 0.95 / -0.04em`.
A `clamp()` on font-size alone would slide the size while leaving tracking and leading pinned to
whichever step was written, desyncing the triple the scale exists to keep together.

**The masthead name never wraps, at any width — measured, not assumed.** "Ivan Chaus" is 10
characters and JetBrains Mono's advance is ≈0.6em. At 390 the container inner is ~350px and
`text-5xl` (48px) gives ≈288px. At 640, `text-6xl` (60px) gives ≈360px inside 576px. At 1024,
`text-7xl` (76px) gives ≈456px inside 960px. So a single line holds throughout and no mobile line
break is needed.

_(This corrects an earlier draft of this plan, which assumed a two-line mobile treatment by
measuring against `text-7xl` at 390px — a width the name never actually renders at.)_

**Global rules.**

- One `Container width="default"` everywhere. Never mix widths between bands.
- Every grid track holding text uses `minmax(0,1fr)`, and every flex child holding badges gets
  `min-w-0`. A missing `min-w-0` is the number-one cause of horizontal scroll in a mono layout.
- Every `Section` gets `className="scroll-mt-20 sm:scroll-mt-24 py-14 sm:py-20 lg:py-24"`.
  `Section`'s own `py-10` is fixed and not responsive, so the override is required (twMerge replaces
  it). The `scroll-mt` is required because the header is sticky from `sm` and
  `html[data-scroll-behavior="smooth"]` is set — anchors landing under a sticky header is the classic
  bug here.

| Band            | < 640                                          | 640 `sm`                             | 1024 `lg`                            |
| --------------- | ---------------------------------------------- | ------------------------------------ | ------------------------------------ |
| Header          | brand + `ThemeToggle`; anchors hidden          | sticky, 3 anchors inline             | —                                    |
| Masthead        | 1 col, buttons `w-full` stacked                | buttons `sm:w-auto sm:flex-row`      | `py-28`                              |
| 01 Readout      | 1 col (`StatGroup` default)                    | 2×2                                  | 1×4                                  |
| 02 Practice     | `Prose` then facts stacked, `gap-8`            | —                                    | `lg:grid-cols-[minmax(0,1fr)_16rem]` |
| 03 Engagements  | `grid gap-px bg-hairline [&>*]:bg-card`, 1 col | `sm:grid-cols-2` → 2×2               | stays 2×2                            |
| 04 Track record | `Timeline` unchanged                           | unchanged                            | unchanged                            |
| 05 Capabilities | rows stack, term above value                   | `sm:grid-cols-[11rem_minmax(0,1fr)]` | —                                    |
| 06 Education    | 1 col, `gap-8`                                 | `sm:grid-cols-2`                     | —                                    |
| 07 Contact      | rows stack, buttons `w-full`                   | same `<dl>` grid as 05               | —                                    |
| Footer          | `flex-col gap-4`                               | `sm:flex-row sm:justify-between`     | —                                    |

Engagements is **never 3-up** — four items would orphan one. Track record is deliberately identical
at every width: moving the date into a `lg:` gutter means fighting `TimelineItem`'s `border-s ps-6`
internals for no real gain. Education uses a plain gap rather than a hairline grid, to avoid a third
identical grid treatment on one page.

Note 390 is _below_ `sm` (640), so `sm:` is the first change and 390 is never landed on directly.

**Touch targets.** `Button size="default"` is `h-8` (32px), which clears WCAG 2.5.8 AA (24×24). The
masthead actions use `size="lg"` (h-10) plus `w-full` on mobile so the horizontal target is generous.

Mobile gets designed first, per `stories/03-layout.mdx`: monospace runs ~15% wider than a grotesk, so
a layout tuned by eye on a proportional face overflows here.

## Spec and vocabulary, first

`AGENTS.md`: "Work flows spec-first. Nothing substantial gets built straight from a prompt."

1. Write `docs/specs/0002-home-page.md` — problem, solution, user stories, decisions, out of scope,
   test plan. Behaviour only, no file paths, per `docs/specs/README.md`.
2. `CONTEXT.md` has **no vocabulary for page regions, portfolio content, or motion**, and its own
   convention says a term is added the moment it is decided, not batched. Add a
   `### Portfolio content` cluster and a `### Motion` cluster, in the same session:

   | Term           | Definition                                                              | _Avoid_                        |
   | -------------- | ----------------------------------------------------------------------- | ------------------------------ |
   | **Masthead**   | The unnumbered opening block above the first band                       | hero, banner, splash           |
   | **Band**       | One numbered `Section` of a page                                        | block, strip, region, panel    |
   | **Role**       | A paid position at an employer, with a date range and a title           | job, gig                       |
   | **Engagement** | A client platform delivered inside a role, with its own stack and range | project, work, case            |
   | **Capability** | A named skill belonging to a discipline group                           | skill, tech, tag               |
   | **Reading**    | A single measured claim, rendered as a `Stat`                           | metric, KPI, proof point       |
   | **Reveal**     | The scroll-triggered entrance                                           | scroll animation, fade-in, AOS |
   | **Decode**     | The stepped character-substitution entrance, used once on the masthead  | scramble, glitch, typewriter   |

   Note that **Engagement** and **Role** must stay distinct: the four client platforms were delivered
   _inside_ the Beleven role and are concurrent with it, so collapsing them into one word would make
   the timeline read as though he held seven positions.

## Testing

**Stories** for each motion primitive and each `components/home/*` band, `bothThemes: true` (nothing
here portals, so the split view is safe). This is the mechanism that puts the new markup under axe at
`error` level in light _and_ dark — `app/page.tsx` is never story-tested, so without these the page's
contrast is simply unverified. Add `"Home"` to `storySort.order` in `.storybook/preview.tsx`.

Copy the pattern in `components/theme-toggle.stories.tsx` for the header and footer: **no
`ThemeProvider`**. Its docblock explains why adding one fights the theme decorator.

`play` functions assert what regresses silently:

| Story           | Asserts                                                                                                                                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| masthead        | one `h1` named exactly "Ivan Chaus" — not a half-decoded string; the primary action is a `link` with an `href`, not a `button`; LinkedIn carries `rel="noopener noreferrer"` and the "(opens in a new tab)" text |
| readout         | four `definition` roles, terms are `<dt>`                                                                                                                                                                        |
| engagement-card | exactly one link, whose accessible name is the engagement name                                                                                                                                                   |
| track-record    | three `listitem`s in one `list`; exactly one carries `data-current`                                                                                                                                              |
| capabilities    | term/definition counts. **Highest a11y value on the page** — `label-caps` at 11px muted is the pairing most likely to fail light mode                                                                            |
| contact         | `mailto:` href; LinkedIn and GitHub external with sr-only text                                                                                                                                                   |

`Reveal` stories matter because the story projects run **real Chromium**, so `IntersectionObserver`
genuinely exists: an `InView` story waiting for `data-revealed`, and a `BelowTheFold` story with a
tall spacer that asserts armed → `scrollIntoView()` → revealed.

**Unit tests** (jsdom):

- `content/profile.test.ts` — slugs unique and URL-safe; every `Range.start` parses and
  `start <= end`; roles reverse-chronological with **exactly one** `current: true`; every
  `Reading.value` is a `string` (guards against locale formatting creeping into render); email and
  LinkedIn URL shapes.
- `app/page.test.tsx` — **possible, and a real capability rather than a workaround.** `AGENTS.md`
  forbids unit-testing _async_ server components; every band and the page itself are deliberately
  synchronous, so RTL renders them. Asserts: exactly one `h1`; heading levels never jump by more than
  one; seven `<section>` landmarks each with `aria-labelledby`; every link has a non-empty accessible
  name; and — the most valuable assertion in the suite — **no element in the server-rendered output
  carries `opacity-0`**. If `next/link` or `next-themes` fight jsdom, fall back to rendering bands
  individually; the assertions still hold.
- `components/motion/*.test.tsx` — stub `globalThis.IntersectionObserver`. Assert initial render has
  no hidden class, that mount arms and observes, and that with
  `matchMedia("(prefers-reduced-motion: reduce)").matches === true` it **never arms and never
  observes**.

**Not covered, and worth saying so rather than assuming:** real `prefers-reduced-motion`
end-to-end (no E2E harness); sticky-header `scroll-mt` behaviour; hover states — axe doesn't evaluate
them, so `group-hover:text-signal-text` on a card title is unchecked. It is safe by construction
(`--signal-text` is solved to 4.61:1 against the _sunken_ surface, and `--card` is lighter than that
in light mode), but unchecked is unchecked. Visual regression is out of scope per spec 0001.

## Verification

1. `pnpm format`, then `pnpm check` — `next typegen && tsc --noEmit`, eslint, and all three Vitest
   projects. A fresh clone needs `pnpm exec playwright install chromium` first.
2. **`code-quality-reviewer` agent** over the diff, briefed on the anchor: duplicated components,
   raw ramp references, `border-hairline` on interactive elements, white-on-amber, hard-coded hexes,
   reintroduced `rounded-*`/`shadow-*`, and **any bare `duration-*` utility**, which is now a known
   silent failure.
3. **Playwright MCP** against a running `pnpm dev` (no server is running as of writing — check
   `.next/dev/lock` before starting a second):
   - Load `/`; console clean, no 404s.
   - At 390 / 768 / 1280 / 1536 in both themes: screenshot, and assert
     `document.documentElement.scrollWidth <= clientWidth`.
   - Emulate `prefers-reduced-motion: reduce`: nothing animates, all content present.
   - **Disable JavaScript entirely**: every band still visible. This is the one that catches the
     worst failure mode.
   - Tab from the top: skip link first, visible focus outline throughout, no trap.
   - Confirm the `StatGroup` does not reflow while `CountUp` runs, and that anchor links land below
     the sticky header rather than under it.
4. **next-devtools MCP** — `get_errors` and `compile_route` for `/`.
5. **Manual pass, light theme first** — the anchor is dark-native and light is the register that
   fails first, per the ADR.

## Implementation order

1. `CONTEXT.md` terms, then `docs/specs/0002-home-page.md`. Naming first avoids a rename pass.
2. `pnpm add @tabler/icons-react`, and verify the three brand marks resolve.
3. `content/` — schema plus the six data modules, shipped with `content/profile.test.ts`.
4. Motion primitives with their stories and reduced-motion tests. **Build these before anything
   depends on them, and verify the fail-visible behaviour first** — everything else rides on it.
5. `app/layout.tsx` — `SkipLink` as the first child in the body, `<main id="main" tabIndex={-1}>`,
   real metadata (title template, description, `metadataBase`, openGraph).
6. Bands in page order, one at a time, each verified in Storybook at all four viewports in both
   themes before moving on: masthead → readout → practice → engagements (+ card) → track record →
   capabilities → education → contact → header + footer.
7. `app/page.tsx` as pure composition, with `Reveal` around each band **except the masthead**.
8. `.storybook/preview.tsx` storySort; `stories/05-motion.mdx` gains the `duration-*` warning.
9. `pnpm format`, `pnpm check`, reviewer agent, then the Playwright sweep.

## Risks

Ordered by how badly they bite.

1. **Content hidden behind JS.** `Reveal` is the only thing on the page that can make text invisible.
   Mitigated three ways: the hidden state only ever exists after JS runs, a unit test asserts no
   `opacity-0` in the server-rendered output, and a 2s watchdog reveals everything unconditionally.
   Get this wrong and the portfolio is blank to every crawler.
2. **LCP.** Fading the masthead would exclude it from LCP candidacy outright. It is not wrapped in
   `Reveal`. Also: `next/font/google` defaults to `display: swap`, so a fallback swap on a
   `text-7xl` h1 is a visible reflow — `adjustFontFallback` is on by default and mitigates the metric
   mismatch, but measure rather than assume.
3. **`duration-*` compiling to nothing.** Silent, no error, no lint. The single easiest way for this
   work to look done and animate at Tailwind's 150ms default instead of the anchor's tokens.
4. **The reduced-motion guard has two holes.** `animation-iteration-count: 1` _breaks_ infinite
   animations rather than stopping them (why there is no ticker), and the guard does nothing about
   JS that rewrites `textContent` (why `Decode` and `CountUp` each need an explicit bail).
5. **The spec promises more than WCAG asks, and that needs a decision.**
   `docs/specs/0001-design-system.md` says "As a visitor who has asked for reduced motion, nothing
   animates." WCAG SC 2.3.3 explicitly carves out "changes of color, blurring, or opacity which do
   not change the perceived size, shape, or position" — so an opacity fade is not what the criterion
   is about. The plan honours the **stricter** existing promise: under reduced motion, nothing
   animates at all. If that turns out to be over-restrictive, it is a spec amendment, not something
   to quietly work around.
6. **Spending the signal.** Planned amber marks: the masthead status dot, the masthead primary
   button, and `TimelineItem current`. Three. One more — a signal badge, a signal contact button —
   and the accent stops meaning "the one important thing." The contact CTA is `outline`, not
   `signal`.
7. **Rebuilding what exists.** Highest-risk specifically: `Divider` (don't hand-roll an `<hr>`),
   `SectionFigure` (never hand-write `figure-condensed text-4xl`), `Stat`/`StatGroup`, `Timeline*`,
   `Link` (a bare `<a>` loses the `rel` and the sr-only text), `Icon` (note `app/page.tsx` currently
   drops a raw Lucide icon in — do **not** copy that), `buttonVariants` for link-as-button, and
   `VisuallyHidden`. Also: `Kicker` (`tracking-kicker`) and `label-caps` (`tracking-label`) are
   different things — pick by role, not by look.
8. **Heading hierarchy inversion.** `Section` titles are only `text-lg`. An engagement card
   `Heading level={3}` must be `size="sm"` or `size="xs"`; `size="lg"` would be `text-2xl` and
   out-shout its own section title.
9. **Anchor violations most likely to slip in:** `backdrop-blur` on the sticky header (soft edge);
   `text-signal` used as text instead of `text-signal-text` (1.57:1 in light — an instant axe
   failure); `Prose` on the masthead standfirst (widens the one deviation); `figure-condensed` on
   anything but section numerals; `text-6xl`/`text-7xl` anywhere but the h1.
10. **Sticky header stacking.** `z-40` keeps it under Base UI's portalled overlays. Check with a
    tooltip or toast open.
11. **`pnpm check` gets slower** — ~10 new story files × 2 real-Chromium theme projects. If it hurts,
    colocate bands into fewer story files rather than dropping the light project; light is the theme
    that fails first.
12. **Content accuracy.** The Candylink 50,000/100,000 conflict is flagged, not silently resolved.
    No availability claim is invented — no CV states one. The h1 says "Frontend Lead / Architect"
    while the current YachtWay title is Front-end Engineer; Track record shows real titles, which
    keeps the h1 a description of practice rather than a false claim.

## References

Fetched live during research, and the basis for the section ordering and hero copy above.

- **Section order** — [brittanychiang.com](https://brittanychiang.com) (About → Experience →
  Projects → Writing), [emilkowal.ski](https://emilkowal.ski) (Today → Previously → Projects),
  [paco.me](https://paco.me), [leerob.com](https://leerob.com), [rsms.me](https://rsms.me),
  [samuelkraft.com](https://samuelkraft.com).
- **The pattern worth stealing** — emilkowal.ski's _Today / Previously_, which replaces a whole
  experience timeline with two short paragraphs. Track record keeps the timeline because a job
  search needs the detail, but the masthead status line borrows the "Today" idea directly.
- **Hero copy** — every strong example contains at least one **proper noun or checkable fact**:
  "Design Engineer at Raycast currently working on desktop app builder Glaze" (samuelkraft),
  "Webmaster at Linear" (paco), "I'm an engineer and writer" (leerob). The generic register
  — "passionate developer crafting beautiful experiences" — has neither, which is exactly why it
  reads as filler. The standfirst names YachtWay, Next.js and the 50% figure for this reason.
- **Tech-stack grids are absent from every top-tier site checked.** Capabilities is kept anyway,
  because those sites belong to people who are already known and this one has to survive a
  keyword-scanning recruiter — but it stays a compact `<dl>`, not a badge wall, and never a skill bar
  with a percentage.
- **No contact form** — universal. Everyone uses a mailto or copy-to-clipboard.
- **[Brutalist Web Design](https://brutalist-web.design/)** — "View content by scrolling" rules out
  scroll-jacking and Lenis; "Performance is a feature" is the argument against the animation library.
- **[W3C F94](https://www.w3.org/WAI/WCAG22/Techniques/failures/F94)** — `clamp()` with a pure `vw`
  preferred value is a _named_ WCAG failure, because `vw` cancels zoom exactly. Independent
  confirmation of the breakpoint-utilities decision above.
- **Custom cursors and magnetic buttons were considered and rejected** —
  [dbushell](https://dbushell.com/2025/10/27/custom-cursor-accessibility/): CSS cursors ignore the
  Windows system cursor-size setting, so users who enlarge their cursor lose it. Magnetism also moves
  a target away from where a motor-impaired user aimed. Both are springy and organic, which is the
  opposite of this anchor.
- **[Motion's own performance tier list](https://motion.dev/magazine/web-animation-performance-tier-list)**
  — compositor-safe is `transform`, `opacity`, `filter`. Per the Web Almanac 2025, 91.7% of mobile
  pages use a CSS transition and only 18.4% load a JS animation library: CSS-only is the majority
  position, not the austere one.
