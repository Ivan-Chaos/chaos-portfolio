import type { Range } from "@/content/schema";

/**
 * A date range, with the machine-readable halves marked up as `<time>`.
 *
 * Two elements rather than one, because `<time>` carries a single `datetime`
 * and a range is two instants. The open end is deliberately *not* a `<time>`:
 * "Present" has no valid `datetime` value, and inventing today's date for it
 * would make the markup claim the role ended on the day the page was rendered.
 */
function DateRange({
  range,
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & { range: Range }) {
  return (
    <span data-slot="date-range" className={className} {...props}>
      <time dateTime={range.start}>{range.startLabel}</time>
      <span aria-hidden="true"> — </span>
      <span className="sr-only"> to </span>
      {range.end ? (
        <time dateTime={range.end}>{range.endLabel}</time>
      ) : (
        range.endLabel
      )}
    </span>
  );
}

export { DateRange };
