import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { Field, FieldDescription, FieldError, FieldLabel } from "./field";
import { Input } from "./input";
import {
  DateInput,
  DateTimeInput,
  MonthInput,
  TimeInput,
} from "./input-datetime";
import { PasswordInput } from "./input-password";
import { SearchInput } from "./input-search";

const meta = {
  title: "Components/Input",
  component: Input,
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Every input in these stories is wrapped in a `Field` with a real label.
 * That is not decoration for the demo — an input with only a placeholder has no
 * accessible name, and the axe run on these stories fails on it.
 */
export const TextTypes: Story = {
  render: () => (
    <div className="grid max-w-sm gap-5">
      <Field>
        <FieldLabel htmlFor="in-text">Full name</FieldLabel>
        <Input id="in-text" placeholder="Ivan Chaus" />
      </Field>
      <Field>
        <FieldLabel htmlFor="in-email">Email</FieldLabel>
        <Input
          id="in-email"
          type="email"
          autoComplete="email"
          placeholder="ivan@mail.com"
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="in-url">Website</FieldLabel>
        <Input id="in-url" type="url" placeholder="https://" />
      </Field>
      <Field>
        <FieldLabel htmlFor="in-tel">Phone</FieldLabel>
        <Input id="in-tel" type="tel" autoComplete="tel" />
      </Field>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="grid max-w-sm gap-5">
      <Field>
        <FieldLabel htmlFor="st-default">Default</FieldLabel>
        <Input id="st-default" placeholder="Placeholder" />
      </Field>
      <Field>
        <FieldLabel htmlFor="st-value">With value</FieldLabel>
        <Input id="st-value" defaultValue="Ivan Chaus" />
      </Field>
      <Field>
        <FieldLabel htmlFor="st-disabled">Disabled</FieldLabel>
        <Input id="st-disabled" disabled defaultValue="Not editable" />
      </Field>
      <Field data-invalid="true">
        <FieldLabel htmlFor="st-invalid">Email</FieldLabel>
        <Input id="st-invalid" aria-invalid defaultValue="not-an-email" />
        <FieldError>Enter a valid email address.</FieldError>
      </Field>
    </div>
  ),
};

/**
 * The reveal toggle is a `type="button"` — inside a form a bare `<button>`
 * submits, so revealing the password would submit the form.
 */
export const Password: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field>
        <FieldLabel htmlFor="pw">Password</FieldLabel>
        <PasswordInput id="pw" autoComplete="current-password" />
        <FieldDescription>At least 12 characters.</FieldDescription>
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Password");
    const toggle = canvas.getByRole("button", { name: "Show password" });

    expect(input).toHaveAttribute("type", "password");
    expect(toggle).toHaveAttribute("aria-pressed", "false");

    await userEvent.click(toggle);
    expect(input).toHaveAttribute("type", "text");
    // The name stays constant and only the pressed state changes — swapping the
    // label would announce as a different control.
    expect(toggle).toHaveAttribute("aria-pressed", "true");
    expect(toggle).toHaveAccessibleName("Show password");
  },
};

/** The clear control only exists when there is something to clear. */
export const Search: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field>
        <FieldLabel htmlFor="search">Search projects</FieldLabel>
        <SearchInput id="search" placeholder="Type to filter" />
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByLabelText("Search projects");

    expect(canvas.queryByRole("button", { name: "Clear search" })).toBeNull();

    await userEvent.type(input, "orbit");
    const clear = await canvas.findByRole("button", { name: "Clear search" });

    await userEvent.click(clear);
    expect(input).toHaveValue("");
    // Focus returns to the input — otherwise it lands on a button that just
    // removed itself from the DOM.
    expect(input).toHaveFocus();
  },
};

/**
 * Native date and time controls. They get the platform picker, the OS date
 * format and keyboard segment editing for free. The popup itself is browser
 * chrome and cannot be themed — where that matters, use `DatePicker`.
 */
export const DateAndTime: Story = {
  render: () => (
    <div className="grid max-w-sm gap-5">
      <Field>
        <FieldLabel htmlFor="dt-date">Date</FieldLabel>
        <DateInput id="dt-date" defaultValue="2026-08-13" />
      </Field>
      <Field>
        <FieldLabel htmlFor="dt-time">Time</FieldLabel>
        <TimeInput id="dt-time" defaultValue="09:41" />
      </Field>
      <Field>
        <FieldLabel htmlFor="dt-both">Date and time</FieldLabel>
        <DateTimeInput id="dt-both" defaultValue="2026-08-13T09:41" />
      </Field>
      <Field>
        <FieldLabel htmlFor="dt-month">Month</FieldLabel>
        <MonthInput id="dt-month" defaultValue="2026-08" />
      </Field>
    </div>
  ),
};

export const FileInput: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field>
        <FieldLabel htmlFor="file">Attachment</FieldLabel>
        <Input id="file" type="file" className="h-auto py-1.5" />
      </Field>
    </div>
  ),
};

export const BothThemes: Story = {
  parameters: { bothThemes: true },
  render: () => (
    <div className="grid gap-5">
      <Field>
        <FieldLabel htmlFor="bt-email">Email</FieldLabel>
        <Input id="bt-email" type="email" placeholder="ivan@mail.com" />
      </Field>
      <Field data-invalid="true">
        <FieldLabel htmlFor="bt-invalid">Email</FieldLabel>
        <Input id="bt-invalid" aria-invalid defaultValue="not-an-email" />
        <FieldError>Enter a valid email address.</FieldError>
      </Field>
    </div>
  ),
};
