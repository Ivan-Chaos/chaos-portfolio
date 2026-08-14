import type { Meta, StoryObj } from "@storybook/nextjs-vite";

/**
 * These stories exist to be *tested*, not just looked at.
 *
 * The MDX foundation pages document the token set, but MDX docs pages are not
 * stories and so are never visited by the test runner. Rendering every token
 * pairing as real text on its real background here is what puts the palette
 * under axe — and because `vitest.config.mts` runs one browser project per
 * theme, every pairing below is contrast-checked in light *and* dark on every
 * `pnpm check`.
 *
 * A regression in `app/globals.css` therefore fails the build rather than
 * waiting to be noticed. Swatches alone would not do this: axe's contrast rule
 * needs text on a background, not a colored square.
 */
const meta = {
  title: "Foundation/Tokens",
  parameters: {
    layout: "fullscreen",
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const SURFACES = [
  {
    bg: "bg-background",
    fg: "text-foreground",
    label: "foreground on background",
  },
  {
    bg: "bg-background",
    fg: "text-muted-foreground",
    label: "muted on background",
  },
  { bg: "bg-card", fg: "text-card-foreground", label: "foreground on card" },
  { bg: "bg-muted", fg: "text-foreground", label: "foreground on muted" },
  {
    bg: "bg-accent",
    fg: "text-accent-foreground",
    label: "foreground on accent",
  },
  {
    bg: "bg-surface-sunken",
    fg: "text-foreground",
    label: "foreground on sunken",
  },
  { bg: "bg-primary", fg: "text-primary-foreground", label: "primary pair" },
  {
    bg: "bg-secondary",
    fg: "text-secondary-foreground",
    label: "secondary pair",
  },
];

const HUES = [
  { bg: "bg-signal", fg: "text-signal-foreground", label: "signal fill" },
  { bg: "bg-background", fg: "text-signal-text", label: "signal as text" },
  { bg: "bg-danger", fg: "text-danger-foreground", label: "danger fill" },
  { bg: "bg-background", fg: "text-danger-text", label: "danger as text" },
  { bg: "bg-success", fg: "text-success-foreground", label: "success fill" },
  { bg: "bg-background", fg: "text-success-text", label: "success as text" },
];

const TYPE_STEPS = [
  "text-3xl",
  "text-2xl",
  "text-xl",
  "text-lg",
  "text-base",
  "text-sm",
  "text-xs",
  "text-2xs",
];

function Sample({ bg, fg, label }: { bg: string; fg: string; label: string }) {
  return (
    <div className={`${bg} ${fg} border border-hairline p-3`}>
      <p className="text-sm">{label}</p>
      <p className="text-2xs">Orbital period 92.68 min</p>
    </div>
  );
}

/** Every semantic surface pairing, as text on its ground. */
export const Surfaces: Story = {
  render: () => (
    <div className="grid gap-3 bg-background p-6 sm:grid-cols-2 lg:grid-cols-4">
      {SURFACES.map((s) => (
        <Sample key={s.label} {...s} />
      ))}
    </div>
  ),
};

/**
 * The signal and status pairings — the ones the plan called out as the risky
 * half of the palette, since amber as text and amber as fill have different
 * requirements and only the fill is theme-stable.
 */
export const SignalAndStatus: Story = {
  render: () => (
    <div className="grid gap-3 bg-background p-6 sm:grid-cols-2 lg:grid-cols-3">
      {HUES.map((s) => (
        <Sample key={s.label} {...s} />
      ))}
    </div>
  ),
};

/** Both themes at once. Use the toolbar for overlay components instead. */
export const BothThemes: Story = {
  parameters: { bothThemes: true },
  render: () => (
    <div className="grid gap-3 sm:grid-cols-2">
      {[...SURFACES.slice(0, 4), ...HUES].map((s) => (
        <Sample key={s.label} {...s} />
      ))}
    </div>
  ),
};

/** Small type is where contrast failures actually bite, so it is checked too. */
export const TypeScale: Story = {
  render: () => (
    <div className="bg-background p-6 text-foreground">
      {TYPE_STEPS.map((step) => (
        <div
          key={step}
          className="flex flex-wrap items-baseline justify-between gap-2 border-b border-hairline py-2"
        >
          <span className={step}>Orbital mechanics 0123456789</span>
          <span className="text-2xs text-muted-foreground">{step}</span>
        </div>
      ))}
      <p className="mt-4 label-caps text-muted-foreground">label-caps</p>
      <p className="mt-4 max-w-prose prose-face">
        The proportional face, which is the one sanctioned deviation from the
        anchor and applies to long-form prose only.
      </p>
      <p className="mt-4 figure-condensed text-5xl">01 02 03 04</p>
    </div>
  ),
};

/** The differentiator, at its three tunable properties. */
export const CornerTicks: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6 bg-background p-6 text-foreground">
      <div className="bg-surface-raised corner-ticks p-6 text-sm">default</div>
      <div className="bg-surface-raised corner-ticks p-6 text-sm [--tick-len:1.25rem]">
        longer arms
      </div>
      <div className="bg-surface-raised corner-ticks p-6 text-sm [--tick-color:var(--signal)]">
        signal color
      </div>
      <div className="bg-surface-raised corner-ticks p-6 text-sm [--tick-len:1rem] [--tick-w:2px]">
        heavier
      </div>
    </div>
  ),
};
