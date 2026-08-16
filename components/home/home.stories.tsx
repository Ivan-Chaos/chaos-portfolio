import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { Container } from "@/components/ui/layout";
import { capabilities } from "@/content/capabilities";
import { credentials } from "@/content/education";
import { engagements } from "@/content/engagements";
import { email, gitHubUrl, linkedInUrl } from "@/content/profile";
import { readings } from "@/content/readings";
import { roles } from "@/content/roles";
import { BANDS } from "./bands";
import { CapabilitiesBand } from "./capabilities-band";
import { ContactBand } from "./contact-band";
import { EducationBand } from "./education-band";
import { EngagementsBand } from "./engagements-band";
import { MastheadBand } from "./masthead-band";
import { PracticeBand } from "./practice-band";
import { ReadoutBand } from "./readout-band";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { TrackRecordBand } from "./track-record-band";

/**
 * Every band of the home page, in page order.
 *
 * These stories are the *only* thing that puts the page's markup under axe —
 * `app/page.tsx` is never story-tested, so without them its contrast would be
 * unverified in both themes. The two Vitest story projects run each of these in
 * real Chromium, once in light and once in dark, with `parameters.a11y.test`
 * set to `error`.
 *
 * **Nothing here sets `bothThemes`, and it cannot.** The split view renders the
 * story twice into one canvas, and every band is a landmark — a `<section>`
 * with `aria-labelledby`, or a named `<nav>`. Two of them with the same
 * accessible name in one document is an axe `landmark-unique` violation, so a
 * split band story fails the run for a reason that does not exist on the real
 * page. It would also give the play functions below two of every element to
 * choose from.
 *
 * Nothing is lost: the two Vitest projects already render each of these once in
 * light and once in dark, which is where the enforcement actually comes from.
 * The side-by-side view is a review convenience, and for a whole band the thing
 * worth reviewing is the real page in two themes anyway.
 *
 * No `ThemeProvider` anywhere: `components/theme-toggle.stories.tsx` explains
 * why adding one fights the decorator in `.storybook/preview.tsx`.
 *
 * Bands are wrapped in `Container` because that is how the page composes them —
 * a band with no gutter is not a band anyone will ever see.
 */
const meta = {
  title: "Home",
  parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Header and masthead ─────────────────────────────────────────────────── */

export const Header: Story = {
  render: () => <SiteHeader />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    expect(canvas.getByRole("link", { name: "Ivan Chaus" })).toHaveAttribute(
      "href",
      "#main",
    );

    // Named, so a screen reader user can tell this nav from any other.
    const nav = canvas.getByRole("navigation", { name: "Sections" });
    expect(within(nav).getAllByRole("link")).toHaveLength(3);

    // The theme control lives in the footer and nowhere else. A preference
    // switch does not earn a permanent seat in a 56px sticky bar.
    expect(canvas.queryByRole("group", { name: "Theme" })).toBeNull();
  },
};

export const Masthead: Story = {
  render: () => (
    <Container>
      <MastheadBand />
    </Container>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Never a half-resolved string: the name comes from the copy beside the
    // animating node, so it holds at every frame of the decode.
    expect(
      canvas.getByRole("heading", { level: 1, name: "Ivan Chaus" }),
    ).toBeInTheDocument();

    // A link that looks like a button stays a link — middle-click, Cmd-click
    // and copy-link all keep working, which a Button with a handler loses.
    const primary = canvas.getByRole("link", { name: "See the work" });
    expect(primary).toHaveAttribute("href", "#engagements");

    // A mail client is not a new tab.
    const mail = canvas.getByRole("link", { name: "Email" });
    expect(mail).toHaveAttribute("href", `mailto:${email}`);
    expect(mail).not.toHaveAttribute("target");

    const linkedIn = canvas.getByRole("link", { name: /LinkedIn/ });
    expect(linkedIn).toHaveAttribute("rel", "noopener noreferrer");
    expect(linkedIn).toHaveAccessibleName(/opens in a new tab/);

    // The index panel is the whole page's shape in one place, and it is the
    // only element that knows it. If a band is added and this is not, the page
    // has a section nothing points at.
    const index = canvas.getByRole("navigation", { name: "Page index" });
    expect(within(index).getAllByRole("link")).toHaveLength(BANDS.length);
    for (const band of BANDS) {
      expect(
        within(index).getByRole("link", { name: band.title }),
      ).toHaveAttribute("href", `#${band.id}`);
    }
  },
};

/* ── Bands 01–07 ─────────────────────────────────────────────────────────── */

