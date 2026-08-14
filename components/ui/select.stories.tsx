import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Field, FieldDescription, FieldLabel } from "./field";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "./native-select";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./select";

/**
 * Select portals its listbox to `document.body`, so there is no `bothThemes`
 * story here — use the toolbar.
 */
const meta = {
  title: "Components/Select",
  component: Select,
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const ORBITS = [
  { value: "leo", label: "Low Earth" },
  { value: "meo", label: "Medium Earth" },
  { value: "geo", label: "Geostationary" },
  { value: "heo", label: "Highly elliptical" },
];

export const Default: Story = {
  render: () => (
    <div className="max-w-64">
      <Field>
        <FieldLabel htmlFor="sel-orbit">Orbit</FieldLabel>
        <Select>
          <SelectTrigger id="sel-orbit" className="w-full">
            <SelectValue placeholder="Choose an orbit" />
          </SelectTrigger>
          <SelectContent>
            {ORBITS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </div>
  ),
};

export const Grouped: Story = {
  render: () => (
    <div className="max-w-64">
      <Field>
        <FieldLabel htmlFor="sel-grouped">Orbit</FieldLabel>
        <Select defaultValue="leo">
          <SelectTrigger id="sel-grouped" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Near</SelectLabel>
              {ORBITS.slice(0, 2).map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Far</SelectLabel>
              {ORBITS.slice(2).map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="grid max-w-64 gap-5">
      <Field>
        <FieldLabel htmlFor="sel-dis">Disabled</FieldLabel>
        <Select disabled defaultValue="leo">
          <SelectTrigger id="sel-dis" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="leo">Low Earth</SelectItem>
          </SelectContent>
        </Select>
      </Field>
      <Field data-invalid="true">
        <FieldLabel htmlFor="sel-inv">Invalid</FieldLabel>
        <Select>
          <SelectTrigger id="sel-inv" aria-invalid className="w-full">
            <SelectValue placeholder="Choose an orbit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="leo">Low Earth</SelectItem>
          </SelectContent>
        </Select>
      </Field>
    </div>
  ),
};

/**
 * The native control, for when the platform picker is worth more than a themed
 * one — long option lists on mobile especially, where the OS wheel beats any
 * custom listbox.
 */
export const Native: Story = {
  render: () => (
    <div className="max-w-64">
      <Field>
        <FieldLabel htmlFor="sel-native">Orbit</FieldLabel>
        <NativeSelect id="sel-native" defaultValue="leo">
          <NativeSelectOptGroup label="Near">
            <NativeSelectOption value="leo">Low Earth</NativeSelectOption>
            <NativeSelectOption value="meo">Medium Earth</NativeSelectOption>
          </NativeSelectOptGroup>
          <NativeSelectOptGroup label="Far">
            <NativeSelectOption value="geo">Geostationary</NativeSelectOption>
          </NativeSelectOptGroup>
        </NativeSelect>
        <FieldDescription>Uses the platform picker.</FieldDescription>
      </Field>
    </div>
  ),
};

/** A select must be operable by keyboard alone and must report its value. */
export const KeyboardAndValue: Story = {
  render: () => (
    <div className="max-w-64">
      <Field>
        <FieldLabel htmlFor="sel-kb">Orbit</FieldLabel>
        <Select>
          <SelectTrigger id="sel-kb" className="w-full">
            <SelectValue placeholder="Choose an orbit" />
          </SelectTrigger>
          <SelectContent>
            {ORBITS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByLabelText("Orbit");

    await userEvent.click(trigger);

    const body = within(document.body);
    await waitFor(() => expect(body.getByRole("listbox")).toBeVisible());

    await userEvent.click(body.getByRole("option", { name: "Geostationary" }));
    await waitFor(() => expect(trigger).toHaveTextContent("Geostationary"));
  },
};
