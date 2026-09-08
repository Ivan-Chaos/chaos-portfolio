import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Container } from "@/components/ui/layout";
import { Code } from "@/components/ui/typography";
import { dispatches } from "@/content/dispatches";
import type { Dispatch } from "@/content/schema";
import { DispatchArticle } from "./dispatch-article";
import { DispatchIndex } from "./dispatch-index";
import { DispatchList, DispatchRow } from "./dispatch-list";

/**
 * The news pages, and the row they are both built from.
 *
 * `Index` and `Article` are the only things that put these pages' markup under
 * axe — `app/news/page.tsx` and `app/news/[slug]/page.tsx` are composition
 * only and are never story-tested, so without these their contrast would be
 * unverified in both themes. The two Vitest story projects run each of them in
 * real Chromium, once light and once dark, with `parameters.a11y.test` set to
 * `error`.
 *
 * **Nothing here sets `bothThemes`.** Strictly, `<article>` maps to role
 * `article` and is not in axe's `landmark-unique` rule, so `Article` would
 * pass — but the split renders every story twice into one canvas, which gives
 * the play functions two of every element to choose from. One convention across
 * the page-level stories is worth more than one story's side-by-side
 * convenience. `News/Prose` is the exception, and it can be because it contains
 * no landmark and no duplicated query.
 *
 * No `ThemeProvider` — `components/theme-toggle.stories.tsx` explains why one
 * fights the decorator in `.storybook/preview.tsx`.
 */
const meta = {
  title: "News",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── The pages ───────────────────────────────────────────────────────────── */

/**
 * The index at its real width — `Container` at the default `max-w-5xl`, not
 * `prose`. A list is chrome rather than running text, the shell above it is at
 * the default width, and a row needs the room for a 10rem date track plus the
 * reserved cover track.
 */
export const Index: Story = {
  render: () => (
    <Container>
      <DispatchIndex />
    </Container>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      canvas.getByRole("heading", { level: 1, name: "News" }),
    ).toBeInTheDocument();

    const rows = canvasElement.querySelectorAll("[data-slot='dispatch-row']");
    expect(rows).toHaveLength(dispatches.length);

    for (const dispatch of dispatches) {
      // One link per row, named by the headline and nothing else. The date sits
      // outside the anchor precisely so it does not join the accessible name.
      const link = canvas.getByRole("link", { name: dispatch.title });
      expect(link).toHaveAttribute("href", `/news/${dispatch.slug}`);
      expect(link).toHaveAccessibleName(dispatch.title);
      expect(link.textContent).not.toContain(dispatch.publishedLabel);

      expect(
        canvas.getByRole("heading", { level: 2, name: dispatch.title }),
      ).toBeInTheDocument();
    }

    // A mixed list: some rows carry a cover, some do not, and both keep the
    // same three tracks so the headlines line up.
    expect(
      canvasElement.querySelectorAll("[data-slot='dispatch-cover']"),
    ).toHaveLength(dispatches.filter((dispatch) => dispatch.cover).length);
    for (const row of rows) expect(row.children).toHaveLength(3);
  },
};

/**
 * A dispatch page. The body here is hand-written JSX rather than a compiled
 * `.mdx` — Storybook does not compile MDX under `content/`, and `News/Prose`
 * is where the element map itself is exercised. What this story is for is the
 * article *header*: the chrome/prose boundary, and the way back.
 */
export const Article: Story = {
  render: () => (
    <Container width="prose">
      <DispatchArticle dispatch={dispatches[0]}>
        <p>
          A body paragraph, in the proportional face — the one sanctioned
          deviation, and the whole reason it exists.
        </p>
        <p>
          The header above is chrome, including the standfirst. Two sentences do
          not accumulate the way thirty paragraphs do, and a typeface change two
          lines under the title buys nothing.
        </p>
      </DispatchArticle>
    </Container>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const dispatch = dispatches[0];

    const title = canvas.getByRole("heading", { level: 1 });
    expect(title).toHaveAccessibleName(dispatch.title);
    expect(canvasElement.querySelector("article")).toHaveAttribute(
      "aria-labelledby",
      title.id,
    );

    // The boundary assertion, mirroring the `Practice` story on the home page.
    // If the standfirst ever picks up `prose-face`, the deviation has widened —
    // which CONTEXT.md calls a defect rather than an evolution.
    const prose = canvasElement.querySelector("[data-slot='prose']")!;
    expect(prose).toHaveClass("prose-face");
    expect(canvas.getByText(dispatch.standfirst)).not.toHaveClass("prose-face");

    // The date is a real `<time>`, and its label is stored rather than derived.
    const time = canvasElement.querySelector("[data-slot='kicker'] time")!;
    expect(time).toHaveAttribute("datetime", dispatch.published);

    const back = canvas.getAllByRole("link", { name: /All news/ });
    expect(back).toHaveLength(2);
    for (const link of back) expect(link).toHaveAttribute("href", "/news");
  },
};

