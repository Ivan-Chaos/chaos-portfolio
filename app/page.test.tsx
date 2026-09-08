import { cleanup, render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { BANDS } from "@/components/home/bands";
import { SiteShell } from "@/components/shell/site-shell";
import { FOOTER_ROUTES, HEADER_LINKS } from "@/components/shell/nav";
import { dispatches, LATEST_DISPATCH_COUNT } from "@/content/dispatches";
import { capabilities } from "@/content/capabilities";
import { credentials } from "@/content/education";
import { engagements } from "@/content/engagements";
import { instruments } from "@/content/instruments";
import { email } from "@/content/profile";
import { readings } from "@/content/readings";
import { roles } from "@/content/roles";
import Home from "./page";

/**
 * The whole page, rendered.
 *
 * This is possible because every band and the page itself are **synchronous**
 * server components — `AGENTS.md` rules out unit-testing async ones, and
 * staying synchronous is a deliberate capability rather than an accident.
 *
 * Wrapped in `SiteShell` because that is what the page is. The header,
 * `<main>` and the footer moved to `app/layout.tsx` when the site gained a
 * second route (docs/adr/0007), and `RootLayout` renders `<html>`/`<body>` so
 * it cannot go through Testing Library. `SiteShell` returns a fragment of
 * exactly those three landmarks, which is what keeps the assertions below
 * working unchanged.
 *
 * What is asserted here is structure, not appearance: landmarks, the heading
 * outline, accessible names, and the one guarantee that would lose the entire
 * page if it broke. Contrast and layout are covered by the story projects,
 * which run in a real browser in both themes.
 */

class NoopIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: readonly number[] = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

beforeEach(() => {
  vi.stubGlobal("IntersectionObserver", NoopIntersectionObserver);
  // Reduced motion, so nothing rewrites text mid-assertion. The motion
  // primitives have their own suite for the animating path.
  window.matchMedia = ((query: string) => ({
    matches: query.includes("reduce"),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

/** The page as a reader gets it: the shell's landmarks around the page's bands. */
function renderPage() {
  return render(
    <SiteShell>
      <Home />
    </SiteShell>,
  );
}

describe("home page", () => {
  it("hides nothing in server-rendered output", () => {
    const html = renderToStaticMarkup(
      <SiteShell>
        <Home />
      </SiteShell>,
    );

    // The guarantee: with scripting off, a failed hydration, or a crawler that
    // never runs a script, every band is visible.
    //
    // Two halves. The attribute the hiding variants key on is written by script
    // and so cannot appear in server output at all. And every `opacity-0` in
    // the markup must be behind one of those variants — a bare one, or one
    // behind any other variant, would hide content unconditionally.
    expect(html).not.toContain("data-reveal-armed=");

    const hidingTokens = [...html.matchAll(/class="([^"]*)"/g)]
      .flatMap(([, value]) => value.split(/\s+/))
      .filter((token) => token === "opacity-0" || token.endsWith(":opacity-0"));

    // The mechanism has to actually be present, or this test passes on a page
    // that simply lost its reveals.
    expect(hidingTokens.length).toBeGreaterThan(0);
    for (const token of hidingTokens) {
      expect(token).toContain("reveal-armed");
    }

    // And the content really is present, not merely un-hidden.
    for (const engagement of engagements) {
      expect(html).toContain(engagement.name);
    }
    for (const reading of readings) {
      expect(html).toContain(reading.hint);
    }
  });

  it("has one top-level heading, named as written", () => {
    renderPage();

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    // Not a half-resolved string: the name comes from the visually-hidden copy
    // beside the animating node, so it is stable at every frame.
    expect(headings[0]).toHaveAccessibleName("Ivan Chaus");
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

  it("exposes the three page landmarks, in order", () => {
    const { container } = renderPage();

    // All three come from `SiteShell` now rather than from the page.
    // Queried as elements rather than by role on purpose. jsdom's role mapping
    // gives every `<header>` the `banner` role, so the seven band headers all
    // match — a real browser scopes `banner` to a `<header>` that is not inside
    // `<section>` or `<main>`, and that is what axe checks in the story
    // projects. Asserting the element tree here says the same thing without
    // encoding jsdom's approximation.
    const [header, main, footer] = Array.from(container.children);

    expect(header.tagName).toBe("HEADER");
    expect(main.tagName).toBe("MAIN");
    expect(footer.tagName).toBe("FOOTER");

    // Focusable, or the skip link moves the scroll position and leaves focus
    // at the top of the document.
    expect(main).toHaveAttribute("id", "main");
    expect(main).toHaveAttribute("tabindex", "-1");
  });

  it("makes every band a named region", () => {
    const { container } = renderPage();

    const sections = Array.from(
      container.querySelectorAll("section[data-slot='section']"),
    );
    // Against `BANDS` rather than a literal, so the count cannot drift a
    // second time — adding a band and forgetting the index is the failure the
    // assertion below catches, and this one should not need editing for it.
    expect(sections).toHaveLength(BANDS.length);

    for (const section of sections) {
      expect(section.id).not.toBe("");
      const labelledBy = section.getAttribute("aria-labelledby");
      expect(labelledBy).toBe(`${section.id}-title`);
      expect(container.querySelector(`#${labelledBy}`)).not.toBeNull();
    }

    // The index is a separate list from the bands themselves, so it can drift.
    // This is what stops a band being added with nothing pointing at it — or
    // an index entry outliving the band it names, which is a link to nowhere.
    expect(sections.map((section) => section.id)).toEqual(
      BANDS.map((band) => band.id),
    );
  });

  it("points every index entry at a band that exists", () => {
    renderPage();

    // Four navs list destinations: the header, the masthead index, and the
    // footer's routes and sections. All read the same source, and all are
    // checked here against what actually rendered.
    const routes = new Set<string>([
      ...FOOTER_ROUTES.map((route) => route.href),
      ...HEADER_LINKS.filter((link) => link.kind === "route").map(
        (link) => link.href,
      ),
    ]);

    for (const name of ["Site", "Page index", "All sections", "Pages"]) {
      const nav = within(screen.getByRole("navigation", { name }));
      for (const link of nav.getAllByRole("link")) {
        const href = link.getAttribute("href")!;
        // Band links carry a fragment; route links do not. Splitting on "#"
        // rather than stripping it is what makes a root-relative `/#id` work —
        // `replace("#", "")` would yield "/engagements" and find nothing.
        const [, hash] = href.split("#");
        if (!hash) {
          expect(routes.has(href)).toBe(true);
          continue;
        }
        expect(document.getElementById(hash)).not.toBeNull();
      }
    }

    // These two are the whole page's shape, so they list every band and
    // nothing else. News appears in them as band 07, not as the route.
    for (const label of ["Page index", "All sections"]) {
      const nav = within(screen.getByRole("navigation", { name: label }));
      expect(nav.getAllByRole("link")).toHaveLength(BANDS.length);
    }
  });

  it("links every band root-relative", () => {
    renderPage();

    // The regression guard for the shell's anchors. A bare "#engagements" works
    // on this page and points at nothing from `/news`, so the failure this
    // catches is invisible from here — which is exactly why it is asserted.
    for (const name of ["Site", "Page index", "All sections"]) {
      const nav = within(screen.getByRole("navigation", { name }));
      for (const link of nav.getAllByRole("link")) {
        const href = link.getAttribute("href")!;
        if (!href.includes("#")) continue;
        expect(href.startsWith("/#")).toBe(true);
      }
    }
  });

  it("puts the theme control in the footer and nowhere else", () => {
    const { container } = renderPage();

    const groups = screen.getAllByRole("group", { name: "Theme" });
    expect(groups).toHaveLength(1);

    const [, , footer] = Array.from(container.children);
    expect(footer.contains(groups[0])).toBe(true);
  });

  it("gives every link an accessible name", () => {
    renderPage();

    const links = screen.getAllByRole("link");
    expect(links.length).toBeGreaterThan(5);
    for (const link of links) {
      expect(link).toHaveAccessibleName();
      expect(link.getAttribute("href")).toBeTruthy();
    }
  });

  it("opens external links safely and says so", () => {
    renderPage();

    for (const link of screen.getAllByRole("link")) {
      const href = link.getAttribute("href") ?? "";
      if (!href.startsWith("http")) continue;

      expect(link).toHaveAttribute("target", "_blank");
      // `noopener` because a new tab otherwise gets a handle back to this
      // window; `noreferrer` so the referrer does not leak.
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(link).toHaveAccessibleName(/opens in a new tab/);
    }
  });

  it("treats the mail link as a link, not a new tab", () => {
    renderPage();

    const mailLinks = screen
      .getAllByRole("link")
      .filter((link) => link.getAttribute("href") === `mailto:${email}`);

    expect(mailLinks.length).toBeGreaterThan(0);
    for (const link of mailLinks) {
      expect(link).not.toHaveAttribute("target");
      expect(link.textContent).not.toMatch(/opens in a new tab/);
    }
  });

  it("renders each reading as a term and a definition", () => {
    const { container } = renderPage();
    const readout = container.querySelector("#readout")!;

    expect(within(readout as HTMLElement).getAllByRole("term")).toHaveLength(
      readings.length,
    );
    for (const reading of readings) {
      expect(
        within(readout as HTMLElement).getByText(reading.label),
      ).toBeInTheDocument();
    }
  });

  it("shows the three latest dispatches and a way to all of them", () => {
    const { container } = renderPage();
    const band = container.querySelector("#news")!;

    const rows = band.querySelectorAll("[data-slot='dispatch-row']");
    expect(rows).toHaveLength(LATEST_DISPATCH_COUNT);

    expect(
      within(band as HTMLElement).getByRole("link", { name: /All news/ }),
    ).toHaveAttribute("href", "/news");
  });

  it("names each dispatch link by its headline alone", () => {
    const { container } = renderPage();
    const band = within(container.querySelector("#news") as HTMLElement);

    // The date sits outside the anchor precisely so it does not join the
    // accessible name. "24 Aug 2026 One direction, held" is not what this link
    // is called, and `toHaveAccessibleName` with an exact string is what pins
    // it — the stretched-link pattern is easy to "simplify" into wrapping the
    // whole row, which would break this and nothing else.
    for (const dispatch of dispatches.slice(0, LATEST_DISPATCH_COUNT)) {
      const link = band.getByRole("link", { name: dispatch.title });
      expect(link).toHaveAttribute("href", `/news/${dispatch.slug}`);
      expect(link).toHaveAccessibleName(dispatch.title);
      expect(
        band.getByRole("heading", { level: 3, name: dispatch.title }),
      ).toBeInTheDocument();
    }
  });

  it("marks exactly one role as current", () => {
    const { container } = renderPage();

    const items = container.querySelectorAll("[data-slot='timeline-item']");
    expect(items).toHaveLength(roles.length);
    expect(container.querySelectorAll("[data-current]")).toHaveLength(1);
  });

  it("renders every engagement, credential, instrument and capability group", () => {
    const { container } = renderPage();

    for (const engagement of engagements) {
      expect(
        screen.getByRole("heading", { name: engagement.name }),
      ).toBeInTheDocument();
    }
    for (const credential of credentials) {
      expect(
        screen.getByRole("heading", { name: credential.qualification }),
      ).toBeInTheDocument();
    }
    for (const instrument of instruments) {
      expect(
        screen.getByRole("heading", { name: instrument.label }),
      ).toBeInTheDocument();
    }
    // Scoped to the inventory list: an instrument card may share a capability
    // group's name ("State & data" does), so the page-wide query is ambiguous
    // by design rather than by accident.
    const inventory = container.querySelector(
      "#capabilities [data-slot='readout-list']",
    )!;
    for (const capability of capabilities) {
      expect(
        within(inventory as HTMLElement).getByText(capability.label),
      ).toBeInTheDocument();
    }
  });
});
