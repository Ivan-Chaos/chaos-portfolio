import { BANDS, bandHref, type BandId } from "@/components/home/bands";

/**
 * What the shell links to, and the one place the two kinds of destination are
 * distinguished.
 *
 * **No `"use client"` in this module, deliberately.** `SiteNav` is a client
 * component and `SiteHeader` and `SiteFooter` are not, and all three import
 * from here. `components/motion/stagger.ts` documents the trap: a constant
 * exported from a `"use client"` module arrives in a server component as a
 * client *reference* object, so `clsx` finds no truthy keys and the class
 * silently never reaches the DOM. The same mechanism would empty these lists.
 *
 * A **band** is a fragment of the home page: its id is an anchor a `<section>`
 * exists for, and its href is root-relative so it survives being clicked from a
 * route that is not `/`. A **route** is a page of its own and carries no
 * fragment at all. Keeping both in one array behind a `kind` is what stops a
 * route id being pushed into `BANDS`, where every id is an anchor the page test
 * demands a section for.
 */
export type ShellLink = {
  kind: "band" | "route";
  id: string;
  /** The display figure. `aria-hidden` wherever it is rendered. */
  index: string;
  title: string;
  href: string;
};

const band = (id: BandId): ShellLink => {
  const entry = BANDS.find((candidate) => candidate.id === id)!;
  return { kind: "band", ...entry, href: bandHref(id) };
};

/**
 * A route link reads its title and figure from `BANDS` on purpose: retitling
 * the band retitles the header, and there is one source for the string.
 *
 * The figure is the band's own — News really is band 07 of the site's one
 * indexed page. It is `aria-hidden` decoration whose only job is making the rows
 * read as a column of indexed entries, and a route with no figure would leave
 * the header ragged. Do not "fix" it by dropping it.
 */
const route = (id: BandId, href: string): ShellLink => {
  const entry = BANDS.find((candidate) => candidate.id === id)!;
  return { kind: "route", ...entry, href };
};

/**
 * The four in the header.
 *
 * Four rather than three because News is a route, and a route is the one kind of
 * destination nothing else on a page can reach. At `sm` the container leaves
 * roughly 600px; the brand takes about 85px and the four links with their
 * figures visible take about 390px including gaps, so they fit with room. Still
 * no hamburger: a `Sheet` for four links is the same machinery in place of a
 * decision it was for three.
 */
export const HEADER_LINKS: readonly ShellLink[] = [
  band("engagements"),
  band("track-record"),
  route("news", "/news"),
  band("contact"),
];

/**
 * The two that survive below `sm`, where four cannot fit — at 390px three
 * already landed within a few pixels of the gutter. Below `sm` the figures are
 * hidden, so the pair renders as bare "News" and "Contact".
 *
 * **News**, because it is the only route in the list. Every other link is a
 * fragment of `/`, and on `/news/<slug>` there is no masthead index at all —
 * below `sm` the header is the entire navigation, and "back to the list" is the
 * most-wanted link on an article.
 *
 * **Contact**, because it was the one that survived before this and dropping it
 * would be a regression nobody asked for. Projects and Experience are both in
 * the masthead index, one screen from the top of `/`, and in the footer.
 */
export const COMPACT_HEADER_LINKS: readonly string[] = ["news", "contact"];

/** The routes, for the footer's site map. Not bands, so not in `BANDS`. */
export const FOOTER_ROUTES = [
  { id: "home", title: "Home", href: "/" },
  { id: "news", title: "News", href: "/news" },
] as const;

/**
 * Whether a link points at the page currently open.
 *
 * A band link is never current: it points *into* a page, and "current" for a
 * fragment is a scroll position rather than a location. `pathname` is nullable
 * because `usePathname()` is `useContext(PathnameContext)` and returns `null`
 * with no router provider — which is what lets the nav render under jsdom with
 * nothing marked current, rather than throwing.
 */
export function isCurrentRoute(link: ShellLink, pathname: string | null) {
  if (link.kind !== "route" || !pathname) return false;
  return pathname === link.href || pathname.startsWith(`${link.href}/`);
}
