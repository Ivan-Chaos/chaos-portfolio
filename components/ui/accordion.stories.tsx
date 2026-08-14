import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./accordion";

const meta = {
  title: "Components/Accordion",
  component: Accordion,
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const ITEMS = [
  {
    value: "anchor",
    q: "What is the anchor?",
    a: "The single aesthetic direction the system commits to. It names a fixed set of tokens, so output falling outside them means the anchor did not hold.",
  },
  {
    value: "signal",
    q: "Why is amber three tokens?",
    a: "Because a hue behaves differently as a fill than as text. Amber under near-black ink measures 11.42:1 in both themes; the same amber as text on the light ground is 1.57:1.",
  },
  {
    value: "hairline",
    q: "When do I use control instead of hairline?",
    a: "Whenever the border identifies an interactive element. Hairline is decorative and sits below 3:1, which is fine for a divider and an accessibility bug on an input.",
  },
];

export const Default: Story = {
  render: () => (
    <Accordion className="max-w-lg">
      {ITEMS.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground">{item.a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

export const DefaultOpen: Story = {
  render: () => (
    <Accordion defaultValue={["signal"]} className="max-w-lg">
      {ITEMS.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground">{item.a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

/**
 * The trigger must be a button that reports `aria-expanded`, and the panel must
 * be associated with it. Without both, a screen-reader user gets a list of
 * unlabelled toggles and no idea what opened.
 */
export const TogglesAndAnnounces: Story = {
  render: () => (
    <Accordion className="max-w-lg">
      {ITEMS.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground">{item.a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: ITEMS[0].q });

    expect(trigger).toHaveAttribute("aria-expanded", "false");

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    await userEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  },
};

/**
 * `landmark-unique` is disabled here, and only here.
 *
 * Base UI gives each open panel `role="region"` with a name taken from its
 * trigger — correct, and useful. The side-by-side view renders the whole story
 * twice, so those named regions appear twice and axe flags them as duplicate
 * landmarks. That is a property of the harness, not of the component: in the app
 * the accordion renders once. The rule stays on for every other story, including
 * the single-theme accordion ones above.
 */
export const BothThemes: Story = {
  parameters: {
    bothThemes: true,
    a11y: { config: { rules: [{ id: "landmark-unique", enabled: false }] } },
  },
  render: () => (
    <Accordion defaultValue={["anchor"]}>
      {ITEMS.slice(0, 2).map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.q}</AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground">{item.a}</p>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};
