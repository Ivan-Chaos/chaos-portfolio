import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/typography";
import { Reveal } from "./reveal";

/**
 * These stories run in real Chromium, so `IntersectionObserver` genuinely
 * exists and the observer path is actually exercised — which is the half a
 * jsdom test cannot reach.
 *
 * The play functions wait for `data-revealed` before finishing, so the a11y
 * pass that follows never measures an element mid-fade. An element caught at
 * `opacity: 0` produces a contrast result that says nothing useful.
 */
const meta = {
  title: "Components/Motion/Reveal",
  component: Reveal,
} satisfies Meta<typeof Reveal>;

export default meta;
type Story = StoryObj<typeof meta>;

function Panel({ label }: { label: string }) {
  return (
    <Card className="w-full max-w-md">
      <CardContent>
        <CardTitle>{label}</CardTitle>
        <Text tone="muted" className="mt-2">
          Opacity and transform only. Neither reflows, which is why nothing else
          is in scope.
        </Text>
      </CardContent>
    </Card>
  );
}

/** Already on screen at mount: it goes straight to the animated state, no wait. */
export const InView: Story = {
  args: { children: <Panel label="Revealed on mount" /> },
  play: async ({ canvasElement }) => {
    const node = canvasElement.querySelector("[data-slot='reveal']")!;

    await waitFor(() => expect(node).toHaveAttribute("data-revealed"));
    // Above the fold never arms, so it never paints hidden even for a frame.
    expect(node).not.toHaveAttribute("data-reveal-armed");
  },
};

/**
 * The branch that matters: armed and invisible until scrolled to, then revealed
 * exactly once.
 */
export const BelowTheFold: Story = {
  args: { children: <Panel label="Revealed on scroll" /> },
  render: (args) => (
    <div>
      <Text tone="muted">Scroll down — the panel below is armed.</Text>
      <div className="h-[150vh]" aria-hidden="true" />
      <Reveal {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const node = canvasElement.querySelector("[data-slot='reveal']")!;

    await waitFor(() => expect(node).toHaveAttribute("data-reveal-armed"));

    node.scrollIntoView();

    await waitFor(() => expect(node).toHaveAttribute("data-revealed"));
    expect(node).not.toHaveAttribute("data-reveal-armed");
    // The content was in the DOM the whole time — being armed hides it, it does
    // not remove it.
    expect(canvas.getByText("Revealed on scroll")).toBeInTheDocument();
  },
};

export const BothThemes: Story = {
  args: { children: <Panel label="Revealed on mount" /> },
  parameters: { bothThemes: true },
};
