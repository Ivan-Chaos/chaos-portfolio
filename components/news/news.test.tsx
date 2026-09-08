import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { dispatches } from "@/content/dispatches";
import type { Dispatch } from "@/content/schema";
import { DispatchArticle } from "./dispatch-article";
import { DispatchList, DispatchRow } from "./dispatch-list";

/**
 * The news components in isolation.
 *
 * `DispatchArticle` is here rather than in a route test because
 * `app/news/[slug]/page.tsx` is `async` and AGENTS.md rules out unit-testing an
 * async server component. That page holds nothing but a slug lookup and the
 * body import; everything it renders is asserted here.
 *
 * The row specimens are local rather than taken from `content/dispatches.ts`
 * because the cover is optional — a test that read real content would stop
 * covering the absent path the day a cover was added to every dispatch.
 */

const withCover: Dispatch = {
  slug: "with-cover",
  title: "A dispatch with a cover",
  published: "2026-05-04",
  publishedLabel: "4 May 2026",
  standfirst: "A specimen record, so the row can be exercised on its own.",
  topics: ["Specimen", "Covers"],
  cover: {
    src: "/news/anchor-plot.svg",
    alt: "A hairline plot.",
    width: 1200,
    height: 675,
  },
};

const withoutCover: Dispatch = {
  ...withCover,
  slug: "without-cover",
  title: "A dispatch with no cover",
  cover: undefined,
};

afterEach(cleanup);

describe("dispatch row", () => {
  it("puts the whole row behind one link named by the headline", () => {
    const { container } = render(
      <DispatchList>
        <DispatchRow dispatch={withCover} headingLevel={2} topics />
      </DispatchList>,
    );

    const links = container.querySelectorAll("a");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAttribute("href", "/news/with-cover");
    // The name is the headline and nothing else. The date, the standfirst and
    // the topics are row content, not link text — which is the whole reason the
    // anchor wraps only the title and stretches with `after:inset-0` rather
    // than wrapping everything and overriding the name.
    expect(links[0]).toHaveAccessibleName(withCover.title);
    expect(links[0]).toHaveClass("after:absolute", "after:inset-0");
  });

  it("takes its heading level from the prop and its size from the level", () => {
    // `2` on `/news`, under the page `h1`; `3` in the home band, under its
    // `h2`. A headline directly under a page title sets larger, and that
    // follows the level rather than taking a third prop.
    const { container: index } = render(
      <DispatchRow dispatch={withCover} headingLevel={2} />,
    );
    expect(index.querySelector("h2")).toHaveClass("text-lg");

    cleanup();

    const { container: band } = render(<DispatchRow dispatch={withCover} />);
    expect(band.querySelector("h3")).toHaveClass("text-base");
  });

  it("stores the date twice and derives neither from the clock", () => {
    const { container } = render(<DispatchRow dispatch={withCover} />);

    const time = container.querySelector("time")!;
    expect(time).toHaveAttribute("datetime", "2026-05-04");
    expect(time.textContent).toBe("4 May 2026");
  });

  it("shows topics only when asked", () => {
    const { container: bare } = render(<DispatchRow dispatch={withCover} />);
    expect(bare.querySelectorAll("[data-slot='badge']")).toHaveLength(0);

    cleanup();

    const { container: full } = render(
      <DispatchRow dispatch={withCover} topics />,
    );
    const badges = full.querySelectorAll("[data-slot='badge']");
    expect(badges).toHaveLength(withCover.topics.length);
    // Labels, never links: there are no topic archives, and a badge that reads
    // as clickable and is not is the defect the engagement card avoided.
    for (const badge of badges) {
      expect(badge.closest("a")).toBeNull();
    }
  });

  it("reserves the cover track whether or not there is a cover", () => {
    const { container } = render(
      <DispatchList>
        <DispatchRow dispatch={withCover} />
        <DispatchRow dispatch={withoutCover} />
      </DispatchList>,
    );

    // Three grid children either way, so every headline in a list starts and
    // ends at the same x. A row that reclaimed the space would make a mixed
    // list read as broken rather than as optional.
    for (const row of container.querySelectorAll(
      "[data-slot='dispatch-row']",
    )) {
      expect(row.children).toHaveLength(3);
    }

    expect(
      container.querySelectorAll("[data-slot='dispatch-cover']"),
    ).toHaveLength(1);
  });

  it("is an ordered list, because the order is the information", () => {
    const { container } = render(
      <DispatchList>
        <DispatchRow dispatch={withCover} />
        <DispatchRow dispatch={withoutCover} />
      </DispatchList>,
    );

    const list = container.querySelector("[data-slot='dispatch-list']")!;
    expect(list.tagName).toBe("OL");
    expect(list.children).toHaveLength(2);
  });
});

