import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { BANDS } from "@/components/home/bands";
import { FOOTER_ROUTES, HEADER_LINKS } from "./nav";
import { SiteShell } from "./site-shell";

/**
 * The shell's own contract, independent of any page.
 *
 * It overlaps deliberately with `app/page.test.tsx`, which asserts the same
 * landmarks around the home page. The pair is the point: this file says the
 * shell provides them, that one says the page gets them. Either failing on its
 * own tells you which half moved.
 *
 * The reason it needs its own file at all is `app/news/[slug]/page.tsx`, which
 * is `async` and therefore untestable. Every landmark on a dispatch page comes
 * from here, so this is where they are checked.
 */

afterEach(cleanup);

describe("site shell", () => {
  it("exposes the three landmarks, in order, around its children", () => {
    const { container } = render(
      <SiteShell>
        <p>Page content</p>
      </SiteShell>,
    );

    // Queried as elements rather than by role, for the reason
    // `app/page.test.tsx` records: jsdom gives every `<header>` the `banner`
    // role, so a band header would match too. A real browser scopes `banner`
    // to a `<header>` outside `<section>` and `<main>`, and that is what axe
    // checks in the story projects.
    const [header, main, footer] = Array.from(container.children);

    expect(header.tagName).toBe("HEADER");
    expect(main.tagName).toBe("MAIN");
    expect(footer.tagName).toBe("FOOTER");

    expect(main).toContainElement(screen.getByText("Page content"));
  });

  it("gives the skip link a target that can actually take focus", () => {
    const { container } = render(
      <SiteShell>
        <p>Page content</p>
      </SiteShell>,
    );
    const [, main] = Array.from(container.children);

    // Without `tabIndex`, some browsers scroll to the target and leave focus at
    // the top of the document, so the next Tab starts over. See
    // components/ui/skip-link.tsx.
    expect(main).toHaveAttribute("id", "main");
    expect(main).toHaveAttribute("tabindex", "-1");
  });

  it("links every band root-relative and leaves #main bare", () => {
    render(
      <SiteShell>
        <p>Page content</p>
      </SiteShell>,
    );

    // A band lives on the home page, so a link to one has to survive being
    // clicked from a route that is not `/`. `#main` is not a band link: the
    // shell gives every route a `<main id="main">`, so "top" is page-relative.
    for (const name of ["Site", "All sections"]) {
      const nav = within(screen.getByRole("navigation", { name }));
      for (const link of nav.getAllByRole("link")) {
        const href = link.getAttribute("href")!;
        if (!href.includes("#")) continue;
        expect(href.startsWith("/#")).toBe(true);
      }
    }

    expect(screen.getByRole("link", { name: /Top/ })).toHaveAttribute(
      "href",
      "#main",
    );
  });

  it("names all four navs uniquely", () => {
    render(
      <SiteShell>
        <p>Page content</p>
      </SiteShell>,
    );

    // axe's `landmark-unique` counts every nav on the page. The masthead index
    // is the fourth and belongs to the home page, so it is not asserted here —
    // `app/page.test.tsx` covers the full set.
    const names = screen
      .getAllByRole("navigation")
      .map((nav) => nav.getAttribute("aria-label"));

    expect(names).toContain("Site");
    expect(names).toContain("Pages");
    expect(names).toContain("All sections");
    expect(new Set(names).size).toBe(names.length);
  });

  it("lists the routes and every band", () => {
    render(
      <SiteShell>
        <p>Page content</p>
      </SiteShell>,
    );

    const header = within(screen.getByRole("navigation", { name: "Site" }));
    expect(header.getAllByRole("link")).toHaveLength(HEADER_LINKS.length);

    const pages = within(screen.getByRole("navigation", { name: "Pages" }));
    expect(pages.getAllByRole("link")).toHaveLength(FOOTER_ROUTES.length);

    const sections = within(
      screen.getByRole("navigation", { name: "All sections" }),
    );
    expect(sections.getAllByRole("link")).toHaveLength(BANDS.length);
  });

  it("sends the brand to the front page, not to the top of this one", () => {
    render(
      <SiteShell>
        <p>Page content</p>
      </SiteShell>,
    );

    // Two different jobs, conflated while there was one page. The brand means
    // "the site's front page"; the footer's Top link means "the top of the page
    // you are on".
    expect(screen.getByRole("link", { name: "Ivan Chaus" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("marks nothing current with no router in scope", () => {
    render(
      <SiteShell>
        <p>Page content</p>
      </SiteShell>,
    );

    // `usePathname()` is `useContext(PathnameContext)` and returns `null`
    // outside a router, rather than throwing — which is what lets the nav be a
    // client component and still render here. The current-route marking itself
    // is covered by `shell.stories.tsx`, which can set a pathname.
    expect(screen.queryByRole("link", { current: "page" })).toBeNull();
  });
});
