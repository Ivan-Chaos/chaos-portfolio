import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { ThemeToggle } from "./theme-toggle";

/**
 * `ThemeToggle` reads `useTheme()` from next-themes, and these stories render it
 * *without* a `ThemeProvider` on purpose.
 *
 * next-themes' context has a default value, so `useTheme` outside a provider
 * returns an undefined theme and a no-op `setTheme` rather than throwing — which
 * is exactly the pre-hydration state the component is built to handle. Adding a
 * real provider here would also fight the theme decorator in
 * `.storybook/preview.tsx` for control of the class on `<html>`, and the story's
 * own theme would start flipping out from under the a11y run.
 *
 * The interactive demo therefore lives in the running app, not here. What is
 * verified here is the part that can regress silently: accessible names,
 * grouping, and contrast in both themes.
 */
const meta = {
  title: "Components/ThemeToggle",
  component: ThemeToggle,
} satisfies Meta<typeof ThemeToggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The group is what tells a screen reader these three buttons are one
    // control rather than three unrelated ones.
    const group = canvas.getByRole("group", { name: "Theme" });
    expect(group).toBeInTheDocument();

    // Icon-only buttons: the name has to come from the sr-only text, since the
    // icons are aria-hidden. This is the assertion that catches someone
    // "tidying up" the sr-only spans away.
    for (const name of ["Light", "System", "Dark"]) {
      expect(canvas.getByRole("button", { name })).toBeInTheDocument();
    }

    // Without a provider nothing is selected — but every segment must still
    // expose its pressed state, not omit the attribute.
    const buttons = canvas.getAllByRole("button");
    expect(buttons).toHaveLength(3);
    for (const button of buttons) {
      expect(button).toHaveAttribute("aria-pressed");
    }
  },
};

/** Both themes side by side — the segmented control is where the amber fill has to hold. */
export const BothThemes: Story = {
  parameters: { bothThemes: true },
};
