import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { Checkbox } from "./checkbox";
import { Field, FieldDescription, FieldLabel, FieldSet, FieldLegend } from "./field";
import { RadioGroup, RadioGroupItem } from "./radio-group";
import { Switch } from "./switch";

/**
 * Selection controls, together — because the design decision that matters spans
 * all three and only makes sense side by side.
 */
const meta = {
  title: "Components/Selection",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Checkbox and Radio are both square, which is the anchor holding — but they
 * stay distinguishable by their *indicator*: a checkmark against a solid inset
 * square. That is the conventional round/square distinction re-expressed in a
 * system that has no round.
 *
 * Both take the amber signal when selected, matching Toggle and Switch, so "on"
 * looks like "on" everywhere.
 */
export const CheckboxVersusRadio: Story = {
  render: () => (
    <div className="grid gap-8 sm:grid-cols-2">
      <FieldSet>
        <FieldLegend variant="label">Checkbox — many of many</FieldLegend>
        <div className="flex flex-col gap-3">
          {["Unchecked", "Checked", "Disabled"].map((label, i) => (
            <Field key={label} orientation="horizontal">
              <Checkbox
                id={`cb-${i}`}
                defaultChecked={i === 1}
                disabled={i === 2}
              />
              <FieldLabel variant="plain" htmlFor={`cb-${i}`}>
                {label}
              </FieldLabel>
            </Field>
          ))}
        </div>
      </FieldSet>

      <FieldSet>
        <FieldLegend variant="label">Radio — one of many</FieldLegend>
        <RadioGroup defaultValue="b" className="flex flex-col gap-3">
          {[
            ["a", "Unselected"],
            ["b", "Selected"],
          ].map(([value, label]) => (
            <Field key={value} orientation="horizontal">
              <RadioGroupItem id={`rg-${value}`} value={value} />
              <FieldLabel variant="plain" htmlFor={`rg-${value}`}>
                {label}
              </FieldLabel>
            </Field>
          ))}
        </RadioGroup>
      </FieldSet>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const unchecked = canvas.getByRole("checkbox", { name: "Unchecked" });
    expect(unchecked).not.toBeChecked();
    await userEvent.click(unchecked);
    expect(unchecked).toBeChecked();

    // Roles differ even though the shapes match, which is what actually tells
    // assistive tech these are different kinds of control.
    expect(canvas.getAllByRole("radio")).toHaveLength(2);
    expect(canvas.getByRole("radio", { name: "Selected" })).toBeChecked();
  },
};

/**
 * The thumb is dark ink on the amber track and `--foreground` on the grey one.
 * Thumb position conveys the state, so it has to stay distinguishable from the
 * track — a near-white thumb on amber measures 1.73:1.
 */
export const Switches: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {[
        { id: "sw-off", label: "Off", checked: false },
        { id: "sw-on", label: "On", checked: true },
        { id: "sw-dis", label: "Disabled", checked: false, disabled: true },
      ].map(({ id, label, checked, disabled }) => (
        <Field key={id} orientation="horizontal">
          <Switch id={id} defaultChecked={checked} disabled={disabled} />
          <FieldLabel variant="plain" htmlFor={id}>
            {label}
          </FieldLabel>
        </Field>
      ))}
      <Field orientation="horizontal">
        <Switch id="sw-sm" size="sm" defaultChecked />
        <FieldLabel variant="plain" htmlFor="sw-sm">
          Small
        </FieldLabel>
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const off = canvas.getByRole("switch", { name: "Off" });

    expect(off).not.toBeChecked();
    await userEvent.click(off);
    expect(off).toBeChecked();
  },
};

/** A checkbox with a description — the anatomy Field exists to make routine. */
export const WithDescription: Story = {
  render: () => (
    <div className="max-w-sm">
      <Field orientation="horizontal">
        <Checkbox id="cb-desc" defaultChecked />
        <div>
          <FieldLabel variant="plain" htmlFor="cb-desc">
            Send me a copy
          </FieldLabel>
          <FieldDescription>
            A copy of this message goes to the address above.
          </FieldDescription>
        </div>
      </Field>
    </div>
  ),
};

export const BothThemes: Story = {
  parameters: { bothThemes: true },
  render: () => (
    <div className="flex flex-col gap-3">
      <Field orientation="horizontal">
        <Checkbox id="bt-cb" defaultChecked />
        <FieldLabel variant="plain" htmlFor="bt-cb">
          Checkbox
        </FieldLabel>
      </Field>
      <RadioGroup defaultValue="x">
        <Field orientation="horizontal">
          <RadioGroupItem id="bt-rg" value="x" />
          <FieldLabel variant="plain" htmlFor="bt-rg">
            Radio
          </FieldLabel>
        </Field>
      </RadioGroup>
      <Field orientation="horizontal">
        <Switch id="bt-sw" defaultChecked />
        <FieldLabel variant="plain" htmlFor="bt-sw">
          Switch
        </FieldLabel>
      </Field>
    </div>
  ),
};
