import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { expect, within } from "storybook/test";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "./alert";
import { Button } from "./button";

const meta = {
  title: "Components/Alert",
  component: Alert,
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Status is carried by a 2px rule on the leading edge, not a tinted fill.
 *
 * A washed background would put the status text on an unpredictable ground —
 * exactly the situation the `-text` tokens were solved against. An edge leaves
 * the surface, and therefore the contrast, constant.
 *
 * Every variant takes an icon. Colour is never the only signal: the icon and the
 * copy both say what happened, which is what makes these usable for anyone who
 * cannot distinguish the edge colour.
 */
export const Variants: Story = {
  render: () => (
    <div className="grid max-w-lg gap-3">
      <Alert>
        <InfoIcon aria-hidden="true" />
        <AlertTitle>Two collaborators are editing</AlertTitle>
        <AlertDescription>
          Changes from others appear as they are saved.
        </AlertDescription>
      </Alert>
      <Alert variant="signal">
        <TriangleAlertIcon aria-hidden="true" />
        <AlertTitle>Unsaved changes</AlertTitle>
        <AlertDescription>
          Leaving this page now will discard them.
        </AlertDescription>
      </Alert>
      <Alert variant="danger">
        <CircleAlertIcon aria-hidden="true" />
        <AlertTitle>Could not reach the server</AlertTitle>
        <AlertDescription>
          The last change was not saved. Try again in a moment.
        </AlertDescription>
      </Alert>
      <Alert variant="success">
        <CircleCheckIcon aria-hidden="true" />
        <AlertTitle>Project published</AlertTitle>
        <AlertDescription>
          It is now visible to anyone with the link.
        </AlertDescription>
      </Alert>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // `role="alert"` on all four — that is what makes them announce.
    expect(canvas.getAllByRole("alert")).toHaveLength(4);
  },
};

export const WithAction: Story = {
  render: () => (
    <Alert variant="danger" className="max-w-lg">
      <CircleAlertIcon aria-hidden="true" />
      <AlertTitle>Could not reach the server</AlertTitle>
      <AlertDescription>The last change was not saved.</AlertDescription>
      <AlertAction>
        <Button size="sm" variant="outline">
          Retry
        </Button>
      </AlertAction>
    </Alert>
  ),
};

export const TitleOnly: Story = {
  render: () => (
    <div className="grid max-w-lg gap-3">
      <Alert>
        <InfoIcon aria-hidden="true" />
        <AlertTitle>A short notice with no description</AlertTitle>
      </Alert>
      <Alert variant="success">
        <CircleCheckIcon aria-hidden="true" />
        <AlertTitle>Saved</AlertTitle>
      </Alert>
    </div>
  ),
};

export const BothThemes: Story = {
  parameters: { bothThemes: true },
  render: () => (
    <div className="grid gap-3">
      <Alert variant="signal">
        <TriangleAlertIcon aria-hidden="true" />
        <AlertTitle>Unsaved changes</AlertTitle>
      </Alert>
      <Alert variant="danger">
        <CircleAlertIcon aria-hidden="true" />
        <AlertTitle>Could not reach the server</AlertTitle>
      </Alert>
      <Alert variant="success">
        <CircleCheckIcon aria-hidden="true" />
        <AlertTitle>Project published</AlertTitle>
      </Alert>
    </div>
  ),
};
