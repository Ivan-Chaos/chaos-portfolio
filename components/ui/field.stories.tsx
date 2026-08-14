import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Button } from "./button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "./field";
import { Input } from "./input";
import { Textarea } from "./textarea";

const meta = {
  title: "Components/Field",
  component: Field,
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `Field` is the anatomy every form control hangs off: label, control,
 * description, error. Building an input without it is how a form ends up with
 * unlabelled controls and error text that screen readers never announce.
 */
export const Anatomy: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field>
        <FieldLabel htmlFor="anatomy">Email</FieldLabel>
        <Input id="anatomy" type="email" placeholder="ivan@mail.com" />
        <FieldDescription>Used for replies. Never published.</FieldDescription>
      </Field>
    </div>
  ),
};

/**
 * Labels are uppercase mono by default — the readout look the direction is built
 * on. Pass `variant="plain"` for anything that reads as a sentence, such as the
 * text beside a checkbox.
 */
export const LabelVariants: Story = {
  render: () => (
    <div className="grid max-w-sm gap-5">
      <Field>
        <FieldLabel htmlFor="lv-caps">Orbital period</FieldLabel>
        <Input id="lv-caps" defaultValue="92.68" />
      </Field>
      <Field>
        <FieldLabel variant="plain" htmlFor="lv-plain">
          Send me a copy of this message
        </FieldLabel>
        <Input id="lv-plain" defaultValue="ivan@mail.com" />
      </Field>
    </div>
  ),
};

/**
 * `FieldError` uses `--danger-text`, not `--destructive`. The latter is the fill
 * token and measures 3.22:1 as text on the light ground — a real failure, and
 * exactly what the three-token split exists to prevent.
 *
 * The icon is there because colour alone must not carry the meaning.
 */
export const Invalid: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field data-invalid="true">
        <FieldLabel htmlFor="invalid">Email</FieldLabel>
        <Input
          id="invalid"
          aria-invalid
          aria-describedby="invalid-error"
          defaultValue="not-an-email"
        />
        <FieldError id="invalid-error">Enter a valid email address.</FieldError>
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // `role="alert"` is what makes the message announce when it appears.
    const error = canvas.getByRole("alert");
    expect(error).toHaveTextContent("Enter a valid email address.");

    const input = canvas.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    // The error must be wired to the input, or it is announced only by luck.
    expect(input).toHaveAccessibleDescription("Enter a valid email address.");
  },
};

export const Orientations: Story = {
  render: () => (
    <FieldGroup className="max-w-md">
      <Field orientation="vertical">
        <FieldLabel htmlFor="or-v">Vertical</FieldLabel>
        <Input id="or-v" placeholder="Label above" />
      </Field>
      <Field orientation="horizontal">
        <FieldLabel htmlFor="or-h">Horizontal</FieldLabel>
        <Input id="or-h" placeholder="Label beside" />
      </Field>
    </FieldGroup>
  ),
};

export const Grouped: Story = {
  render: () => (
    <form className="max-w-md">
      <FieldSet>
        <FieldLegend>Contact</FieldLegend>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="g-name">Name</FieldLabel>
            <Input id="g-name" autoComplete="name" />
          </Field>
          <Field>
            <FieldLabel htmlFor="g-email">Email</FieldLabel>
            <Input id="g-email" type="email" autoComplete="email" />
          </Field>
          <FieldSeparator>Message</FieldSeparator>
          <Field>
            <FieldLabel htmlFor="g-message">Message</FieldLabel>
            <Textarea id="g-message" rows={4} />
            <FieldDescription>Markdown is not supported.</FieldDescription>
          </Field>
        </FieldGroup>
      </FieldSet>
      <div className="mt-6 flex justify-end gap-2">
        <Button type="reset" variant="outline">
          Reset
        </Button>
        <Button type="submit">Send</Button>
      </div>
    </form>
  ),
};

export const BothThemes: Story = {
  parameters: { bothThemes: true },
  render: () => (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="bt-f-name">Name</FieldLabel>
        <Input id="bt-f-name" placeholder="Ivan Chaus" />
        <FieldDescription>Shown publicly.</FieldDescription>
      </Field>
      <Field data-invalid="true">
        <FieldLabel htmlFor="bt-f-email">Email</FieldLabel>
        <Input id="bt-f-email" aria-invalid defaultValue="not-an-email" />
        <FieldError>Enter a valid email address.</FieldError>
      </Field>
    </FieldGroup>
  ),
};