/* ── The row on its own ──────────────────────────────────────────────────── */

const specimen: Dispatch = {
  slug: "a-specimen",
  title: "A dispatch with a cover",
  published: "2026-05-04",
  publishedLabel: "4 May 2026",
  standfirst:
    "A specimen record, so the row can be exercised without depending on which real dispatches happen to have covers.",
  topics: ["Specimen", "Covers"],
  cover: {
    src: "/news/anchor-plot.svg",
    alt: "A hairline plot of an eleven-step ink ramp.",
    width: 1200,
    height: 675,
  },
};

const bare: Dispatch = {
  ...specimen,
  slug: "a-bare-specimen",
  title: "A dispatch with no cover",
  standfirst:
    "The same row without a cover. The third grid track stays reserved, so this headline ends where the one above it does.",
  cover: undefined,
};

/**
 * Both states side by side, which is the point: the cover is optional and the
 * alignment is not. A row that reclaimed the empty track would make a mixed
 * list read as broken rather than as optional.
 *
 * Below `sm` the cover is dropped entirely — a 16:9 image stacked into a
 * phone-width row triples the row height for decoration, and this system
 * already scopes decoration to viewports with room for it.
 */
export const Rows: Story = {
  render: () => (
    <Container>
      <div className="py-10">
        <DispatchList>
          <DispatchRow dispatch={specimen} headingLevel={2} topics />
          <DispatchRow dispatch={bare} headingLevel={2} topics />
        </DispatchList>
      </div>
    </Container>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const rows = canvasElement.querySelectorAll("[data-slot='dispatch-row']");
    expect(rows).toHaveLength(2);
    for (const row of rows) {
      expect(row.children).toHaveLength(3);
      // The row is the target, so exactly one link — the topics are labels and
      // the cover is not separately clickable.
      expect(row.querySelectorAll("a")).toHaveLength(1);
    }

    expect(
      canvasElement.querySelectorAll("[data-slot='dispatch-cover']"),
    ).toHaveLength(1);

    // The stretched link: the anchor covers the row through `after:inset-0`,
    // and the row draws the focus outline because the row is the hit area.
    const link = canvas.getByRole("link", { name: specimen.title });
    expect(link).toHaveClass("after:absolute", "after:inset-0");
    link.focus();
    expect(link).toHaveFocus();
  },
};

/**
 * The same row at the level the home page band uses — `h3` under the band's
 * `h2`, and no topics, because the band is a teaser and badges between
 * Education and Contact are noise.
 */
export const RowInBand: Story = {
  render: () => (
    <Container>
      <div className="py-10">
        <DispatchList>
          <DispatchRow dispatch={specimen} />
          <DispatchRow dispatch={bare} />
        </DispatchList>
      </div>
    </Container>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(
      canvas.getByRole("heading", { level: 3, name: specimen.title }),
    ).toBeInTheDocument();
    expect(canvasElement.querySelectorAll("[data-slot='badge']")).toHaveLength(
      0,
    );
  },
};

/**
 * The row in both themes. Safe to split here, unlike `Index` and `Article`:
 * a list of rows is not a landmark, and the play function above is the one that
 * would have been confused by two copies.
 */
export const BothThemes: Story = {
  parameters: { bothThemes: true },
  render: () => (
    <div className="p-4">
      <DispatchList>
        <DispatchRow dispatch={specimen} headingLevel={2} topics />
        <DispatchRow dispatch={bare} headingLevel={2} topics />
      </DispatchList>
      <p className="mt-4 text-2xs text-muted-foreground">
        Hover a row for the <Code>latch</Code> — accent fill and the title to
        signal text, without the corner ticks a ruled row does not have.
      </p>
    </div>
  ),
};
