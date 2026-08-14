import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* ── Heading ─────────────────────────────────────────────────────────────── */

const headingVariants = cva("font-heading text-foreground text-balance", {
  variants: {
    size: {
      "3xl": "text-5xl font-semibold",
      "2xl": "text-4xl font-semibold",
      xl: "text-3xl font-semibold",
      lg: "text-2xl font-medium",
      md: "text-xl font-medium",
      sm: "text-lg font-medium",
      xs: "text-base font-medium",
    },
  },
  defaultVariants: { size: "lg" },
});

/**
 * `level` sets the tag, `size` sets the appearance, and they are separate on
 * purpose: heading level is document structure that screen readers navigate by,
 * and it should never be chosen to get a particular font size. A page with an
 * `h1` followed by an `h4` because `h4` "looked right" is a broken outline.
 *
 * `size` defaults from `level` so the common case stays one prop.
 */
function Heading({
  level = 2,
  size,
  className,
  ...props
}: React.ComponentProps<"h2"> &
  VariantProps<typeof headingVariants> & { level?: 1 | 2 | 3 | 4 | 5 | 6 }) {
  const Tag = `h${level}` as const;
  const fallback = (
    { 1: "2xl", 2: "xl", 3: "lg", 4: "md", 5: "sm", 6: "xs" } as const
  )[level];

  return (
    <Tag
      data-slot="heading"
      className={cn(headingVariants({ size: size ?? fallback }), className)}
      {...props}
    />
  );
}

/* ── Text ────────────────────────────────────────────────────────────────── */

const textVariants = cva("", {
  variants: {
    size: {
      lg: "text-lg",
      md: "text-base",
      sm: "text-sm",
      xs: "text-xs",
      "2xs": "text-2xs",
    },
    tone: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      signal: "text-signal-text",
      danger: "text-danger-text",
      success: "text-success-text",
    },
  },
  defaultVariants: { size: "sm", tone: "default" },
});

/**
 * Monospace running text — the default for everything that is not long-form
 * prose. Tones map to the `-text` tokens rather than the fills, which is what
 * keeps them legible in light mode.
 */
function Text({
  className,
  size,
  tone,
  asChild = false,
  ...props
}: React.ComponentProps<"p"> &
  VariantProps<typeof textVariants> & { asChild?: boolean }) {
  const Tag = asChild ? "span" : "p";
  return (
    <Tag
      data-slot="text"
      className={cn(textVariants({ size, tone }), className)}
      {...props}
    />
  );
}

/* ── Prose ───────────────────────────────────────────────────────────────── */

/**
 * The one sanctioned use of the proportional face. See
 * docs/adr/0004-industrial-anchor.md — widening this beyond long-form text is
 * how the deviation stops being a deviation and starts being drift.
 *
 * The measure is capped because `prose-face` sets a larger size than the chrome
 * around it, and unbounded line length is the actual readability problem the
 * face switch was made to solve.
 */
function Prose({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="prose"
      className={cn(
        "max-w-[68ch] prose-face text-foreground",
        "[&_a]:underline [&_a]:decoration-control [&_a]:underline-offset-4 [&_a:hover]:text-signal-text",
        "[&_p+p]:mt-4 [&_strong]:font-semibold",
        className,
      )}
      {...props}
    />
  );
}

/* ── Kicker and section figure ───────────────────────────────────────────── */

/** The wide uppercase marker above a section title. */
function Kicker({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="kicker"
      className={cn(
        "text-2xs tracking-kicker text-muted-foreground uppercase",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Oversized condensed numerals used as composition elements — section indices,
 * not data. `aria-hidden` because "01" announced before every heading is noise;
 * the heading beside it carries the meaning.
 */
function SectionFigure({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="section-figure"
      aria-hidden="true"
      className={cn(
        "figure-condensed text-4xl leading-none text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

/* ── Numerals ────────────────────────────────────────────────────────────── */

/**
 * A measured value with an optional unit.
 *
 * `tabular-nums` is already global, so this exists for the alignment and the
 * unit rather than the figures: right-aligned values with a muted unit is the
 * readout pattern the whole direction is built around.
 */
function Numeral({
  value,
  unit,
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & {
  value: React.ReactNode;
  unit?: string;
}) {
  return (
    <span
      data-slot="numeral"
      className={cn("inline-flex items-baseline gap-1.5", className)}
      {...props}
    >
      <span className="tabular-nums">{value}</span>
      {unit ? (
        <span className="text-2xs text-muted-foreground">{unit}</span>
      ) : null}
    </span>
  );
}

/* ── Code ────────────────────────────────────────────────────────────────── */

/**
 * Ligatures are re-enabled here and only here. JetBrains Mono's code ligatures
 * are right in a code sample and wrong in a button label, which is why the base
 * layer disables them globally.
 */
function Code({ className, ...props }: React.ComponentProps<"code">) {
  return (
    <code
      data-slot="code"
      className={cn(
        "border border-hairline bg-surface-sunken px-1 py-0.5 text-[0.9em] [font-variant-ligatures:normal]",
        className,
      )}
      {...props}
    />
  );
}

function CodeBlock({
  className,
  children,
  ...props
}: React.ComponentProps<"pre">) {
  return (
    <pre
      data-slot="code-block"
      // `tabindex=0` so a keyboard user can scroll an overflowing block —
      // without it the content is reachable by mouse only.
      tabIndex={0}
      className={cn(
        "overflow-x-auto border border-hairline bg-surface-sunken p-3 text-xs [font-variant-ligatures:normal]",
        className,
      )}
      {...props}
    >
      <code>{children}</code>
    </pre>
  );
}

export {
  Heading,
  Text,
  Prose,
  Kicker,
  SectionFigure,
  Numeral,
  Code,
  CodeBlock,
  headingVariants,
  textVariants,
};
