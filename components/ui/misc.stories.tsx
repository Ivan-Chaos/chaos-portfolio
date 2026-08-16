import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChevronsUpDownIcon } from "lucide-react";
import { Button } from "./button";
import { ButtonGroup, ButtonGroupSeparator } from "./button-group";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./collapsible";
import { Field, FieldLabel } from "./field";
import { Separator } from "./separator";
import { Spinner } from "./spinner";
import { Textarea } from "./textarea";
import { Text } from "./typography";

/**
 * The smaller primitives, grouped rather than given a file each — there is not
 * enough to say about any one of them to justify its own page.
 */
const meta = {
  title: "Components/Primitives",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** `field-sizing-content` autosizes to the content with no JavaScript. */
export const TextareaSizes: Story = {
  render: () => (
    <div className="grid max-w-sm gap-5">
      <Field>
        <FieldLabel htmlFor="ta-default">Message</FieldLabel>
        <Textarea id="ta-default" rows={3} placeholder="Type a message" />
      </Field>
      <Field>
        <FieldLabel htmlFor="ta-value">Autosizing</FieldLabel>
        <Textarea
          id="ta-value"
          defaultValue={
            "This textarea grows with its content.\nAdd a line and the box follows, with no ref juggling and no resize observer."
          }
        />
      </Field>
      <Field>
        <FieldLabel htmlFor="ta-disabled">Disabled</FieldLabel>
        <Textarea id="ta-disabled" disabled defaultValue="Not editable" />
      </Field>
    </div>
  ),
};

export const ButtonGroups: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      <ButtonGroup>
        <Button variant="outline">Day</Button>
        <Button variant="outline">Week</Button>
        <Button variant="outline">Month</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Save</Button>
        <ButtonGroupSeparator />
        <Button variant="outline" size="icon" aria-label="More options">
          <ChevronsUpDownIcon aria-hidden="true" />
        </Button>
      </ButtonGroup>
    </div>
  ),
};

export const Spinners: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {(["size-3.5", "size-4", "size-6"] as const).map((size) => (
        <Spinner key={size} className={size} />
      ))}
      <span className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner label="Publishing project" />
        Publishing
      </span>
    </div>
  ),
};

export const Separators: Story = {
  render: () => (
    <div className="max-w-sm space-y-4">
      <Text tone="muted">Above the rule</Text>
      <Separator />
      <Text tone="muted">Below the rule</Text>
      <div className="flex h-8 items-center gap-3">
        <Text size="xs" tone="muted">
          Vertical
        </Text>
        <Separator orientation="vertical" />
        <Text size="xs" tone="muted">
          Separator
        </Text>
      </div>
    </div>
  ),
};

/** The disclosure primitive Accordion is built from, usable on its own. */
export const Collapsibles: Story = {
  render: () => (
    <Collapsible className="max-w-md">
      <CollapsibleTrigger
        render={
          <Button variant="outline">
            Show orbital elements
            <ChevronsUpDownIcon aria-hidden="true" data-icon="inline-end" />
          </Button>
        }
      />
      <CollapsibleContent>
        <dl className="mt-3 space-y-1.5 text-sm">
          {[
            ["Period", "92.68 min"],
            ["Apoapsis", "418.20 km"],
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
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const BothThemes: Story = {
  parameters: { bothThemes: true },
  render: () => (
    <div className="space-y-4">
      <ButtonGroup>
        <Button variant="outline">Day</Button>
        <Button variant="outline">Week</Button>
      </ButtonGroup>
      <Separator />
      <Field>
        <FieldLabel htmlFor="bt-ta">Message</FieldLabel>
        <Textarea id="bt-ta" rows={2} placeholder="Type a message" />
      </Field>
      <Spinner />
    </div>
  ),
};
