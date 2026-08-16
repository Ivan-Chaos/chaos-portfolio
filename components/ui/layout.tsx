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
  layout = "inline",
  children,
  ...props
}: Omit<React.ComponentProps<"section">, "title"> & {
  index?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  headingLevel?: 2 | 3 | 4;
  /**
   * `inline` stacks the header above the content — right for a narrow column
   * or a section inside a card.
   *
   * `rail` moves the header into a fixed left column from `lg`, with the index
   * figure set large above the title. It is what turns a stack of sections
   * into a datasheet: the figures line up down the page edge and the content
   * gets the space a stacked header would have taken. Below `lg` the two are
   * identical, because there is no room for a rail on a phone.
   */
  layout?: "inline" | "rail";
}) {
  // The heading id is derived from `id` rather than generated with `useId`,
  // which is a Hook and would force this whole layout primitive to become a
  // client component. Pass an `id` to make the section a named landmark; without
  // one it is still navigable by its heading, just not as a landmark.
  const headingId = id && title ? `${id}-title` : undefined;
  const Tag = `h${headingLevel}` as const;
  const rail = layout === "rail";

  const descriptionNode = description ? (
    <p className="max-w-[68ch] text-sm text-muted-foreground">{description}</p>
  ) : null;

  const header = title ? (
    <header className={cn("mb-6", rail && "lg:mb-0")}>
      <div
        className={cn(
          "flex items-baseline gap-4",
          // In rail mode the figure stops being an ornament beside the title
          // and becomes the thing the eye tracks down the page edge, so it
          // sets above the title rather than beside it.
          rail && "lg:flex-col lg:items-start lg:gap-1",
        )}
      >
        {index ? (
          <SectionFigure className={rail ? "lg:text-6xl" : undefined}>
            {index}
          </SectionFigure>
        ) : null}
        <Tag
          id={headingId}
          className="font-heading text-lg font-medium text-balance text-foreground"
        >
          {title}
        </Tag>
      </div>
      {/* In `inline` mode the description belongs under the title. In `rail`
          mode it is placed into the content column instead — see below. */}
      {!rail && descriptionNode ? (
        <div className="mt-2">{descriptionNode}</div>
      ) : null}
    </header>
  ) : null;

  return (
    <section
      data-slot="section"
      id={id}
      aria-labelledby={headingId}
      className={cn("border-t border-hairline py-10", className)}
      {...props}
    >
      {rail ? (
        // Explicit placement rather than two copies behind display utilities:
        // the description sits under the title on a phone and beside the rail
        // from `lg`, and it is one element in the DOM either way. A duplicate
        // hidden with `lg:hidden` would be read twice by anything that ignores
        // CSS, tests included.
        <div className="lg:grid lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-x-12">
          {header}
          {descriptionNode ? (
            <div className="mb-6 lg:col-start-2 lg:row-start-1">
              {descriptionNode}
            </div>
          ) : null}
          {/* `min-w-0` so a wide child — a table, a long unbroken token — is
              constrained by the track instead of widening it. */}
          <div className="min-w-0 lg:col-start-2">{children}</div>
        </div>
      ) : (
        <>
          {header}
          {children}
        </>
      )}
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
