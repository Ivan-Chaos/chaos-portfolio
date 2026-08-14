import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Container, Divider, Section } from "./layout";
import { Text } from "./typography";

const meta = {
  title: "Components/Layout",
  component: Section,
} satisfies Meta<typeof Section>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `Section` separates with a hairline rule rather than whitespace alone — the
 * rule is the structural device this direction uses where others reach for a
 * card or a background change.
 *
 * The index figure is `aria-hidden`, so "01" is not announced before every
 * heading; the heading text stays the accessible name.
 */
export const Sections: Story = {
  render: () => (
    <Container>
      <Section
        id="direction"
        index="01"
        title="Direction"
        description="Sections take an optional index and description."
      >
        <Text tone="muted">
          Content sits below the header, sharing the container&rsquo;s gutters.
        </Text>
      </Section>
      <Section id="palette" index="02" title="Palette">
        <Text tone="muted">A second section, separated by the rule above.</Text>
      </Section>
      <Section title="Without an index">
        <Text tone="muted">The figure is optional.</Text>
      </Section>
    </Container>
  ),
};

/**
 * Container widths. `prose` is narrower than it looks, because monospace runs
 * about 15% wider per character than a grotesk at the same size.
 */
export const ContainerWidths: Story = {
  render: () => (
    <div className="space-y-3">
      {(["prose", "default", "wide"] as const).map((width) => (
        <Container key={width} width={width}>
          <div className="border border-hairline p-3">
            <Text size="xs" tone="muted">
              width=&ldquo;{width}&rdquo;
            </Text>
          </div>
        </Container>
      ))}
    </div>
  ),
};

/**
 * The labelled divider punches the label through the rule using the page
 * background. On a card or a sunken surface, pass a matching background class.
 */
export const Dividers: Story = {
  render: () => (
    <div className="max-w-md space-y-6">
      <div>
        <Text tone="muted">Above</Text>
        <Divider />
        <Text tone="muted">Below</Text>
      </div>
      <div>
        <Text tone="muted">Above</Text>
        <Divider>or</Divider>
        <Text tone="muted">Below</Text>
      </div>
      <div className="flex h-10 items-center gap-4">
        <Text tone="muted">Left</Text>
        <Divider orientation="vertical" />
        <Text tone="muted">Right</Text>
      </div>
    </div>
  ),
};

export const BothThemes: Story = {
  parameters: { bothThemes: true },
  render: () => (
    <Container width="full">
      <Section index="01" title="Direction">
        <Text tone="muted">Hairline rules in both themes.</Text>
      </Section>
      <Divider>or</Divider>
    </Container>
  ),
};