export const Readout: Story = {
  render: () => (
    <Container>
      <ReadoutBand />
    </Container>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Term/definition pairs, not four loose strings — a screen reader should
    // announce "Customers served, 50K+", which only works if the markup says
    // they belong together.
    expect(canvas.getAllByRole("term")).toHaveLength(readings.length);
    expect(canvas.getAllByRole("definition")).toHaveLength(readings.length);

    for (const reading of readings) {
      expect(canvas.getByText(reading.label)).toBeInTheDocument();
      expect(canvas.getByText(reading.hint)).toBeInTheDocument();
    }
  },
};

export const Practice: Story = {
  render: () => (
    <Container>
      <PracticeBand />
    </Container>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The one sanctioned use of the proportional face on this page. If this
    // element stops being `Prose`, the deviation has either moved or widened.
    const prose = canvasElement.querySelector("[data-slot='prose']");
    expect(prose).not.toBeNull();
    expect(prose).toHaveClass("prose-face");

    expect(canvas.getByText("Focus")).toBeInTheDocument();
  },
};

export const Engagements: Story = {
  render: () => (
    <Container>
      <EngagementsBand />
    </Container>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    for (const engagement of engagements) {
      expect(
        canvas.getByRole("heading", { level: 3, name: engagement.name }),
      ).toBeInTheDocument();
    }

    // Content, not navigation. There are no case-study pages, and a card that
    // reads as clickable and is not is worse than one that plainly is not.
    expect(canvas.queryAllByRole("link")).toHaveLength(0);
  },
};

export const TrackRecord: Story = {
  render: () => (
    <Container>
      <TrackRecordBand />
    </Container>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // An ordered list, so assistive technology can say "3 items, item 2".
    const timeline = canvasElement.querySelector("[data-slot='timeline']")!;
    expect(timeline.tagName).toBe("OL");
    expect(timeline.children).toHaveLength(roles.length);

    // Exactly one signal marker. Two would mean two jobs at once.
    expect(canvasElement.querySelectorAll("[data-current]")).toHaveLength(1);

    expect(
      canvas.getByRole("heading", { name: /Front-end Engineer/ }),
    ).toBeInTheDocument();
  },
};

export const Capabilities: Story = {
  render: () => (
    <Container>
      <CapabilitiesBand />
    </Container>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The highest-value a11y check on the page: `label-caps` is 11px in the
    // muted tone, which is the pairing most likely to fail on the light ground.
    expect(canvas.getAllByRole("term")).toHaveLength(capabilities.length);
    expect(canvas.getAllByRole("definition")).toHaveLength(capabilities.length);
  },
};

export const Education: Story = {
  render: () => (
    <Container>
      <EducationBand />
    </Container>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    for (const credential of credentials) {
      expect(
        canvas.getByRole("heading", {
          level: 3,
          name: credential.qualification,
        }),
      ).toBeInTheDocument();
    }
  },
};

export const Contact: Story = {
  render: () => (
    <Container>
      <ContactBand />
    </Container>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const mail = canvas.getByRole("link", { name: email });
    expect(mail).toHaveAttribute("href", `mailto:${email}`);
    expect(mail).not.toHaveAttribute("target");

    // The row's `<dt>` carries the label; the link's own text is the handle. So
    // these are matched on what they actually say, not on "LinkedIn".
    for (const { name, href } of [
      { name: /in\/ivan-chaus/, href: linkedInUrl },
      { name: /Ivan-Chaos/, href: gitHubUrl },
    ]) {
      const link = canvas.getByRole("link", { name });
      expect(link).toHaveAttribute("href", href);
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }

    // Outlined, not amber. The signal is spent by the time a reader is here.
    expect(
      canvas.getByRole("link", { name: "Start a conversation" }),
    ).toBeInTheDocument();
  },
};

/* ── Footer ──────────────────────────────────────────────────────────────── */

export const Footer: Story = {
  render: () => <SiteFooter />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The theme control lives here and only here. This assertion and the one
    // in `Header` are a pair — together they pin the decision, so moving the
    // toggle back into the header fails the run rather than passing quietly.
    const themeGroup = canvas.getByRole("group", { name: "Theme" });
    expect(within(themeGroup).getAllByRole("button")).toHaveLength(3);

    const sections = canvas.getByRole("navigation", { name: "All sections" });
    expect(within(sections).getAllByRole("link")).toHaveLength(BANDS.length);

    expect(canvas.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
      "rel",
      "noopener noreferrer",
    );
    expect(canvas.getByRole("link", { name: /Top/ })).toHaveAttribute(
      "href",
      "#main",
    );
  },
};
