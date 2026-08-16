<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- Everything below this line is hand-written and is NOT touched by `next dev`.
     The generator only rewrites text between the BEGIN/END markers above. -->

# chaos-portfolio

Ivan's personal portfolio site. Next.js 16 App Router, React 19, Tailwind v4, TypeScript, pnpm.

## Verify your work

```bash
pnpm check      # typecheck + lint + test — run this before claiming anything works
pnpm storybook  # the design system, and where components are actually built
```

`pnpm typecheck` is `next typegen && tsc --noEmit`. **The `next typegen` prefix is required, not
decoration.** Next 16 generates route types (`PageProps`, `LayoutProps`, `RouteContext`) into
`.next/dev/types`, and also writes `next-env.d.ts`. A bare `tsc --noEmit` silently fails to
validate route usage and may not find Next's types at all in a clean checkout.

For runtime behavior — did the page actually render, is the console clean — use the `next-dev-loop`
skill against a running `pnpm dev`, or the `next-devtools` MCP server (`get_errors`,
`get_compilation_issues`, `compile_route`). `compile_route` confirms a route compiles without
paying for a full `next build`. Both need `pnpm dev` running; `next dev` writes its PID and URL to
`.next/dev/lock`, so check there before starting a second server.

## Conventions

- **pnpm only.** The lockfile is `pnpm-lock.yaml`. Never `npm install` or `yarn`.
- **App Router lives at `app/` in the repo root. There is no `src/`.**
- **`@/*` resolves to the repo root**, not `src/`. So `@/app/…`, `@/components/…`.
- **Tailwind v4 is CSS-first — there is no `tailwind.config.ts` and there should not be.** Design
  tokens go in the `@theme inline` block in `app/globals.css`. Do not create a JS/TS Tailwind config.
- Prettier sorts Tailwind classes automatically (`prettier-plugin-tailwindcss`). Don't hand-order
  them; run `pnpm format`.
- Unit and component tests are Vitest + Testing Library in `__tests__/` (or beside the component).
  Vitest **cannot** test `async` Server Components — those need E2E, which isn't set up yet. Don't
  write a unit test for an async server component and don't refactor one into a client component
  just to make it testable. Client components are better covered by a story with a `play` function,
  which runs in a real browser.
- **`pnpm test` runs three Vitest projects**, not one: `unit` (jsdom) plus `stories:light` and
  `stories:dark` (real Chromium via Playwright). A fresh clone needs
  `pnpm exec playwright install chromium` before it passes. Narrow with `pnpm test:unit` or
  `pnpm test:stories` while iterating.

## The design system

**Read `docs/adr/0004-industrial-anchor.md` before touching anything visual.** The system commits to
one direction — Industrial — and the tokens only make sense as a set. Square corners and a
neutralised shadow scale are the direction holding, not omissions to fix.

The rules are restated at the top of `app/globals.css`, which is the single source for every token.
The short version:

- **Monospace is the default UI face**, set via `--default-font-family`. The proportional face is
  for long-form prose only, reached through `prose-face` — this is the one recorded deviation, and
  widening it is a defect. `CONTEXT.md` defines _chrome_ vs _prose_.
- **`--radius: 0` and the `--shadow-*` scale resolve to transparent.** Both are deliberate, and both
  are what let vendored shadcn components arrive square and flat with no edits. Don't reintroduce
  either for one component's benefit.
- **`--hairline` and `--control` are not interchangeable.** Hairline is decorative and sits below
  3:1. Control identifies an interactive boundary and is solved to 3:1. An input bordered with
  `--hairline` is an accessibility bug.
- **Amber is three tokens**: `--signal` fills, `--signal-edge` borders, `--signal-text` is the only
  one safe as prose-size text in both themes. `#FFB800` on the light ground is 1.57:1.
- Status hues (`--danger`, `--success`) are **functional only** — validation, destructive actions,
  alerts, toasts. Never decoration.
- Never reference a raw ramp (`--ink-*`, `--amber-*`) from a component. Use the semantic token.

