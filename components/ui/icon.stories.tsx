import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowRightIcon, SearchIcon, XIcon } from "lucide-react";
import { expect, within } from "storybook/test";
import { Button } from "./button";
import { Icon } from "./icon";

const meta = {
  title: "Components/Icon",
  component: Icon,
  // `as` is required, so the meta supplies it — otherwise every story below has
  // to repeat an `args` it does not use.
  args: { as: ArrowRightIcon },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <div key={size} className="text-center">
          <Icon as={ArrowRightIcon} size={size} className="mx-auto" />
          <p className="mt-2 text-2xs text-muted-foreground">{size}</p>
        </div>
      ))}
    </div>
  ),
};

/**
 * The `label` prop is the whole point of this wrapper.
 *
 * Omit it and the icon is `aria-hidden` — correct when adjacent text already
 * says what it means. Pass it and the icon becomes `role="img"` with a name —
 * correct when the icon *is* the label. There is no third option, so it cannot
 * be forgotten.
 */
export const DecorativeVersusLabelled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="outline">
        <Icon as={SearchIcon} />
        Search
      </Button>
      <Button variant="outline" size="icon">
        <Icon as={XIcon} label="Close" />
      </Button>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Beside the word "Search", the icon must not announce — otherwise the
    // button reads its meaning twice.
    const labelled = canvas.getByRole("button", { name: "Search" });
    expect(labelled).toHaveAccessibleName("Search");

    // Icon-only: the icon carries the name.
    expect(canvas.getByRole("button", { name: "Close" })).toBeInTheDocument();
    expect(canvas.getByRole("img", { name: "Close" })).toBeInTheDocument();
  },
};

/** Icons take `currentColor`, so they inherit tone without a colour prop. */
export const InheritsColor: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <span className="text-foreground">
        <Icon as={ArrowRightIcon} />
      </span>
      <span className="text-muted-foreground">
        <Icon as={ArrowRightIcon} />
      </span>
      <span className="text-signal-text">
        <Icon as={ArrowRightIcon} />
      </span>
      <span className="text-danger-text">
        <Icon as={ArrowRightIcon} />
      </span>
      <span className="text-success-text">
        <Icon as={ArrowRightIcon} />
      </span>
    </div>
  ),
};

export const BothThemes: Story = {
  parameters: { bothThemes: true },
  render: () => (
    <div className="flex items-center gap-4">
      <Icon as={SearchIcon} size="lg" />
      <span className="text-muted-foreground">
        <Icon as={ArrowRightIcon} size="lg" />
      </span>
      <span className="text-signal-text">
        <Icon as={XIcon} size="lg" />
      </span>
    </div>
  ),
};
