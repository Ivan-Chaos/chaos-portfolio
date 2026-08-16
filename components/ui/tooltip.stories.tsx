import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { InfoIcon, PlusIcon } from "lucide-react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

/**
 * Every story wraps its own `TooltipProvider`. In the app it lives once in the
 * root layout; here each story is its own tree.
 *
 * Tooltips portal to `document.body`, so there is no `bothThemes` story — use
 * the toolbar to check dark and light.
 */
const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
  decorators: [
    (Story) => (
      <TooltipProvider>
        <Story />
      </TooltipProvider>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A tooltip supplements a label — it never replaces one. The button below is
 * already named by its `sr-only` text; the tooltip adds the keyboard shortcut.
 * A tooltip as the only name fails for touch users, who never hover.
 */
export const Default: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button variant="outline" size="icon">
            <PlusIcon />
            <span className="sr-only">Add project</span>
          </Button>
        }
      />
      <TooltipContent>Add project</TooltipContent>
    </Tooltip>
  ),
};

export const Sides: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Tooltip key={side}>
          <TooltipTrigger render={<Button variant="outline">{side}</Button>} />
          <TooltipContent side={side}>Positioned {side}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  ),
};

/** Tooltips must open on keyboard focus, not hover alone. */
export const OpensOnFocus: Story = {
  render: () => (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button variant="outline">
            <InfoIcon aria-hidden="true" />
            Details
          </Button>
        }
      />
      <TooltipContent>Orbital period is measured in minutes.</TooltipContent>
    </Tooltip>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /Details/ });

    await userEvent.tab();
    expect(trigger).toHaveFocus();

    await waitFor(() =>
      expect(
        within(document.body).getByText(
          "Orbital period is measured in minutes.",
        ),
      ).toBeVisible(),
    );
  },
};
