# Cache Components stays off

`next.config.ts` deliberately does not set `cacheComponents: true`. The Next.js 16 upgrade guide is
explicit that enabling it "is not a rename-only change: it can surface build errors for uncached data
outside of `<Suspense>`" — and this project currently has no data fetching at all, so there is
nothing to gain and a working build to lose.

## Consequences

The caching model that applies is the one documented in
`node_modules/next/dist/docs/01-app/02-guides/caching-without-cache-components.md`, **not**
`01-app/01-getting-started/08-caching.md`. That second file is the default landing page for caching
in the bundled docs and describes a model this project does not use, which makes it the single
easiest wrong turn available here.

Consequently unavailable until this flips: the `'use cache'`, `'use cache: private'` and
`'use cache: remote'` directives, `cacheLife` / `cacheTag` / `updateTag`, and Partial Prerendering.
Still available: the route segment configs `dynamic`, `dynamicParams`, `revalidate` and `fetchCache`,
which Cache Components would _remove_.

Revisit when the site gains real data fetching — a CMS, a git-backed content layer, or an API. That
is the point at which partial prerendering starts paying for the migration.
