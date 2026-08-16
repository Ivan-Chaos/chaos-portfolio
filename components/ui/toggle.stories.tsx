import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";
import { Toggle } from "./toggle";
import { ToggleGroup, ToggleGroupItem } from "./toggle-group";

const meta = {
  title: "Components/Toggle",
  component: Toggle,
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The pressed state takes the amber signal rather than a grey fill. A toggle is
 * a state readout, which is what the signal is for — and grey-on-grey pressed
 * states are hard to read at a glance in either theme.
 */
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Toggle>Default</Toggle>
      <Toggle defaultPressed>Pressed</Toggle>
      <Toggle variant="outline">Outline</Toggle>
      <Toggle variant="outline" defaultPressed>
        Outline pressed
      </Toggle>
      <Toggle disabled>Disabled</Toggle>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Toggle key={size} size={size} variant="outline">
          {size}
        </Toggle>
      ))}
    </div>
  ),
};

/** Icon-only toggles still need a name — the icon is `aria-hidden`. */
export const IconOnly: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Toggle variant="outline" aria-label="Bold">
        <BoldIcon aria-hidden="true" />
      </Toggle>
      <Toggle variant="outline" aria-label="Italic">
        <ItalicIcon aria-hidden="true" />
      </Toggle>
      <Toggle variant="outline" aria-label="Underline">
        <UnderlineIcon aria-hidden="true" />
      </Toggle>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const bold = canvas.getByRole("button", { name: "Bold" });

    expect(bold).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(bold);
    expect(bold).toHaveAttribute("aria-pressed", "true");
  },
};

/**
 * A toggle group is one control, so it is a single tab stop with arrow-key
 * movement inside — not three separate stops.
 */
export const Group: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <ToggleGroup defaultValue={["bold"]}>
        <ToggleGroupItem value="bold" aria-label="Bold">
          <BoldIcon aria-hidden="true" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <ItalicIcon aria-hidden="true" />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <UnderlineIcon aria-hidden="true" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};

export const BothThemes: Story = {
  parameters: { bothThemes: true },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Toggle defaultPressed>Pressed</Toggle>
      <Toggle variant="outline">Outline</Toggle>
      <ToggleGroup defaultValue={["bold"]}>
        <ToggleGroupItem value="bold" aria-label="Bold">
          <BoldIcon aria-hidden="true" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <ItalicIcon aria-hidden="true" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  ),
};
