import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Link } from "./link";
import { Prose, Text } from "./typography";

const meta = {
  title: "Components/Link",
  component: Link,
  // `href` is required on next/link, so the meta supplies a default.
  args: { href: "/", children: "Link" },
} satisfies Meta<typeof Link>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `default` is underlined at rest — inside a paragraph nothing else marks a
 * link, and colour alone is not sufficient. `quiet` drops the underline for
 * navigation, where position already does the marking.
 */
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <Text>
        A link in running text uses the{" "}
        <Link href="/foundation">default variant</Link> so it is marked without
        relying on colour.
      </Text>
      <nav className="flex gap-4">
        <Link href="/work" variant="quiet">
          Work
        </Link>
        <Link href="/writing" variant="quiet">
          Writing
        </Link>
        <Link href="/about" variant="quiet">
          About
        </Link>
      </nav>
      <Text>
        The{" "}
        <Link href="/signal" variant="signal">
          signal variant
        </Link>{" "}
        carries the accent at rest. Use it sparingly.
      </Text>
    </div>
  ),
};

/**
 * External links get `target="_blank"` plus `rel="noopener noreferrer"`, a
 * visible arrow, and screen-reader text saying a new tab opens.
 *
 * `noopener` matters: without it the new tab gets a handle back to this window
 * through `window.opener`. The announcement matters too — a tab switching
 * without warning is disorienting when you cannot see it happen.
 */
export const External: Story = {
  render: () => (
    <div className="space-y-3">
      <Text>
        <Link href="https://base-ui.com">Base UI</Link> is detected as external
        automatically.
      </Text>
      <Text>
        <Link href="mailto:ivan@mail.com">ivan@mail.com</Link> counts as
        external too.
      </Text>
      <Text>
        <Link href="https://storybook.js.org" showExternalIcon={false}>
          Without the arrow
        </Link>{" "}
        — the announcement stays.
      </Text>
      <Text>
        <Link href="/work">An internal link</Link> gets none of it.
      </Text>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const external = canvas.getByRole("link", { name: /Base UI/ });

    expect(external).toHaveAttribute("target", "_blank");
    expect(external).toHaveAttribute("rel", "noopener noreferrer");
    expect(external).toHaveAccessibleName(/opens in a new tab/i);

    // mailto: counts as external too. The name includes the appended
    // announcement, which is the point — hence the regex rather than an exact
    // match.
    const mail = canvas.getByRole("link", { name: /ivan@mail\.com/ });
    expect(mail).toHaveAttribute("target", "_blank");
    expect(mail).toHaveAccessibleName(/opens in a new tab/i);

    // An internal link gets none of that.
    const internal = canvas.getByRole("link", { name: "An internal link" });
    expect(internal).not.toHaveAttribute("target");
    expect(internal).not.toHaveAttribute("rel");
  },
};

export const InProse: Story = {
  render: () => (
    <Prose>
      <p>
        Links inside <a href="/prose">long-form prose</a> inherit the
        proportional face and keep the underline, which is the only marking a
        reader has mid-paragraph.
      </p>
    </Prose>
  ),
};

export const BothThemes: Story = {
  parameters: { bothThemes: true },
  render: () => (
    <div className="space-y-3">
      <Text>
        A <Link href="/foundation">default link</Link> in running text.
      </Text>
      <Link href="https://base-ui.com">An external link</Link>
      <div>
        <Link href="/work" variant="quiet">
          Quiet
        </Link>
      </div>
    </div>
  ),
};
