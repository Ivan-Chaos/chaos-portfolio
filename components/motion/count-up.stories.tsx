import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";
import { Stat, StatGroup } from "@/components/ui/stat";
import { CountUp } from "./count-up";

const meta = {
  title: "Components/Motion/CountUp",
  component: CountUp,
  args: { value: "50K+" },
} satisfies Meta<typeof CountUp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => <span className="text-3xl">{<CountUp {...args} />}</span>,
  play: async ({ canvasElement }) => {
    const node = canvasElement.querySelector("[aria-hidden='true']")!;

    // Whatever frame this lands on, the width is the width of the final
    // string. That is the property that keeps a StatGroup from reflowing.
    expect(node.textContent).toHaveLength("50K+".length);

    await waitFor(() => expect(node).toHaveTextContent("50K+"), {
      timeout: 3000,
    });
  },
};

/**
 * Four figures in the real container. The suffix forms — a bare number, a
 * percentage, a `+`, and a scaled `K+` — all count through the same width.
 */
export const InStatGroup: Story = {
  render: () => (
    <StatGroup>
      <Stat label="Years in production" value={<CountUp value="07" />} />
      <Stat label="Page latency cut" value={<CountUp value="50" />} unit="%" />
      <Stat label="Built from scratch" value={<CountUp value="10+" />} />
      <Stat label="Customers served" value={<CountUp value="50K+" />} />
    </StatGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Each figure is announced once, as itself — the counting node is hidden
    // from assistive technology and there is no live region.
    for (const value of ["07", "50", "10+", "50K+"]) {
      await waitFor(() =>
        expect(canvas.getAllByText(value).length).toBeGreaterThan(0),
      );
    }
  },
};

export const BothThemes: Story = {
  render: () => (
    <StatGroup>
      <Stat label="Years in production" value={<CountUp value="07" />} />
      <Stat label="Customers served" value={<CountUp value="50K+" />} />
    </StatGroup>
  ),
  parameters: { bothThemes: true },
};
