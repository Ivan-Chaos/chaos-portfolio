import { cn } from "@/lib/utils";

/**
 * A chronological list — roles, releases, milestones.
 *
 * An ordered list, not a stack of divs: the sequence carries meaning, and `<ol>`
 * is what tells assistive technology there are five entries and this is the
 * second. The rail and markers are drawn with borders and are `aria-hidden`
 * where they are purely decorative.
 *
 * `TimelineMarker` takes `current` for the entry that is still open — marked
 * with the signal, since "this is the live one" is exactly what the signal is
 * for.
 */
function Timeline({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="timeline"
      className={cn("relative flex flex-col", className)}
      {...props}
    />
  );
}

function TimelineItem({
  className,
  current = false,
  ...props
}: React.ComponentProps<"li"> & { current?: boolean }) {
  return (
    <li
      data-slot="timeline-item"
      data-current={current || undefined}
      className={cn(
        // The rail is a left border on the item itself, so it joins up between
        // entries with no absolutely-positioned line to keep in sync.
        "group/timeline-item relative border-s border-hairline ps-6 pb-8 last:border-transparent last:pb-0",
        className,
      )}
      {...props}
    />
  );
}

/** The node on the rail. Decorative — the date and title carry the meaning. */
function TimelineMarker({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="timeline-marker"
      aria-hidden="true"
      className={cn(
        "absolute start-0 top-1 size-2 -translate-x-1/2 border",
        "border-control bg-background",
        "group-data-current/timeline-item:border-signal-edge group-data-current/timeline-item:bg-signal",
        className,
      )}
      {...props}
    />
  );
}

function TimelineDate({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="timeline-date"
      className={cn("label-caps text-muted-foreground", className)}
      {...props}
    />
  );
}

function TimelineTitle({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="timeline-title"
      className={cn("mt-1 font-heading text-base font-medium", className)}
      {...props}
    />
  );
}

function TimelineBody({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="timeline-body"
      className={cn("mt-1.5 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Timeline,
  TimelineItem,
  TimelineMarker,
  TimelineDate,
  TimelineTitle,
  TimelineBody,
};
