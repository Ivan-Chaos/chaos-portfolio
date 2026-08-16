import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { Field, FieldDescription, FieldLabel } from "./field";
import {
  NumberField,
  NumberFieldDecrement,
  NumberFieldGroup,
  NumberFieldIncrement,
  NumberFieldInput,
} from "./number-field";

const meta = {
  title: "Components/NumberField",
  component: NumberField,
} satisfies Meta<typeof NumberField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="max-w-48">
      <Field>
        <FieldLabel htmlFor="nf-default">Quantity</FieldLabel>
        <NumberField id="nf-default" defaultValue={1} min={0}>
          <NumberFieldGroup>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldGroup>
        </NumberField>
      </Field>
    </div>
  ),
};

/**
 * The steppers are outside the tab order. They duplicate what the arrow keys
 * already do on the focused input, so including them would make every numeric
 * field cost three tab stops instead of one.
 */
export const KeyboardAndSteppers: Story = {
  render: () => (
    <div className="max-w-48">
      <Field>
        <FieldLabel htmlFor="nf-kb">Crew</FieldLabel>
        <NumberField id="nf-kb" defaultValue={3} min={0} max={7}>
          <NumberFieldGroup>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldGroup>
        </NumberField>
        <FieldDescription>Between 0 and 7.</FieldDescription>
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Crew");
    const increase = canvas.getByRole("button", { name: "Increase" });

    expect(input).toHaveValue("3");

    await userEvent.click(increase);
    expect(input).toHaveValue("4");

    // The steppers are out of the tab order — asserted directly rather than by
    // simulating tab, which depends on where focus happens to start.
    expect(increase).toHaveAttribute("tabindex", "-1");
    expect(canvas.getByRole("button", { name: "Decrease" })).toHaveAttribute(
      "tabindex",
      "-1",
    );

    input.focus();
    expect(input).toHaveFocus();

    await userEvent.keyboard("{ArrowUp}");
    expect(input).toHaveValue("5");
    await userEvent.keyboard("{ArrowDown}{ArrowDown}");
    expect(input).toHaveValue("3");
  },
};

/** `step`, `min` and `max` clamp; formatting follows the locale. */
export const StepAndFormat: Story = {
  render: () => (
    <div className="grid max-w-64 gap-5">
      <Field>
        <FieldLabel htmlFor="nf-step">Step 0.25</FieldLabel>
        <NumberField id="nf-step" defaultValue={1} step={0.25} min={0} max={10}>
          <NumberFieldGroup>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldGroup>
        </NumberField>
      </Field>
      <Field>
        <FieldLabel htmlFor="nf-pct">Percent</FieldLabel>
        <NumberField
          id="nf-pct"
          defaultValue={0.4}
          step={0.05}
          min={0}
          max={1}
          format={{ style: "percent" }}
        >
          <NumberFieldGroup>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldGroup>
        </NumberField>
      </Field>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="max-w-48">
      <Field>
        <FieldLabel htmlFor="nf-disabled">Quantity</FieldLabel>
        <NumberField id="nf-disabled" defaultValue={2} disabled>
          <NumberFieldGroup>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldGroup>
        </NumberField>
      </Field>
    </div>
  ),
};

export const BothThemes: Story = {
  parameters: { bothThemes: true },
  render: () => (
    <div className="max-w-48">
      <Field>
        <FieldLabel htmlFor="nf-bt">Quantity</FieldLabel>
        <NumberField id="nf-bt" defaultValue={1} min={0}>
          <NumberFieldGroup>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldGroup>
        </NumberField>
      </Field>
    </div>
  ),
};
