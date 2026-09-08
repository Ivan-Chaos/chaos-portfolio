import { cleanup, render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";
import { SiteShell } from "@/components/shell/site-shell";
import { dispatches } from "@/content/dispatches";
import News from "./page";

/**
 * The whole index, rendered.
 *
 * Possible for the same reason `app/page.test.tsx` is possible: this page and
 * `DispatchIndex` are both **synchronous** server components, and the page
 * takes no props. That is the capability docs/adr/0008 exists to protect — the
 * alternative, metadata inside the MDX, would have made this page async and
 * this file impossible.
 *
 * Its sibling `/news/[slug]` is async and gets no test. See that file.
 */

/**
 * React escapes text nodes, so an apostrophe in a standfirst arrives in the
 * markup as `&#x27;` and a naive `toContain` against the source string misses
 * it. Mirroring that escaping is more honest than avoiding apostrophes in the
 * content, which is the other way this assertion could be made to pass.
 */
function asRendered(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

function renderPage() {
  return render(
    <SiteShell>
      <News />
    </SiteShell>,
  );
}

afterEach(cleanup);

describe("news index", () => {
  it("hides nothing in server-rendered output", () => {
    const html = renderToStaticMarkup(
      <SiteShell>
        <News />
      </SiteShell>,
    );

    // A stronger guarantee than the home page's, and deliberately so: this
    // route composes no `Reveal` at all, so there is no legitimate reason for
    // an `opacity-0` to appear anywhere in its markup. The home page can only
    // assert that every one sits behind the armed variant.
    expect(html).not.toContain("opacity-0");
    expect(html).not.toContain("data-reveal-armed=");

    for (const dispatch of dispatches) {
      expect(html).toContain(asRendered(dispatch.title));
      expect(html).toContain(asRendered(dispatch.standfirst));
    }
  });

  it("has one top-level heading", () => {
    renderPage();

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveAccessibleName("News");
  });

  it("never skips a heading level", () => {
    const { container } = renderPage();

    const levels = Array.from(
      container.querySelectorAll("h1, h2, h3, h4, h5, h6"),
    ).map((heading) => Number(heading.tagName[1]));

    expect(levels[0]).toBe(1);
    for (let i = 1; i < levels.length; i += 1) {
      expect(levels[i] - levels[i - 1]).toBeLessThanOrEqual(1);
    }
  });

  it("renders every dispatch as a row, newest first", () => {
    const { container } = renderPage();

    const rows = Array.from(
      container.querySelectorAll("[data-slot='dispatch-row']"),
    );
    expect(rows).toHaveLength(dispatches.length);

    // Order asserted as *rendered*, not just in the data. `content.test.ts`
    // proves the array is sorted; this proves the page did not re-sort it.
    const hrefs = rows.map((row) =>
      row.querySelector("a")!.getAttribute("href"),
    );
    expect(hrefs).toEqual(dispatches.map((d) => `/news/${d.slug}`));
  });

  it("names each row's link by its headline alone", () => {
    const { container } = renderPage();
    const list = within(
      container.querySelector("[data-slot='dispatch-list']") as HTMLElement,
    );

    for (const dispatch of dispatches) {
      const link = list.getByRole("link", { name: dispatch.title });
      expect(link).toHaveAttribute("href", `/news/${dispatch.slug}`);
      // The date is a sibling of the anchor, not inside it, which is the whole
      // reason the stretched-link pattern was chosen over wrapping the row.
      expect(link).toHaveAccessibleName(dispatch.title);
      expect(link.textContent).not.toContain(dispatch.publishedLabel);
    }
  });

  it("gives each row exactly one link", () => {
    const { container } = renderPage();

    for (const row of container.querySelectorAll(
      "[data-slot='dispatch-row']",
    )) {
      // Topics are badges and covers are images — neither is a link, because
      // there are no topic archives and the row already goes somewhere.
      expect(row.querySelectorAll("a")).toHaveLength(1);
    }
  });

  it("marks up every date as a machine-readable time", () => {
    const { container } = renderPage();

    const times = Array.from(
      container.querySelectorAll("[data-slot='dispatch-row'] time"),
    );
    expect(times.map((time) => time.getAttribute("datetime"))).toEqual(
      dispatches.map((dispatch) => dispatch.published),
    );
    expect(times.map((time) => time.textContent)).toEqual(
      dispatches.map((dispatch) => dispatch.publishedLabel),
    );
  });

  it("shows a topic badge for every topic", () => {
    const { container } = renderPage();

    // The index shows topics; the home band does not. That difference is the
    // `topics` prop, and asserting both is what keeps it meaningful.
    const badges = container.querySelectorAll(
      "[data-slot='dispatch-row'] [data-slot='badge']",
    );
    expect(badges).toHaveLength(
      dispatches.reduce((total, d) => total + d.topics.length, 0),
    );
  });

  it("renders a cover only where there is one", () => {
    const { container } = renderPage();

    expect(
      container.querySelectorAll("[data-slot='dispatch-cover']"),
    ).toHaveLength(dispatches.filter((dispatch) => dispatch.cover).length);
  });

  it("gives every link an accessible name", () => {
    renderPage();

    for (const link of screen.getAllByRole("link")) {
      expect(link).toHaveAccessibleName();
      expect(link.getAttribute("href")).toBeTruthy();
    }
  });

  it("marks nothing current with no router in scope", () => {
    renderPage();

    // `usePathname()` returns `null` with no router in scope, so nothing is
    // marked here — the real marking is covered by `shell.stories.tsx`, which
    // can set a pathname. This asserts the absence rather than pretending
    // otherwise: a test that expected `aria-current` here would be asserting
    // jsdom's lack of a router, not the feature.
    expect(screen.queryAllByRole("link", { current: "page" })).toHaveLength(0);
  });
});
