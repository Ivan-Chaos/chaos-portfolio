import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowRightIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { expect, userEvent, within } from "storybook/test";
import { Button } from "./button";

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "Send" },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "filled",
        "signal",
        "outline",
        "transparent",
        "underline",
        "danger",
      ],
    },
    size: {
      control: "select",
      options: ["xs", "sm", "default", "lg", "icon", "icon-sm", "icon-lg"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const TREATMENTS = [
  "filled",
  "signal",
  "outline",
  "transparent",
  "underline",
  "danger",
] as const;

export const Playground: Story = {};

/**
 * `filled` is ink, not amber. `signal` is the amber one and is meant for the
 * single most important action on a view — a page of amber buttons spends the
 * signal on nothing.
 */
export const Treatments: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {TREATMENTS.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(["xs", "sm", "default", "lg"] as const).map((size) => (
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

/** Icons sit either side of the label and size themselves from the button. */
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <PlusIcon data-icon="inline-start" />
        Add project
      </Button>
      <Button variant="outline">
        Continue
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
      <Button variant="danger">
        <Trash2Icon data-icon="inline-start" />
        Delete
      </Button>
      <Button variant="transparent">
        <PlusIcon data-icon="inline-start" />
        Add
      </Button>
    </div>
  ),
};

/**
 * Icon-only buttons need an accessible name from somewhere. `sr-only` text is
 * used rather than `title` — a tooltip is not a label.
 */
export const IconOnly: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(["icon-sm", "icon", "icon-lg"] as const).map((size) => (
        <Button key={size} size={size} variant="outline">
          <PlusIcon />
          <span className="sr-only">Add project</span>
        </Button>
      ))}
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button disabled>Disabled</Button>
      <Button loading>Saving</Button>
      <Button variant="outline" loading>
        Saving
      </Button>
    </div>
  ),
};

/**
 * The loading state keeps its label mounted but hidden, so the button does not
 * resize as it becomes busy — a hit target that moves under the cursor is a bug.
 */
export const Loading: Story = {
  args: { loading: true, children: "Saving changes" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");

    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("aria-busy", "true");
    // The spinner must announce, or the wait is silent.
    expect(canvas.getByRole("status")).toBeInTheDocument();
  },
};

export const ClickHandling: Story = {
  args: { children: "Add project" },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: "Add project" });

    await userEvent.click(button);
    expect(button).toBeEnabled();

    // Focusable, and not removed from the tab order — the whole focus treatment
    // depends on :focus-visible rather than a per-component ring.
    expect(button).not.toHaveAttribute("tabindex", "-1");
    button.focus();
    expect(button).toHaveFocus();
  },
};

export const BothThemes: Story = {
  parameters: { bothThemes: true },
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {TREATMENTS.map((variant) => (
        <Button key={variant} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};