Contrast is enforced, not reviewed: `parameters.a11y.test` is `"error"`, and story tests run in both
themes, so a palette regression fails `pnpm check`.

Foundation docs live in `stories/*.mdx` and render inside Storybook.

## UI components — shadcn/ui

`components.json` sets base `base-nova`: Base UI primitives, `neutral` base color, Lucide icons. See
`docs/adr/0003-shadcn-ui-on-base-ui.md` before reconsidering the primitives base.

**The installed package is `@base-ui/react`, not `@base-ui-components/react`** — the latter name is
frozen at an old release candidate, so any snippet using it will not resolve. Note also
`lucide-react` is on **v1.x**, not the familiar `0.x`.

- Add components with `pnpm dlx shadcn@latest add <name>`. They land in `components/ui/` and are
  **yours** — vendored source, edit freely. Nothing updates them for you.
- **A newly added component always needs a retheme pass.** The three things that leak past the
  token layer every time: `outline-none` plus a `focus-visible:ring-*` (delete both — the global
  `:focus-visible` outline owns focus), `border-input` / `bg-input` (use `border-control`), and
  `text-destructive` used as _text_ (use `text-danger-text`; `--destructive` is a fill and fails
  contrast as text). `rounded-*` and `shadow-*` are already inert and can be left or removed.
- **Button treatments are `filled | signal | outline | transparent | underline | danger`.**
  `default`, `secondary`, `ghost`, `link` and `destructive` still work as aliases because vendored
  components reference them by name — prefer the real names in new code. `filled` is ink; `signal`
  is the amber one and is for the single most important action on a view.
- Look things up with `pnpm dlx shadcn@latest docs <component>`, and remember the official docs
  serve Base UI examples at `/docs/components/base/<name>`. Third-party blocks written for **Radix**
  need their primitive imports adapted — check what a snippet is built on before pasting it.
- Use `cn()` from `@/lib/utils` to merge class names. It is `twMerge(clsx(...))`, so later
  conflicting utilities win — that's how you make component classNames overridable.
- **Style through the tokens, not raw colors.** `bg-background`, `text-foreground`, `bg-primary`,
  `text-muted-foreground`, `border-border` and friends are defined in `app/globals.css`. Hard-coded
  hexes and `bg-zinc-*` bypass theming and break dark mode.
- `--radius` drives every `rounded-*` step via `calc()`. Change the one variable, not each usage.
- `shadcn` is a **runtime dependency** — `app/globals.css` imports `shadcn/tailwind.css` for shared
  keyframes and variants. Don't move it to devDependencies; the build needs it.

**Dark mode is class-based, not OS-based.** `@custom-variant dark (&:is(.dark *))` means `dark:`
utilities only apply under an element carrying `.dark`. `next-themes` puts that class on `<html>`
via `components/theme-provider.tsx`, with `defaultTheme="system"`.

One consequence worth knowing before you write a themed wrapper: because the variant is
`&:is(.dark *)`, **the element carrying `.dark` is not itself matched by it.** Background and text
colors have to sit on a child. This is why `ThemeSplit` and the Storybook decorator both nest a div.

## Storybook

Storybook 10 on `@storybook/nextjs-vite`. See `docs/adr/0005-storybook-10-nextjs-vite.md` — the
version is a floor, not a preference (Storybook 9 is broken on Next 16). Three traps:

- **Don't install `@storybook/addon-essentials`, `-interactions`, or `-viewport`.** All three are
  stranded on npm two majors back with no `deprecated` flag, so they install silently. Viewport,
  backgrounds, controls, actions and toolbars are core in v10; interaction testing is
  `storybook/test` plus `@storybook/addon-vitest`.
- **`postcss.config.mjs` must stay object-form.** Array-form is Next-only; Storybook detects it and
  rewrites the file on disk. Tailwind v4 reaches Storybook through that config — `@tailwindcss/vite`
  in `viteFinal` is advice for plain Vite projects and does not apply.
