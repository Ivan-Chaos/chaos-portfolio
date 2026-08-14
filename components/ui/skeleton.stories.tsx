import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Card, CardContent, CardHeader } from "./card";
import { Skeleton } from "./skeleton";
import { Spinner } from "./spinner";

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Shapes: Story = {
  render: () => (
    <div className="max-w-sm space-y-3">
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-24 w-full" />
    </div>
  ),
};

/**
 * The skeletons are `aria-hidden` — a screen reader has nothing useful to say
 * about a grey box, and announcing a dozen is worse than silence.
 *
 * The *region* carries `aria-busy` instead, so the state is announced once. That
 * split is the whole point: without it a loading card is either silent or
 * deafening.
 */
export const InContext: Story = {
  render: () => (
    // A `<section>` rather than putting the label on the Card: `aria-label` on a
    // plain div with no role is invalid ARIA, and a named section is a region
    // that assistive tech can actually find.
    <section aria-busy="true" aria-label="Loading project" className="max-w-sm">
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    </section>
  ),
};

/**
 * Skeleton or spinner is a real choice: a skeleton implies the shape of what is
 * coming and suits content, a spinner suits an action whose result has no shape.
 */
export const AgainstSpinner: Story = {
  render: () => (
    <div className="grid max-w-md gap-6 sm:grid-cols-2">
      <div className="space-y-2">
        <p className="label-caps text-muted-foreground">Skeleton — content</p>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
      <div className="space-y-2">
        <p className="label-caps text-muted-foreground">Spinner — action</p>
        <div className="flex h-10 items-center gap-2 text-sm text-muted-foreground">
          <Spinner label="Publishing project" />
          Publishing
        </div>
      </div>
    </div>
  ),
};

export const BothThemes: Story = {
  parameters: { bothThemes: true },
  render: () => (
    <div className="space-y-3">
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  ),
};
