import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

const meta = {
  title: "Components/Card",
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default card is registered by corner ticks rather than enclosed by a
 * border — the system's signature treatment. It reads as a marked area rather
 * than a box.
 */
export const Default: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Orbital elements</CardTitle>
        <CardDescription>
          Sample values, shown to exercise the layout.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-2 text-sm">
          {[
            ["Period", "92.68 min"],
            ["Apoapsis", "418.20 km"],
            ["Inclination", "51.64 deg"],
          ].map(([term, value]) => (
            <div
              key={term}
              className="flex justify-between border-b border-hairline pb-1.5"
            >
              <dt className="text-muted-foreground">{term}</dt>
              <dd className="tabular-nums">{value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  ),
};

/**
 * `bordered` encloses instead. Reach for it when ticks lose the boundary — a
 * card inside a scrolling list of other cards, for instance.
 */
export const Bordered: Story = {
  render: () => (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Corner ticks</CardTitle>
          <CardDescription>The default treatment.</CardDescription>
        </CardHeader>
      </Card>
      <Card bordered>
        <CardHeader>
          <CardTitle>Bordered</CardTitle>
          <CardDescription>For when ticks are not enough.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  ),
};

export const WithActionAndFooter: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Design system</CardTitle>
        <CardDescription>Phase 2 — component library.</CardDescription>
        <CardAction>
          <Button size="sm" variant="transparent">
            Edit
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Card content sits between the header and the footer, sharing the
          card&rsquo;s horizontal padding.
        </p>
      </CardContent>
      <CardFooter className="justify-end gap-2">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm">Save</Button>
      </CardFooter>
    </Card>
  ),
};

export const Small: Story = {
  render: () => (
    <Card size="sm" className="max-w-xs">
      <CardHeader>
        <CardTitle>Compact</CardTitle>
        <CardDescription>Tighter spacing throughout.</CardDescription>
      </CardHeader>
    </Card>
  ),
};

export const BothThemes: Story = {
  parameters: { bothThemes: true },
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Orbital elements</CardTitle>
        <CardDescription>Corner ticks in both themes.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm tabular-nums">92.68 min · 418.20 km</p>
      </CardContent>
    </Card>
  ),
};