describe("dispatch article", () => {
  const dispatch = dispatches[0];

  function renderArticle() {
    return render(
      <DispatchArticle dispatch={dispatch}>
        <h2>A body heading</h2>
        <p>A body paragraph.</p>
      </DispatchArticle>,
    );
  }

  it("makes the title the only h1, and names the article by it", () => {
    const { container } = renderArticle();

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveAccessibleName(dispatch.title);

    // `<article aria-labelledby>` is already the right element with the right
    // role, which is why this is not a `Section` — that would have named the
    // region identically to the heading it points at.
    const article = container.querySelector("article")!;
    expect(article).toHaveAttribute("aria-labelledby", headings[0].id);
  });

  it("never skips a heading level into the body", () => {
    const { container } = renderArticle();

    const levels = Array.from(
      container.querySelectorAll("h1, h2, h3, h4, h5, h6"),
    ).map((heading) => Number(heading.tagName[1]));

    // The element map starts bodies at `h2` for exactly this reason, and a
    // content test forbids a leading `# ` in an `.mdx`.
    expect(levels).toEqual([1, 2]);
  });

  it("keeps the body in prose and the metadata in chrome", () => {
    const { container } = renderArticle();

    // The one sanctioned use of the proportional face. If the standfirst ever
    // picks this up, the deviation has widened — which CONTEXT.md calls a
    // defect rather than an evolution.
    const prose = container.querySelector("[data-slot='prose']")!;
    expect(prose).toHaveClass("prose-face");
    expect(prose).toContainElement(screen.getByText("A body paragraph."));

    const standfirst = screen.getByText(dispatch.standfirst);
    expect(standfirst).not.toHaveClass("prose-face");
    expect(prose).not.toContainElement(standfirst);
  });

  it("carries the date in the kicker, marked up as a time", () => {
    const { container } = renderArticle();

    const time = container.querySelector("[data-slot='kicker'] time")!;
    expect(time).toHaveAttribute("datetime", dispatch.published);
    expect(time.textContent).toBe(dispatch.publishedLabel);
  });

  it("offers the way back twice, and not as a new tab", () => {
    renderArticle();

    // "Back" is the most-wanted action after a long read, and scrolling up to
    // find it is not an answer. "All news" rather than "News" so it does not
    // collide in meaning with the header's News link.
    const back = screen.getAllByRole("link", { name: /All news/ });
    expect(back).toHaveLength(2);
    for (const link of back) {
      expect(link).toHaveAttribute("href", "/news");
      expect(link).not.toHaveAttribute("target");
    }
  });

  it("renders every topic once, in the header", () => {
    const { container } = renderArticle();

    const header = within(container.querySelector("header") as HTMLElement);
    for (const topic of dispatch.topics) {
      expect(header.getByText(topic)).toBeInTheDocument();
    }
  });

  it("puts the cover outside the prose measure", () => {
    const { container } = renderArticle();
    const cover = container.querySelector("[data-slot='dispatch-cover']");

    if (!dispatch.cover) {
      expect(cover).toBeNull();
      return;
    }

    // `Prose` caps at 68ch, so a cover inside it would be narrowed to the text
    // measure rather than spanning the column.
    expect(cover).not.toBeNull();
    expect(container.querySelector("[data-slot='prose']")).not.toContainElement(
      cover as HTMLElement,
    );
  });
});
