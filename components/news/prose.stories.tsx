import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Container } from "@/components/ui/layout";
import { Code, Prose } from "@/components/ui/typography";
import { dispatchProse } from "./prose-components";

/**
 * Every element a dispatch body can produce, rendered through the map that
 * `mdx-components.tsx` installs.
 *
 * This story is the reason the map lives in `components/news/` rather than in
 * the root `mdx-components.tsx`. Nothing in `.storybook/` or
 * `vitest.config.mts` knows how to compile MDX, and no Vitest project ever
 * resolves an `.mdx` under `content/` — that confinement is what docs/adr/0008
 * buys. Keeping the map importable from plain TSX is what puts every element
 * under axe in both themes anyway, without any of that having to change.
 *
 * So the specimen below is written as JSX rather than authored as markdown. It
 * is the same components MDX resolves to, in the same `Prose` wrapper. What
 * this deliberately cannot catch is a compile failure in a real body: `next
 * build` is the gate for that, as the article route's docstring says.
 *
 * `bothThemes` is safe here, unlike the band and shell stories — there is no
 * landmark in this tree, so rendering it twice cannot trip axe's
 * `landmark-unique`.
 */
const meta = {
  title: "News/Prose",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The map, retyped for JSX.
 *
 * `MDXComponents` types every value against MDX's own element props, which are
 * wider than the intrinsic props used here — so one cast at the boundary keeps
 * the specimen itself plain JSX rather than scattering casts through it.
 */
const M = dispatchProse as unknown as {
  h2: React.FC<React.ComponentProps<"h2">>;
  h3: React.FC<React.ComponentProps<"h3">>;
  h4: React.FC<React.ComponentProps<"h4">>;
  ul: React.FC<React.ComponentProps<"ul">>;
  ol: React.FC<React.ComponentProps<"ol">>;
  li: React.FC<React.ComponentProps<"li">>;
  blockquote: React.FC<React.ComponentProps<"blockquote">>;
  pre: React.FC<React.ComponentProps<"pre">>;
  a: React.FC<React.ComponentProps<"a">>;
  hr: React.FC<React.ComponentProps<"hr">>;
  figure: React.FC<React.ComponentProps<"figure">>;
  figcaption: React.FC<React.ComponentProps<"figcaption">>;
};

const SAMPLE = `export const dispatches: readonly Dispatch[] = [
  { slug: "one-deviation", title: "Monospace everywhere" },
];`;

/**
 * The full specimen. Read it for the chrome/prose boundary as much as for the
 * rhythm: the paragraphs set in Archivo, and the headings, both list markers,
 * the fence, the inline code and the caption all stay in JetBrains Mono.
 */
export const Elements: Story = {
  render: () => (
    <Container width="prose">
      <Prose className="py-10">
        <p>
          A paragraph, which is the only thing here that sets in the
          proportional face. It runs long enough to show the measure, because
          unbounded line length is the readability problem the face switch was
          made to solve in the first place.
        </p>
        <p>
          A second paragraph, to show that the space between them comes from{" "}
          <Code>Prose</Code> rather than from the element map — a descendant
          rule that outranks anything the map could set on the element itself.
          Emphasis is <em>a real italic</em> rather than a sheared roman, which
          is why the font loader asks for one, and <strong>strong</strong> is a
          weight the wrapper sets.
        </p>

        <M.h2>A level-two heading</M.h2>
        <p>
          Headings are chrome. They set in the monospace face through{" "}
          <Code>Heading</Code>&rsquo;s own <Code>font-heading</Code>, which is
          the rule holding rather than an oversight.
        </p>

        <M.h3>A level-three heading</M.h3>
        <p>
          A body never produces an <Code>h1</Code> — that is the dispatch title,
          and a second one would break the heading outline.
        </p>

        <M.h4>A level-four heading</M.h4>

        <M.ul>
          <M.li>An unordered item, marked with a square.</M.li>
          <M.li>A disc is not this direction&rsquo;s idiom.</M.li>
          <M.li>
            The marker is a filled square at hairline strength — the same mark
            the engagement card already draws for its highlights.
          </M.li>
        </M.ul>

        <M.ol>
          <M.li>An ordered item.</M.li>
          <M.li>
            The counter sets in mono with tabular figures, because a numeral is
            chrome and would otherwise inherit the proportional face the list
            body legitimately has.
          </M.li>
        </M.ol>

        <M.blockquote>
          <p>
            A blockquote is a rule and muted ink. Not a card, not a fill, no
            quote glyph, and not the signal — a pull quote is not the most
            important thing on any page.
          </p>
        </M.blockquote>

        <M.pre>
          <code className="language-ts">{SAMPLE}</code>
        </M.pre>

        <p>
          A fence keeps one <Code>code</Code> element inside the{" "}
          <Code>pre</Code>, with its border, fill, padding and size all
          neutralised: inside a fence the surface belongs to the block.
        </p>

        <M.figure>
          <M.pre>
            <code>pnpm check</code>
          </M.pre>
          <M.figcaption>
            A caption is a label, so it comes back to chrome.
          </M.figcaption>
        </M.figure>

        <M.hr />

        <p>
          Links go through the shared component, so{" "}
          <M.a href="/news">an internal one</M.a> is plain and{" "}
          <M.a href="https://nextjs.org/docs">an external one</M.a> announces
          itself. Both are <Code>inline</Code> rather than{" "}
          <Code>inline-flex</Code>, so a link of several words still wraps
          across lines inside a paragraph instead of becoming an atomic box.
        </p>
      </Prose>
    </Container>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The wrapper is the only entry point to the proportional face.
    const prose = canvasElement.querySelector("[data-slot='prose']")!;
    expect(prose).toHaveClass("prose-face");

    // A body never produces an h1.
    expect(canvas.queryByRole("heading", { level: 1 })).toBeNull();
    expect(canvas.getByRole("heading", { level: 2 })).toBeInTheDocument();

    // One `<code>` inside the fence, not two. `CodeBlock` supplies its own,
    // which is why the map renders a bare `<pre>` carrying `codeSurface`.
    const fences = canvasElement.querySelectorAll("pre");
    for (const fence of fences) {
      expect(fence.querySelectorAll("code")).toHaveLength(1);
      // Without this an overflowing block scrolls by mouse only.
      expect(fence).toHaveAttribute("tabindex", "0");
    }

    // The whole external-link guarantee, inherited by article prose for free
    // because `a` maps to the shared component.
    const external = canvas.getByRole("link", { name: /an external one/ });
    expect(external).toHaveAttribute("target", "_blank");
    expect(external).toHaveAttribute("rel", "noopener noreferrer");
    expect(external).toHaveAccessibleName(/opens in a new tab/);

    const internal = canvas.getByRole("link", { name: "an internal one" });
    expect(internal).not.toHaveAttribute("target");
    // `inline`, so a multi-word link wraps. twMerge drops `inline-flex`.
    expect(internal).toHaveClass("inline");
    expect(internal).not.toHaveClass("inline-flex");

    // Markers were reset to none by preflight, and put back deliberately.
    expect(canvasElement.querySelector("ul")).toHaveClass("list-[square]");
    expect(canvasElement.querySelector("ol")).toHaveClass("marker:font-mono");
  },
};

export const BothThemes: Story = {
  parameters: { bothThemes: true },
  render: () => (
    <Container width="prose">
      <Prose className="py-6">
        <p>
          A paragraph in the proportional face, with <Code>inline code</Code>{" "}
          that stays in mono.
        </p>
        <M.h2>A heading, in chrome</M.h2>
        <M.blockquote>
          <p>A rule and muted ink.</p>
        </M.blockquote>
        <M.pre>
          <code>pnpm check</code>
        </M.pre>
      </Prose>
    </Container>
  ),
};
