# Dispatch metadata lives in TypeScript, not in the MDX

A dispatch is two files: a typed record in `content/dispatches.ts` and a body at
`content/dispatches/<slug>.mdx`. The obvious alternative — `export const metadata` inside the MDX,
which is the only frontmatter form `@next/mdx` supports natively — was rejected because of what it
costs the test setup, not because of anything about authoring.

`app/page.test.tsx` renders the whole home page in jsdom, and that is only possible because every
band is a synchronous server component. The News band reads `content/dispatches.ts`, `app/page.tsx`
renders the band, and the test renders the page — so **whatever that module imports, that test
imports.** Putting the metadata in the MDX means the index page and the home band import compiled
MDX, which would make an existing, load-bearing test depend on an MDX pipeline in Vitest's `unit`
project. It would need a second one inside `storybookTest`'s plugin array, where
`@storybook/addon-docs` already claims `*.mdx` for a different dialect and load order would decide
which plugin compiled an article. `@types/mdx` also types only an MDX file's _default_ export, so
the metadata would be untyped without a hand-written `.d.ts` per piece. And because Turbopack has no
`import.meta.glob`, that route still needs a hand-maintained barrel of imports — so it does not
remove the list, it moves the list somewhere harder to test.

## Consequences

The slug is written twice, as a record field and as a filename. `__tests__/content.test.ts` reads
the directory and fails on either kind of orphan, and also fails if a body reintroduces
`export const metadata`, opens with a second top-level heading, or uses a markdown image (which
carries no dimensions and so cannot go through `next/image` without a layout shift).

The MDX pipeline is confined to exactly two files: `next.config.ts` and
`app/news/[slug]/page.tsx`, which dynamic-imports the body by slug. No Vitest project and no
Storybook glob ever resolves an `.mdx` under `content/`. That is also why the element map lives in
`components/news/prose-components.tsx` rather than in the root `mdx-components.tsx` — from there a
plain TSX story can render every element under axe in both themes without Storybook learning to
compile MDX.

The price is that nothing in `pnpm check` proves a body compiles. `next build` is the gate, and the
article route's docstring says so.

**`content/dispatches.ts` must never gain a `body: () => import("./dispatches/x.mdx")` field**,
however tidy that looks: it re-opens the exact leak this closes. A test asserts the absence — with
comments stripped first, because the module's own docstring quotes the forbidden import as the
example of what not to write.

## Two things worth knowing before touching the pipeline

`next.config.ts` deliberately does **not** set `pageExtensions`, which parts company with every
`@next/mdx` snippet in circulation. Those add `mdx` so an `.mdx` file can _be_ a route file; no
dispatch is one. `@next/mdx` keys both its webpack rule and its Turbopack rule on the file extension
and never reads that list (see `node_modules/@next/mdx/index.js`), so the loader still runs — and
Next keeps treating only `ts`/`tsx` as route, `proxy` and `instrumentation` files, which is what
setting it would have widened.

There are **no remark or rehype plugins**, and both candidates were declined rather than forgotten.
Turbopack can only take plugins named as strings with serialisable options, so the usable set is
small to begin with. `remark-gfm` autolinks bare URLs, which would route those links around
`components/ui/link.tsx` — the single place the external `rel`, the arrow and the "opens in a new
tab" announcement are guaranteed, and the thing `app/page.test.tsx` asserts about every external link
on the site. `rehype-slug` only pays off once a piece wants a table of contents or a deep link; add
it in the string form the day one does, and add `scroll-mt-16` to the mapped headings at the same
time, because the header is sticky and an anchor would otherwise land underneath it.
