import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within } from "storybook/test";
import { Heading } from "@/components/ui/typography";
import { Decode } from "./decode";

/**
 * Spent once, on the masthead name. These stories exist to hold the two things
 * that would regress silently: the accessible name never becomes a scrambled
 * string, and the effect always settles.
 */
const meta = {
  title: "Components/Motion/Decode",
  component: Decode,
  args: { text: "Ivan Chaus" },
} satisfies Meta<typeof Decode>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Heading level={1} size="3xl">
      <Decode {...args} />
    </Heading>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The name is correct from the first frame, because it comes from the
    // visually-hidden copy rather than from the animating node. If this ever
    // fails, a screen reader is being read noise.
    const heading = canvas.getByRole("heading", {
      level: 1,
      name: "Ivan Chaus",
    });
    expect(heading).toBeInTheDocument();

    const scrambling = canvasElement.querySelector("[aria-hidden='true']")!;
    await waitFor(() => expect(scrambling).toHaveTextContent("Ivan Chaus"), {
      timeout: 3000,
    });
  },
};

/** At display size, which is the only size it is ever used at. */
export const Display: Story = {
  render: (args) => (
    <Heading level={1} size="3xl" className="sm:text-6xl lg:text-7xl">
      <Decode {...args} />
    </Heading>
  ),
};

export const BothThemes: Story = {
  render: (args) => (
    <Heading level={1} size="3xl">
      <Decode {...args} />
    </Heading>
  ),
  parameters: { bothThemes: true },
};