- **The theme decorator is hand-written**, not `withThemeByClassName`, because Storybook has no
  built-in for rendering one story in two themes. Set `parameters: { bothThemes: true }` on a story
  to get the split view — but not for overlays (Dialog, Popover, Tooltip, Toast), which portal to
  `document.body` outside both panels. Use the toolbar for those.

## Spec-driven development

Work flows spec-first. Nothing substantial gets built straight from a prompt.

| Where         | What                                                                         |
| ------------- | ---------------------------------------------------------------------------- |
| `CONTEXT.md`  | Domain glossary / ubiquitous language. **Read before naming anything.**      |
| `docs/adr/`   | Architecture Decision Records, `NNNN-slug.md`. One paragraph is a valid ADR. |
| `docs/specs/` | Specs for work in flight.                                                    |
| `stories/`    | Storybook foundation docs (`*.mdx`) and token stories.                       |

Use the terms in `CONTEXT.md` in code, tests, commits and docs. If a term is missing, fuzzy, or
conflicts with what the code already calls something, resolve it and update `CONTEXT.md` in the same
session — don't batch it. Check `docs/adr/` before proposing an architectural change; a decision
recorded there was made deliberately, so reopen it explicitly rather than quietly working around it.

## Next.js 16 traps

Your priors are probably Next 14/15. These are the differences that actually bite. Sourced from
`node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md`.

- **Async request APIs.** `cookies()`, `headers()`, `draftMode()`, and `params` / `searchParams` are
  all async — `await` them. The synchronous fallback that v15 tolerated is fully removed. Props
  passed to `opengraph-image`, `twitter-image`, `icon` and `apple-icon` are Promises too.
- **Use the generated route types** (`PageProps<'/blog/[slug]'>`, `LayoutProps<'/'>`, `RouteContext`)
  instead of hand-writing prop types. `app/layout.tsx` already does this.
- **`middleware.ts` is deprecated → `proxy.ts`.** Its runtime is always `nodejs` and is not
  configurable; the edge runtime is unsupported there. `skipMiddlewareUrlNormalize` →
  `skipProxyUrlNormalize`.
- **`next/image`:** `priority` is deprecated → **`preload`**. `images.qualities` now defaults to
  `[75]`. `minimumCacheTTL` defaults to 4 hours, not 60s. `images.domains` is removed — use
  `remotePatterns`. `next/legacy/image` is deprecated.
- **`revalidateTag` requires a second cacheLife argument:** `revalidateTag('posts', 'max')`. The
  one-argument form is a TypeScript error.
- **Parallel routes require `default.js` in every slot** or the build fails outright.
- **`next lint` is removed** and `next build` no longer lints. Lint via `pnpm lint`.
- **Cache Components is OFF** — `next.config.ts` does not set `cacheComponents`, deliberately (see
  `docs/adr/0002-cache-components-off.md`). So the caching model that applies here is
  `01-app/02-guides/caching-without-cache-components.md`, **not**
  `01-app/01-getting-started/08-caching.md`. Reading the wrong one is the easiest way to write code
  that doesn't apply to this project. `'use cache'`, `cacheLife`, `cacheTag` and `updateTag` are not
  in play until that flag flips.
- **Turbopack is the default** for both `dev` and `build`. Adding a `webpack` config to
  `next.config.ts` makes `next build` fail unless you pass `--webpack`.
- Next.js no longer overrides a global `scroll-behavior: smooth` on navigation. Opt back in with
  `<html data-scroll-behavior="smooth">`.
- `serverRuntimeConfig` / `publicRuntimeConfig` are gone — use env vars, plus `connection()` for
  runtime reads. AMP is gone. `next/amp` is gone.
- Node **>= 20.9** (18 is dropped), TypeScript >= 5.1.

## Looking things up

`node_modules/next/dist/docs/` holds the **version-matched** docs — 444 files mirroring
nextjs.org/docs. Start at `index.md`. Prefer these over recalling from memory; that's what the
banner at the top of this file is about.

The per-error pages under `nextjs.org/docs/messages` are **not** bundled — fetch those from the web
when an error links to one.
