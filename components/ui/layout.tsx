import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { SectionFigure } from "@/components/ui/typography";

/* ── Container ───────────────────────────────────────────────────────────── */

const containerVariants = cva("mx-auto w-full px-5 sm:px-8", {
  variants: {
    width: {
      /** Long-form reading. Narrower than it looks — monospace runs wide. */
      prose: "max-w-3xl",
      /** The default page width. */
      default: "max-w-5xl",
      wide: "max-w-7xl",
      full: "max-w-none",
    },
  },
  defaultVariants: { width: "default" },
});

function Container({
  className,
  width,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof containerVariants>) {
  return (
    <div
      data-slot="container"
      className={cn(containerVariants({ width }), className)}
      {...props}
    />
  );
}

/* ── Section ─────────────────────────────────────────────────────────────── */

/**
 * A titled band of content, separated by a rule rather than by whitespace alone
 * — the hairline is the structural device this direction uses where others
 * would use spacing or a card.
 *
 * `index` renders the oversized condensed figure beside the title. It is
 * `aria-hidden` inside `SectionFigure`, so the heading text stays the accessible
 * name and "01" is not read out before every section.
 *
 * Renders a real `<section>` with `aria-labelledby` pointing at its own heading
 * when one is given, which is what makes it a landmark worth navigating to.
 */
function Section({
  className,
  id,
  index,
  title,
  description,
  headingLevel = 2,
  children,
  ...props
}: Omit<React.ComponentProps<"section">, "title"> & {
  index?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  headingLevel?: 2 | 3 | 4;
}) {
  // The heading id is derived from `id` rather than generated with `useId`,
  // which is a Hook and would force this whole layout primitive to become a
  // client component. Pass an `id` to make the section a named landmark; without
  // one it is still navigable by its heading, just not as a landmark.
  const headingId = id && title ? `${id}-title` : undefined;
  const Tag = `h${headingLevel}` as const;

  return (
    <section
      data-slot="section"
      id={id}
      aria-labelledby={headingId}
      className={cn("border-t border-hairline py-10", className)}
      {...props}
    >
      {title ? (
        <header className="mb-6">
          <div className="flex items-baseline gap-4">
            {index ? <SectionFigure>{index}</SectionFigure> : null}
            <Tag
              id={headingId}
              className="font-heading text-lg font-medium text-foreground"
            >
              {title}
            </Tag>
          </div>
          {description ? (
            <p className="mt-2 max-w-[68ch] text-sm text-muted-foreground">
              {description}
            </p>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}

/* ── Divider ─────────────────────────────────────────────────────────────── */

/**
 * A rule, optionally interrupted by a label.
 *
 * The labelled form uses `bg-background` behind the text to punch through the
 * line. That only works on the page ground — pass a matching background class
 * when placing one on a card or a sunken surface.
 */
function Divider({
  className,
  children,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> & { orientation?: "horizontal" | "vertical" }) {
  if (orientation === "vertical") {
    return (
      <Separator
        orientation="vertical"
        className={className}
        data-slot="divider"
      />
    );
  }

  if (!children) {
    return (
      <Separator
        orientation="horizontal"
        className={className}
        data-slot="divider"
      />
    );
  }

  return (
    <div
      data-slot="divider"
      className={cn("relative flex items-center py-2", className)}
      {...props}
    >
      <Separator className="absolute inset-x-0 top-1/2" />
      <span className="relative mx-auto bg-background px-2 label-caps text-muted-foreground">
        {children}
      </span>
    </div>
  );
}

export { Container, Section, Divider, containerVariants };
