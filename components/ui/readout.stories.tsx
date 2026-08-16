import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { SkipLink, VisuallyHidden } from "./skip-link";
import { Stat, StatGroup } from "./stat";
import {
  Timeline,
  TimelineBody,
  TimelineDate,
  TimelineItem,
  TimelineMarker,
  TimelineTitle,
} from "./timeline";

const meta = {
  title: "Components/Readout",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A stat is a term/value pair and is marked up as one, so it announces as
 * "Orbital period, 92.68 minutes" rather than three loose strings.
 */
export const Stats: Story = {
  render: () => (
    <StatGroup className="max-w-3xl">
      <Stat label="Orbital period" value="92.68" unit="min" />
      <Stat label="Apoapsis" value="418.20" unit="km" />
      <Stat label="Inclination" value="51.64" unit="deg" />
      <Stat label="Passes" value="15" hint="Per day" />
    </StatGroup>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Term and value are associated, not just adjacent.
    expect(canvas.getByText("Orbital period").tagName).toBe("DT");
    expect(canvas.getAllByRole("definition")).toHaveLength(4);
  },
};

export const SingleStat: Story = {
  render: () => (
    <Stat
      className="max-w-xs"
      label="Storage used"
      value="62"
      unit="%"
      hint="Of the 20 GB included"
    />
  ),
};

/**
 * An ordered list, because the sequence carries meaning — assistive tech should
 * be able to say "item 2 of 4". The rail and markers are decorative and hidden.
 *
 * `current` marks the open entry with the signal, which is exactly the "this is
 * the live one" job the signal exists for.
 */
export const Timelines: Story = {
  render: () => (
    <Timeline className="max-w-md">
      <TimelineItem current>
        <TimelineMarker />
        <TimelineDate>2026 — present</TimelineDate>
        <TimelineTitle>Design system</TimelineTitle>
        <TimelineBody>
          Tokens, theming and the component library for this site.
        </TimelineBody>
      </TimelineItem>
      <TimelineItem>
        <TimelineMarker />
        <TimelineDate>2026</TimelineDate>
        <TimelineTitle>Project scaffold</TimelineTitle>
        <TimelineBody>
          Next.js App Router, Tailwind v4, spec-driven workflow.
        </TimelineBody>
      </TimelineItem>
      <TimelineItem>
        <TimelineMarker />
        <TimelineDate>2026</TimelineDate>
        <TimelineTitle>Repository created</TimelineTitle>
      </TimelineItem>
    </Timeline>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    expect(canvas.getByRole("list")).toBeInTheDocument();
    expect(canvas.getAllByRole("listitem")).toHaveLength(3);
  },
};

/**
 * The skip link is the first thing in the tab order and is visible only while
 * focused. It is deliberately not permanently hidden: sighted keyboard users
 * are the people it helps most, and one they cannot see is one they cannot use.
 *
 * Tab into this story to reveal it.
 */
export const SkipLinks: Story = {
  render: () => (
    <div>
      <SkipLink href="#demo-main" />
      <p className="text-sm text-muted-foreground">
        Press Tab to reveal the skip link in the corner.
      </p>
      <main id="demo-main" tabIndex={-1} className="mt-4">
        <p className="text-sm">
          The target carries <code>tabIndex={-1}</code> so focus actually lands
          here — without it some browsers scroll but leave focus behind, and the
          next Tab starts from the top again.
        </p>
        <p className="mt-3 text-sm">
          <VisuallyHidden>Note:</VisuallyHidden> This paragraph is preceded by
          visually hidden text that only a screen reader receives.
        </p>
      </main>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const link = canvas.getByRole("link", { name: "Skip to content" });

    // It has to exist in the accessibility tree at rest, not only once focused.
    expect(link).toHaveAttribute("href", "#demo-main");
    link.focus();
    expect(link).toHaveFocus();
  },
};

export const BothThemes: Story = {
  parameters: { bothThemes: true },
  render: () => (
    <div className="space-y-6">
      <Stat label="Orbital period" value="92.68" unit="min" />
      <Timeline>
        <TimelineItem current>
          <TimelineMarker />
          <TimelineDate>2026 — present</TimelineDate>
          <TimelineTitle>Design system</TimelineTitle>
        </TimelineItem>
        <TimelineItem>
          <TimelineMarker />
          <TimelineDate>2026</TimelineDate>
          <TimelineTitle>Project scaffold</TimelineTitle>
        </TimelineItem>
      </Timeline>
    </div>
  ),
};
