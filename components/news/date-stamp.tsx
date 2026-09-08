import type { Dispatch } from "@/content/schema";

/**
 * A dispatch's publication date, with the machine-readable half marked up as
 * `<time>`.
 *
 * The sibling of `components/home/date-range.tsx`, and it stores the same two
 * fields for the same reason: the ISO value is what `datetime` needs and what
 * sorts, the label is how the date actually reads, and neither is derived from
 * the other or from the clock. `Intl` renders month abbreviations differently
 * per runtime, which is the kind of difference that shows up as a hydration
 * mismatch rather than as a wrong date.
 */
function DateStamp({
  dispatch,
  className,
  ...props
}: Omit<React.ComponentProps<"time">, "children" | "dateTime"> & {
  dispatch: Dispatch;
}) {
  return (
    <time
      data-slot="date-stamp"
      dateTime={dispatch.published}
      className={className}
      {...props}
    >
      {dispatch.publishedLabel}
    </time>
  );
}

export { DateStamp };
