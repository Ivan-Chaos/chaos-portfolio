import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { toast } from "sonner";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Button } from "./button";
import { Toaster } from "./sonner";

/**
 * The `Toaster` lives once in the root layout, inside the `ThemeProvider`. Each
 * story mounts its own so the toasts have somewhere to go.
 *
 * Toasts portal to `document.body`, so there is no `bothThemes` story.
 *
 * See docs/adr/0006-sonner-for-toasts.md for why sonner rather than Base UI's
 * Toast — they are not interchangeable APIs.
 */
const meta = {
  title: "Components/Toast",
  component: Toaster,
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Statuses: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button variant="outline" onClick={() => toast("Draft saved")}>
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.success("Project published")}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.error("Could not reach the server")}
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.warning("Unsaved changes will be lost")}
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() => toast.info("Two collaborators are editing")}
      >
        Info
      </Button>
    </div>
  ),
};

/**
 * The status colours use the `-text` tokens rather than the fills. A toast
 * border and icon are small marks on the popover surface, and the fill tokens
 * fail contrast at that size in light mode.
 */
export const WithDescriptionAndAction: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button
        variant="outline"
        onClick={() =>
          toast.success("Project published", {
            description: "It is now visible to anyone with the link.",
            action: { label: "Undo", onClick: () => toast("Publish reverted") },
          })
        }
      >
        With description and action
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
            loading: "Publishing",
            success: "Project published",
            error: "Could not publish",
          })
        }
      >
        Promise
      </Button>
    </div>
  ),
};

/**
 * A toast has to reach assistive technology, or it is a message only sighted
 * users receive. Sonner renders into a live region — this asserts the text
 * actually arrives there.
 */
export const Announces: Story = {
  render: () => (
    <Button onClick={() => toast.success("Project published")}>
      Publish project
    </Button>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole("button", { name: "Publish project" }),
    );

    await waitFor(() =>
      expect(
        within(document.body).getByText("Project published"),
      ).toBeVisible(),
    );
  },
};
