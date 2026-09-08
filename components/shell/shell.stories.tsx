import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { BANDS } from "@/components/home/bands";
import { FOOTER_ROUTES, HEADER_LINKS } from "./nav";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";

/**
 * The shell — the header and the footer, which render on every route.
 *
 * These moved here out of `home.stories.tsx` when the components moved out of
 * `components/home/`. They are not the home page's any more.
 *
 * **Nothing here sets `bothThemes`, and it cannot.** The split view renders the
 * story twice into one canvas, and `<header>` is `banner` and `<footer>` is
 * `contentinfo` — two of either with the same accessible name in one document
 * is an axe `landmark-unique` violation, so a split story fails the run for a
 * reason that does not exist on the real page. It would also give the play
 * functions two of every element to choose from.
 *
 * Nothing is lost: the two Vitest story projects already render each of these
 * once in light and once in dark, which is where the enforcement comes from.
 *
 * No `ThemeProvider` anywhere — `components/theme-toggle.stories.tsx` explains
 * why adding one fights the decorator in `.storybook/preview.tsx`.
 */
const meta = {
  title: "Shell",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Four links: three bands and the News route. `pathname` is `/`, so nothing is
 * marked current — a band link never is, because "current" for a fragment is a
 * scroll position rather than a location.
 */
export const Header: Story = {
  parameters: { nextjs: { appDirectory: true, navigation: { pathname: "/" } } },
  render: () => <SiteHeader />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The brand goes to the front page, not to the top of this one. The
    // footer's *Top* link is the other job, and they were the same href while
    // there was only one page.
    expect(canvas.getByRole("link", { name: "Ivan Chaus" })).toHaveAttribute(
      "href",
      "/",
    );

    // Named `Site` rather than `Sections`, because it is no longer only
    // sections — one of the four is a route.
    const nav = canvas.getByRole("navigation", { name: "Site" });
    expect(within(nav).getAllByRole("link")).toHaveLength(HEADER_LINKS.length);

    // Every band link is root-relative, so it survives being clicked from a
    // route that is not `/`. This is the regression guard for that whole
    // change — it is the thing most likely to rot silently.
    for (const link of HEADER_LINKS) {
      const el = within(nav).getByRole("link", { name: link.title });
      expect(el).toHaveAttribute("href", link.href);
      if (link.kind === "band") expect(link.href.startsWith("/#")).toBe(true);
    }

    expect(canvas.queryByRole("link", { current: "page" })).toBeNull();

    // The theme control lives in the footer and nowhere else. A preference
    // switch does not earn a permanent seat in a 56px sticky bar.
    expect(canvas.queryByRole("group", { name: "Theme" })).toBeNull();
  },
};

/**
 * The same header on `/news`. The route link is marked with `aria-current` and
 * ink — and deliberately not with amber, which is spent four times already and
 * would be permanently lit here on two of the three routes.
 */
export const HeaderOnNews: Story = {
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/news" } },
  },
  render: () => <SiteHeader />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const current = canvas.getAllByRole("link", { current: "page" });
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveAccessibleName(/News/);
    expect(current[0]).toHaveAttribute("href", "/news");
    // Ink, not muted — and no amber at rest.
    expect(current[0]).toHaveClass("text-foreground");
  },
};

/** And on a dispatch page, where the route is still the current one. */
export const HeaderOnDispatch: Story = {
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/news/the-industrial-anchor" },
    },
  },
  render: () => <SiteHeader />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getAllByRole("link", { current: "page" })).toHaveLength(1);
  },
};

export const Footer: Story = {
  parameters: { nextjs: { appDirectory: true, navigation: { pathname: "/" } } },
  render: () => <SiteFooter />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The theme control lives here and only here. This assertion and the one
    // in `Header` are a pair — together they pin the decision, so moving the
    // toggle back into the header fails the run rather than passing quietly.
    const themeGroup = canvas.getByRole("group", { name: "Theme" });
    expect(within(themeGroup).getAllByRole("button")).toHaveLength(3);

    // Two navs, uniquely named. On a dispatch page this is the only full site
    // map, which is what makes it a site footer rather than a home-page one.
    const pages = canvas.getByRole("navigation", { name: "Pages" });
    expect(within(pages).getAllByRole("link")).toHaveLength(
      FOOTER_ROUTES.length,
    );

    const sections = canvas.getByRole("navigation", { name: "All sections" });
    const sectionLinks = within(sections).getAllByRole("link");
    expect(sectionLinks).toHaveLength(BANDS.length);
    for (const link of sectionLinks) {
      expect(link.getAttribute("href")).toMatch(/^\/#/);
    }

    expect(canvas.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );

    // Bare `#main`, not root-relative: every route has a `<main id="main">`,
    // and "top" means the top of the page you are on.
    expect(canvas.getByRole("link", { name: /Top/ })).toHaveAttribute(
      "href",
      "#main",
    );
  },
};
