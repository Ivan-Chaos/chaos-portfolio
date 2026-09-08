import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/**
 * The header, the focusable `<main>` and the footer, in that order.
 *
 * Composed once in `app/layout.tsx`, so every route carries the same furniture
 * — which is the point. Before there was a second route these three lived in
 * `app/page.tsx`, and `SkipLink` (in the layout) targeted a `#main` the page
 * owned. That seam works with one page and breaks with two: a route without its
 * own `<main id="main">` gives the layout's skip link a dead target. Next's
 * built-in 404 also renders inside the root layout, so `notFound()` gets real
 * chrome from here for free.
 *
 * **It exists as a component rather than three tags inlined in the layout for
 * one reason: testability.** `RootLayout` renders `<html>` and `<body>` and
 * cannot go through Testing Library cleanly. This returns a **fragment** of
 * exactly `<header>`, `<main>`, `<footer>`, which is what lets
 * `app/page.test.tsx` keep destructuring `container.children` as
 * `[header, main, footer]` — see docs/adr/0007.
 *
 * **No `Container`.** The home page's one-container rule and an article's
 * narrower measure are different decisions, so each page supplies its own.
 *
 * `tabIndex={-1}` is what makes the skip link actually move focus rather than
 * only the scroll position. See components/ui/skip-link.tsx.
 *
 * `relative` so `<main>` paints above the fixed page field: both are
 * positioned, so document order decides, and the field is first.
 *
 * `flex-1` is what `<body>`'s `flex min-h-full flex-col` needs to pin the
 * footer to the bottom on a short page.
 */
function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="relative flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}

export { SiteShell };
