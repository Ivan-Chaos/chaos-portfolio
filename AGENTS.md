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
- Unit and component tests are Vitest + Testing Library in `__tests__/`. Vitest **cannot** test
  `async` Server Components — those need E2E, which isn't set up yet. Don't write a unit test for
  an async server component and don't refactor one into a client component just to make it testable.

## UI components — shadcn/ui

Configured, with **no components installed yet**. `components.json` sets base `base-nova`: Base UI
primitives, `neutral` base color, Lucide icons. See
`docs/adr/0003-shadcn-ui-on-base-ui.md` before reconsidering the primitives base.

- Add components with `pnpm dlx shadcn@latest add <name>`. They land in `components/ui/` and are
  **yours** — vendored source, edit freely. Nothing updates them for you.
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
utilities only apply under an element carrying `.dark`. Nothing sets that class yet, so the site
currently renders light regardless of OS preference — `shadcn init` replaced the original
`@media (prefers-color-scheme: dark)` block. A theme provider (`next-themes`) is the standard fix
and hasn't been added.

## Spec-driven development

Work flows spec-first. Nothing substantial gets built straight from a prompt.

| Where         | What                                                                         |
| ------------- | ---------------------------------------------------------------------------- |
| `CONTEXT.md`  | Domain glossary / ubiquitous language. **Read before naming anything.**      |
| `docs/adr/`   | Architecture Decision Records, `NNNN-slug.md`. One paragraph is a valid ADR. |
| `docs/specs/` | Specs for work in flight.                                                    |

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
