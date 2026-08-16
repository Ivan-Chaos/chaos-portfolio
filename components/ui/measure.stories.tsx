import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Field, FieldDescription, FieldLabel } from "./field";
import {
  Meter,
  MeterIndicator,
  MeterLabel,
  MeterTrack,
  MeterValue,
} from "./meter";
import { Progress, ProgressIndicator, ProgressTrack } from "./progress";
import { Slider } from "./slider";

/**
 * The three components that show a quantity, together — because choosing
 * between them is a semantic decision, not a visual one.
 */
const meta = {
  title: "Components/Measure",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sliders: Story = {
  render: () => (
    <div className="grid max-w-sm gap-6">
      <Field>
        <FieldLabel htmlFor="sl-single">Threshold</FieldLabel>
        <Slider id="sl-single" defaultValue={40} />
      </Field>
      <Field>
        <FieldLabel htmlFor="sl-range">Altitude range</FieldLabel>
        <Slider id="sl-range" defaultValue={[20, 70]} />
        <FieldDescription>Two thumbs, one control.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="sl-step">Stepped</FieldLabel>
        <Slider id="sl-step" defaultValue={50} step={10} />
      </Field>
      <Field>
        <FieldLabel htmlFor="sl-dis">Disabled</FieldLabel>
        <Slider id="sl-dis" defaultValue={30} disabled />
      </Field>
    </div>
  ),
};

/**
 * `Progress` versus `Meter` is a real distinction, and it is not about looks.
 *
 * Progress measures how far along a task is — it starts empty and ends
 * complete. A meter measures a level inside a fixed range that is not going
 * anywhere: capacity, usage, a score. They carry different ARIA roles, so
 * picking the wrong one misdescribes what the number means.
 */
export const ProgressVersusMeter: Story = {
  render: () => (
    <div className="grid max-w-sm gap-8">
      <div>
        <p className="label-caps mb-3 text-muted-foreground">
          Progress — a task running to completion
        </p>
        <Progress value={62}>
          <ProgressTrack>
            <ProgressIndicator />
          </ProgressTrack>
        </Progress>
      </div>
      <div>
        <p className="label-caps mb-3 text-muted-foreground">
          Meter — a level in a fixed range
        </p>
        <Meter value={62}>
          <div className="flex items-baseline justify-between">
            <MeterLabel>Storage used</MeterLabel>
            <MeterValue />
          </div>
          <MeterTrack>
            <MeterIndicator />
          </MeterTrack>
        </Meter>
      </div>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The roles are the whole point of keeping these separate.
    expect(canvas.getByRole("progressbar")).toBeInTheDocument();
    expect(canvas.getByRole("meter")).toBeInTheDocument();
  },
};

export const ProgressStates: Story = {
  render: () => (
    <div className="grid max-w-sm gap-5">
      {[0, 35, 100].map((value) => (
        <Progress key={value} value={value}>
          <ProgressTrack>
            <ProgressIndicator />
          </ProgressTrack>
        </Progress>
      ))}
    </div>
  ),
};

export const BothThemes: Story = {
  parameters: { bothThemes: true },
  render: () => (
    <div className="grid gap-6">
      <Field>
        <FieldLabel htmlFor="bt-slider">Threshold</FieldLabel>
        <Slider id="bt-slider" defaultValue={40} />
      </Field>
      <Progress value={62}>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
      <Meter value={62}>
        <div className="flex items-baseline justify-between">
          <MeterLabel>Storage used</MeterLabel>
          <MeterValue />
        </div>
        <MeterTrack>
          <MeterIndicator />
        </MeterTrack>
      </Meter>
    </div>
  ),
};
