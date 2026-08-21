import { cn } from "@/lib/utils";

/**
 * Hairline-ruled term/definition rows — the page's third structural device,
 * after the corner-ticked card and the hairline-gutter grid.
 *
 * A real `<dl>`, because every use of it is genuinely a term and its value:
 * Focus / Rendering / Domains in Practice, the discipline groups in
 * Capabilities, and the contact methods. A stack of divs would look the same
 * and tell a screen reader nothing about the pairing.
 *
 * Rules rather than gaps, so the band reads as a readout rather than as a list
 * of cards. The list carries the closing rule; each row carries its own opening
 * one, which is what keeps them joined with no doubled 2px line between.
 */
function ReadoutList({ className, ...props }: React.ComponentProps<"dl">) {
  return (
    <dl
      data-slot="readout-list"
      className={cn("border-b border-hairline", className)}
      {...props}
    />
  );
}

/**
 * One row. Stacked below `sm` — a mono term and a long definition do not share
 * a 390px line — and a fixed label column above it, which is what makes a
 * column of these scannable.
 *
 * The `<div>` between `<dl>` and its pairs is valid HTML5 and is what lets a
 * row be a grid without the term and definition becoming separate grid items
 * of the list itself.
 */
function ReadoutRow({
  term,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  term: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      data-slot="readout-row"
      className={cn(
        "grid gap-1 border-t border-hairline py-3",
        "sm:grid-cols-[10rem_minmax(0,1fr)] sm:gap-4",
        className,
      )}
      {...props}
    >
      <dt className="label-caps text-muted-foreground">{term}</dt>
      {/* `min-w-0` is not optional in a mono layout: without it a long
          unbroken definition sets the track's minimum width and pushes the
          whole page into horizontal scroll. */}
      <dd className="min-w-0 text-sm">{children}</dd>
    </div>
  );
}

export { ReadoutList, ReadoutRow };
