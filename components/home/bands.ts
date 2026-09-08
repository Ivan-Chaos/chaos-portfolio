/**
 * The numbered bands, in page order.
 *
 * This is the *index*, not the source of a band's own heading — each band
 * declares its own id, figure and title locally, where they are read. What this
 * list is for is everything that has to know the page's shape without rendering
 * it: the shell's navs and the masthead index. A test asserts the two agree, so
 * they cannot drift apart silently.
 */
export const BANDS = [
  { id: "readout", index: "01", title: "Readout" },
  { id: "practice", index: "02", title: "Practice" },
  // Public titles, not the domain words: the page says Projects and
  // Experience, the code keeps engagement and role. The ids are anchors and
  // never changed by a retitle. See docs/specs/0006-portfolio-voice.md.
  { id: "engagements", index: "03", title: "Projects" },
  { id: "track-record", index: "04", title: "Experience" },
  { id: "capabilities", index: "05", title: "Capabilities" },
  { id: "education", index: "06", title: "Education" },
  // News is both: band 07 of this page, and the route `/news`. The id is a real
  // anchor because the band really exists, so the invariant above still holds —
  // what the shell links to is a separate decision, in components/shell/nav.ts.
  { id: "news", index: "07", title: "News" },
  { id: "contact", index: "08", title: "Contact" },
] as const;

export type BandId = (typeof BANDS)[number]["id"];

/**
 * The href for a link to a band.
 *
 * Root-relative from everywhere, and that is the whole rule — a bare
 * `#engagements` clicked from a route that is not `/` points at a fragment that
 * route does not have, so the click does nothing.
 *
 * It does not regress `/`. Next computes `onlyHashChange` by comparing pathname
 * and search (`client/components/segment-cache/navigation.js`), and
 * `shared/lib/router/utils/disable-smooth-scroll.js` returns early on that path
 * without touching `scroll-behavior`. So clicked from `/` this is still a
 * hash-only navigation: the smooth scroll applies and `Band`'s `scroll-mt-16`
 * still offsets the landing under the sticky header. Clicked from `/news` it is
 * a real route transition and lands instantly, which is correct for one.
 *
 * `#main` links are not band links and stay bare — the shell gives every route
 * a `<main id="main">`, and "top" means the top of the page you are on.
 */
export function bandHref(id: BandId) {
  return `/#${id}` as const;
}
