import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Code,
  CodeBlock,
  Heading,
  Kicker,
  Numeral,
  Prose,
  SectionFigure,
  Text,
} from "./typography";

const meta = {
  title: "Components/Typography",
  component: Text,
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `level` and `size` are separate props on purpose. Heading level is document
 * structure that screen readers navigate by; picking an `h4` because it "looked
 * right" breaks the outline. Size defaults from level, so the common case is
 * still one prop.
 */
export const Headings: Story = {
  render: () => (
    <div className="space-y-4">
      <Heading level={1}>Orbital mechanics</Heading>
      <Heading level={2}>Orbital mechanics</Heading>
      <Heading level={3}>Orbital mechanics</Heading>
      <Heading level={4}>Orbital mechanics</Heading>
      <div className="border-t border-hairline pt-4">
        <Heading level={2} size="xs">
          An h2 rendered at the smallest size — structure and appearance decided
          separately
        </Heading>
      </div>
    </div>
  ),
};

export const TextSizesAndTones: Story = {
  render: () => (
    <div className="space-y-6">
      <div className="space-y-2">
        {(["lg", "md", "sm", "xs", "2xs"] as const).map((size) => (
          <Text key={size} size={size}>
            {size} — Orbital mechanics 0123456789
          </Text>
        ))}
      </div>
      <div className="space-y-2 border-t border-hairline pt-4">
        {(["default", "muted", "signal", "danger", "success"] as const).map(
          (tone) => (
            <Text key={tone} tone={tone}>
              {tone} — tones map to the `-text` tokens, never the fills
            </Text>
          ),
        )}
      </div>
    </div>
  ),
};

/** The one sanctioned use of the proportional face, capped at a readable measure. */
export const ProseFace: Story = {
  render: () => (
    <Prose>
      <p>
        Long-form text sets in Archivo rather than the monospace used everywhere
        else. This is the single recorded deviation from the direction, and the
        reason is readability at length: monospace paragraphs read measurably
        slower and take roughly 15% more horizontal space at the same size.
      </p>
      <p>
        The measure is capped because unbounded line length is the actual
        problem the face switch was made to solve. A second paragraph shows the
        spacing rhythm.
      </p>
    </Prose>
  ),
};

export const KickersAndFigures: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <Kicker>Foundation</Kicker>
        <Heading level={2} className="mt-1">
          Section title
        </Heading>
      </div>
      <div className="flex items-baseline gap-4 border-t border-hairline pt-4">
        <SectionFigure>01</SectionFigure>
        <Heading level={2} size="md">
          Condensed figures as composition
        </Heading>
      </div>
    </div>
  ),
};

/** Right-aligned values with a muted unit — the readout pattern. */
export const Numerals: Story = {
  render: () => (
    <dl className="max-w-xs space-y-1.5">
      {[
        ["Orbital period", "92.68", "min"],
        ["Apoapsis", "418.20", "km"],
        ["Inclination", "51.64", "deg"],
      ].map(([term, value, unit]) => (
        <div
          key={term}
          className="flex items-baseline justify-between border-b border-hairline pb-1.5"
        >
          <dt className="text-sm text-muted-foreground">{term}</dt>
          <dd className="text-sm">
            <Numeral value={value} unit={unit} />
          </dd>
        </div>
      ))}
    </dl>
  ),
};

/**
 * Ligatures are re-enabled here and only here — `!=` becoming one glyph is right
 * in a code sample and wrong in a button label.
 */
export const CodeSamples: Story = {
  render: () => (
    <div className="space-y-4">
      <Text>
        Merge class names with <Code>cn()</Code> from <Code>@/lib/utils</Code>.
      </Text>
      <CodeBlock>{`import { cn } from "@/lib/utils";

// Later conflicting utilities win, which is what makes
// a component's className overridable.
cn("border-hairline", className);`}</CodeBlock>
    </div>
  ),
};

export const BothThemes: Story = {
  parameters: { bothThemes: true },
  render: () => (
    <div className="space-y-4">
      <Kicker>Foundation</Kicker>
      <Heading level={2}>Orbital mechanics</Heading>
      <Text tone="muted">Monospace chrome, sized from the scale.</Text>
      <Prose>
        <p>The proportional face, used only for long-form text.</p>
      </Prose>
      <Numeral value="92.68" unit="min" />
    </div>
  ),
};
