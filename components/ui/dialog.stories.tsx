import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "./button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Field, FieldLabel } from "./field";
import { Input } from "./input";

/**
 * Overlays portal to `document.body`, which is outside both panels of the
 * side-by-side view — so these stories have no `bothThemes` variant. Use the
 * toolbar theme switch to check dark and light.
 */
const meta = {
  title: "Components/Dialog",
  component: Dialog,
} satisfies Meta<typeof Dialog>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Edit profile</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Changes are saved when you close this dialog.
          </DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor="dlg-name">Name</FieldLabel>
          <Input id="dlg-name" defaultValue="Ivan Chaus" />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Cancel</Button>} />
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

/**
 * The behaviour worth testing is not that it opens — it is that focus moves in,
 * that the dialog is named, and that Escape gets you out. Those are the parts
 * that break silently.
 */
export const OpensAndTraps: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button>Open dialog</Button>} />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm details</DialogTitle>
          <DialogDescription>
            A short description of what this dialog is for.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline">Close</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open dialog" });

    await userEvent.click(trigger);

    // The dialog renders in a portal, so query the whole document.
    const dialog = await within(document.body).findByRole("dialog");
    expect(dialog).toHaveAccessibleName("Confirm details");
    expect(dialog).toHaveAccessibleDescription(
      "A short description of what this dialog is for.",
    );

    await waitFor(() =>
      expect(dialog).toContainElement(document.activeElement as HTMLElement),
    );

    await userEvent.keyboard("{Escape}");
    await waitFor(() =>
      expect(within(document.body).queryByRole("dialog")).toBeNull(),
    );
    // Focus returns to what opened it, rather than the top of the document.
    await waitFor(() => expect(trigger).toHaveFocus());
  },
};

export const LongContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger render={<Button variant="outline">Read terms</Button>} />
      <DialogContent className="max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Scrolling content</DialogTitle>
          <DialogDescription>
            The panel scrolls rather than the page behind it.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm text-muted-foreground">
          {Array.from({ length: 12 }, (_, i) => (
            <p key={i}>
              Paragraph {i + 1} of sample body copy, present to make the panel
              overflow so the scrolling behaviour is visible.
            </p>
          ))}
        </div>
        <DialogFooter>
          <DialogClose render={<Button>Done</Button>} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
