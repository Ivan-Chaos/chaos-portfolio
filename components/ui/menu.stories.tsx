import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "./button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./hover-card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./sheet";

/** All of these portal to `document.body`, so none has a `bothThemes` story. */
const meta = {
  title: "Components/Menus and panels",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Dropdown: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Options</Button>} />
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Project</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Rename
            <DropdownMenuShortcut>⌘R</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>Archive</DropdownMenuItem>
              <DropdownMenuItem>Drafts</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export const CheckboxAndRadioItems: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">View</Button>} />
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Columns</DropdownMenuLabel>
        <DropdownMenuCheckboxItem defaultChecked>
          Orbital period
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem>Apoapsis</DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Sort</DropdownMenuLabel>
        <DropdownMenuRadioGroup defaultValue="name">
          <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="date">Date</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

/**
 * A menu is one tab stop with arrow-key movement inside, and the trigger must
 * report `aria-expanded`. Both are the parts that regress without anyone
 * noticing.
 */
export const MenuKeyboard: Story = {
  render: () => (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline">Options</Button>} />
      <DropdownMenuContent>
        <DropdownMenuItem>Rename</DropdownMenuItem>
        <DropdownMenuItem>Duplicate</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Options" });

    expect(trigger).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(trigger);

    const body = within(document.body);
    await waitFor(() => expect(body.getByRole("menu")).toBeVisible());
    expect(trigger).toHaveAttribute("aria-expanded", "true");
    expect(body.getAllByRole("menuitem")).toHaveLength(2);

    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(body.queryByRole("menu")).toBeNull());
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const Sheets: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      {(["left", "right", "top", "bottom"] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger render={<Button variant="outline">{side}</Button>} />
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>
                A panel anchored to the {side} edge.
              </SheetDescription>
            </SheetHeader>
            <SheetFooter>
              <SheetClose render={<Button variant="outline">Close</Button>} />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
};

/**
 * A hover card is supplementary by definition — it opens on hover and focus, and
 * never carries information that exists nowhere else, because touch users will
 * not see it.
 */
export const HoverCards: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger
        render={<Button variant="underline">Orbital period</Button>}
      />
      <HoverCardContent className="w-72">
        <p className="text-sm text-muted-foreground">
          The time taken to complete one orbit, measured from one periapsis
          passage to the next.
        </p>
      </HoverCardContent>
    </HoverCard>
  ),
};
