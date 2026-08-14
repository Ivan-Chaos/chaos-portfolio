import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Avatar, AvatarFallback, AvatarGroup } from "./avatar";
import { Badge } from "./badge";
import { Kbd, KbdGroup } from "./kbd";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { VisuallyHidden } from "./skip-link";

const meta = {
  title: "Components/Display",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Status badges are marked by an edge and coloured text rather than a washed
 * fill — the same reasoning as Alert. `default` and `signal` are fills because
 * they are not status, they are emphasis.
 */
export const Badges: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {(
        [
          "default",
          "signal",
          "secondary",
          "outline",
          "danger",
          "success",
          "ghost",
        ] as const
      ).map((variant) => (
        <Badge key={variant} variant={variant}>
          {variant}
        </Badge>
      ))}
    </div>
  ),
};

export const Avatars: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      {(["sm", "default", "lg"] as const).map((size) => (
        <Avatar key={size} size={size}>
          <AvatarFallback>IC</AvatarFallback>
        </Avatar>
      ))}
      <AvatarGroup>
        {["IC", "AB", "CD"].map((initials) => (
          <Avatar key={initials}>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
    </div>
  ),
};

/** `<kbd>` is a real element and carries meaning — this only styles it. */
export const Keys: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4 text-sm">
      <span className="flex items-center gap-2">
        Open search
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </span>
      <span className="flex items-center gap-2">
        Dismiss
        <Kbd>Esc</Kbd>
      </span>
    </div>
  ),
};

/**
 * A table needs a caption and real header cells, or it is a grid of strings.
 * The caption is visually hidden here because the surrounding heading already
 * says what the table is — but it still has to exist for anyone navigating by
 * table.
 *
 * Numeric columns are right-aligned and tabular, which is what makes a column of
 * figures scannable.
 */
export const Tables: Story = {
  render: () => (
    <div className="max-w-lg">
      <Table>
        <TableCaption>
          <VisuallyHidden>Orbital elements, sample values</VisuallyHidden>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Element</TableHead>
            <TableHead className="text-right">Value</TableHead>
            <TableHead>Unit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[
            ["Orbital period", "92.68", "min"],
            ["Apoapsis", "418.20", "km"],
            ["Periapsis", "413.05", "km"],
            ["Inclination", "51.64", "deg"],
          ].map(([element, value, unit]) => (
            <TableRow key={element}>
              <TableCell>{element}</TableCell>
              <TableCell className="text-right tabular-nums">{value}</TableCell>
              <TableCell className="text-muted-foreground">{unit}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const table = canvas.getByRole("table");
    expect(table).toHaveAccessibleName("Orbital elements, sample values");
    expect(canvas.getAllByRole("columnheader")).toHaveLength(3);
    expect(canvas.getAllByRole("row")).toHaveLength(5);
  },
};

export const BothThemes: Story = {
  parameters: { bothThemes: true },
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Badge>default</Badge>
        <Badge variant="signal">signal</Badge>
        <Badge variant="danger">danger</Badge>
        <Badge variant="success">success</Badge>
        <Badge variant="outline">outline</Badge>
      </div>
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarFallback>IC</AvatarFallback>
        </Avatar>
        <KbdGroup>
          <Kbd>Ctrl</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </div>
    </div>
  ),
};
