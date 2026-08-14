import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";

const meta = {
  title: "Components/Tabs",
  component: Tabs,
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

const PANELS = [
  {
    value: "elements",
    label: "Elements",
    body: "Orbital elements describe the shape and orientation of an orbit.",
  },
  {
    value: "ground",
    label: "Ground track",
    body: "The ground track is the path traced over the surface below.",
  },
  {
    value: "passes",
    label: "Passes",
    body: "A pass is an interval during which the object is above the horizon.",
  },
];

/**
 * `line` is the default variant here rather than the tracked pills upstream
 * ships. With `--radius: 0` those pills degrade into grey rectangles that read
 * as disabled buttons; a signal underline marks the active tab without
 * pretending anything is raised.
 */
export const Line: Story = {
  render: () => (
    <Tabs defaultValue="elements" className="max-w-lg">
      <TabsList>
        {PANELS.map((p) => (
          <TabsTrigger key={p.value} value={p.value}>
            {p.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {PANELS.map((p) => (
        <TabsContent key={p.value} value={p.value}>
          <p className="text-sm text-muted-foreground">{p.body}</p>
        </TabsContent>
      ))}
    </Tabs>
  ),
};

/** `enclosed` keeps a container, built from a hairline rather than a fill. */
export const Enclosed: Story = {
  render: () => (
    <Tabs defaultValue="elements" className="max-w-lg">
      <TabsList variant="enclosed">
        {PANELS.map((p) => (
          <TabsTrigger key={p.value} value={p.value}>
            {p.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {PANELS.map((p) => (
        <TabsContent key={p.value} value={p.value}>
          <p className="text-sm text-muted-foreground">{p.body}</p>
        </TabsContent>
      ))}
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs defaultValue="elements" orientation="vertical" className="max-w-xl">
      <TabsList>
        {PANELS.map((p) => (
          <TabsTrigger key={p.value} value={p.value}>
            {p.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {PANELS.map((p) => (
        <TabsContent key={p.value} value={p.value}>
          <p className="text-sm text-muted-foreground">{p.body}</p>
        </TabsContent>
      ))}
    </Tabs>
  ),
};

/**
 * Tabs are a single tab stop, and arrow keys move between them. That is the
 * ARIA pattern and it is the part that silently regresses — an implementation
 * where Tab visits every trigger is the common bug.
 */
export const KeyboardNavigation: Story = {
  render: () => (
    <Tabs defaultValue="elements" className="max-w-lg">
      <TabsList>
        {PANELS.map((p) => (
          <TabsTrigger key={p.value} value={p.value}>
            {p.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {PANELS.map((p) => (
        <TabsContent key={p.value} value={p.value}>
          <p className="text-sm text-muted-foreground">{p.body}</p>
        </TabsContent>
      ))}
    </Tabs>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const first = canvas.getByRole("tab", { name: "Elements" });
    expect(first).toHaveAttribute("aria-selected", "true");
    expect(canvas.getByText(/Orbital elements describe/)).toBeVisible();

    await userEvent.click(canvas.getByRole("tab", { name: "Passes" }));
    // Both panels are briefly in the DOM during the transition — one inert — so
    // assert on the selected tab and the visible copy rather than on a single
    // `tabpanel` match.
    expect(canvas.getByRole("tab", { name: "Passes" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await waitFor(() =>
      expect(canvas.getByText(/above the horizon/)).toBeVisible(),
    );

    // The keyboard contract is a roving tabindex: exactly one tab is reachable
    // by Tab, and the arrow keys move between them. Asserting on focus rather
    // than selection keeps this true whether the implementation activates
    // automatically or on Enter.
    const tabs = canvas.getAllByRole("tab");
    const reachable = tabs.filter((t) => t.getAttribute("tabindex") !== "-1");
    expect(reachable).toHaveLength(1);

    tabs[2].focus();
    await userEvent.keyboard("{ArrowLeft}");
    await waitFor(() =>
      expect(canvas.getByRole("tab", { name: "Ground track" })).toHaveFocus(),
    );
  },
};

export const BothThemes: Story = {
  parameters: { bothThemes: true },
  render: () => (
    <Tabs defaultValue="elements">
      <TabsList>
        {PANELS.map((p) => (
          <TabsTrigger key={p.value} value={p.value}>
            {p.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value="elements">
        <p className="text-sm text-muted-foreground">{PANELS[0].body}</p>
      </TabsContent>
    </Tabs>
  ),
};
