"use client";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import * as React from "react";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Calendar } from "./calendar";
import { DatePicker } from "./date-picker";
import { Field, FieldDescription, FieldLabel } from "./field";

/**
 * Base UI ships no Calendar, so this is built on react-day-picker via shadcn's
 * registry — a real accessible calendar rather than a hand-rolled grid.
 *
 * Choose between this and `DateInput` deliberately: `DateInput` gets the
 * platform picker and the OS date format for free but cannot theme the popup;
 * this is fully themed but re-implements the picker.
 *
 * The popover portals to `document.body`, so there is no `bothThemes` story.
 */
const meta = {
  title: "Components/DatePicker",
  component: DatePicker,
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled() {
  const [date, setDate] = React.useState<Date | undefined>();
  return (
    <div className="max-w-64">
      <Field>
        <FieldLabel htmlFor="dp">Launch date</FieldLabel>
        <DatePicker id="dp" value={date} onValueChange={setDate} />
        <FieldDescription>
          The trigger reports the selected date as its accessible name.
        </FieldDescription>
      </Field>
    </div>
  );
}

export const Default: Story = { render: () => <Controlled /> };

/** Selection takes the amber signal — the selected day is exactly the kind of state the signal marks. */
export const CalendarOnly: Story = {
  render: () => {
    function Inline() {
      const [date, setDate] = React.useState<Date | undefined>(
        new Date(2026, 7, 13),
      );
      return (
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          defaultMonth={new Date(2026, 7, 1)}
          className="w-fit border border-hairline"
        />
      );
    }
    return <Inline />;
  },
};

export const OpensAndSelects: Story = {
  render: () => <Controlled />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByLabelText("Launch date");

    expect(trigger).toHaveAttribute("aria-haspopup", "dialog");
    await userEvent.click(trigger);

    const body = within(document.body);
    await waitFor(() => expect(body.getByRole("grid")).toBeVisible());

    // react-day-picker names day cells with the full date, e.g.
    // "Thursday, August 13th, 2026" — not the bare number.
    const day = body.getAllByRole("button", {
      name: /\b\d{1,2}(st|nd|rd|th), \d{4}$/,
    })[0];
    await userEvent.click(day);

    // Picking closes the panel — leaving it open means dismissing something
    // that has nothing left to say.
    await waitFor(() => expect(body.queryByRole("grid")).toBeNull());
  },
};
