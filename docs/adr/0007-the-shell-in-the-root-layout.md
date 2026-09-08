# The shell lives in the root layout, and every band link is root-relative

The header, the focusable `<main id="main">` and the footer are composed once in `app/layout.tsx`,
behind a `SiteShell` component, rather than inside each page. They used to live in `app/page.tsx`,
which was fine while `/` was the only route and stopped being fine the moment there was a second
one: a page without its own `<main id="main">` gives the layout's `SkipLink` a dead target, and a
page without the header and footer has no navigation at all. The layout already owns every other
piece of site-wide furniture — the skip link, the page field, the theme provider, the toaster — and
these were the only members of that category living in a page. A pleasant side effect is that Next's
built-in 404 renders inside the root layout, so `notFound()` and `app/not-found.tsx` get the real
chrome for free.

**Why `SiteShell` exists as a component rather than three tags inlined in the layout: testability.**
`RootLayout` renders `<html>` and `<body>` and cannot go through Testing Library cleanly.
`SiteShell` returns a _fragment_ of exactly `<header>`, `<main>`, `<footer>`, which is what lets
`app/page.test.tsx` keep destructuring `container.children` as `[header, main, footer]` — it renders
`<SiteShell><Home /></SiteShell>`, and since the whole page really is shell plus page, that is the
honest reading rather than a workaround. It is also what gives the untestable
`app/news/[slug]/page.tsx` landmark coverage, via `components/shell/site-shell.test.tsx`.

`site-header.tsx` and `site-footer.tsx` moved out of `components/home/` into `components/shell/` at
the same time, because a component that renders on every route is mis-filed under `home/`.

## The consequence: `bandHref`

Every link to a band is now root-relative — `/#engagements`, never `#engagements` — produced by
`bandHref` in `components/home/bands.ts` and used at all four call sites. A bare fragment resolves
against whatever page is open, so from `/news` it points at a fragment that route does not have and
the click does nothing.

This looks like it should regress the home page, and it does not. Next computes `onlyHashChange` by
comparing pathname and search (`client/components/segment-cache/navigation.js`), and
`shared/lib/router/utils/disable-smooth-scroll.js` returns early on that path without touching
`scroll-behavior`. So clicked from `/` it is still a hash-only navigation: the CSS smooth scroll
applies and `Band`'s `scroll-mt-16` still offsets the landing under the sticky header. Clicked from
`/news` it is a real route transition and lands instantly, which is correct for one. The one
behaviour that does change: clicking the same nav item twice in a row is now a no-op rather than a
re-scroll. That is not worth defending.

`#main` links are deliberately _not_ converted. The shell gives every route a `<main id="main">`, so
"top" means the top of the page you are on — which is what the footer's _Top_ link and the skip link
both mean.

## Consequences

`components/shell/nav.ts` exists because the header now links to a route as well as to bands, and
those are different kinds of destination. It keeps both in one list behind a `kind`, which is what
stops a route path being pushed into `BANDS` — where every id is an anchor `app/page.test.tsx`
demands a matching `<section>` for. **That module must never gain `"use client"`:** `SiteNav` is a
client component and the header and footer are not, and all three import from it.
`components/motion/stagger.ts` documents the failure mode — a constant exported from a client module
arrives in a server component as a client reference, and the value silently empties.

`SiteNav` is the only client component in the shell, and deliberately the smallest possible one: a
list of four links, needed as a client component solely for `usePathname()`, which is what marks the
current route. Everything else in the header stays server-rendered.

Each route now declares its own `alternates.canonical`, because metadata is inherited by descendant
segments and a canonical declared on the root layout would have made `/news` and every dispatch
claim to be `/`. `lib/metadata.ts` exists for the related trap: a segment's `openGraph` **replaces**
its parent's rather than merging field by field, so `siteName` and `locale` have to be spread in
rather than inherited.
