import { cn } from "@/lib/utils";

/**
 * A labelled measurement — the readout unit this whole direction is built
 * around.
 *
 * Rendered as a `<dl>` pair rather than two divs, because a stat *is* a
 * term/value relationship and the markup should say so. A screen reader then
 * announces "Orbital period, 92.68 minutes" instead of three loose strings.
 *
 * The unit sits in its own muted span so the figure stays the loudest thing,
 * and `tabular-nums` keeps a column of these aligned.
 */
function Stat({
  label,
  value,
  unit,
  hint,
  scale = false,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  label: React.ReactNode;
  value: React.ReactNode;
  unit?: string;
  hint?: React.ReactNode;
  /**
   * Draws a `tick-scale` ruler edge under the figure, so the stat reads as a
   * value on an instrument face. Decoration, not a gauge: the ticks carry no
   * data reading, which is exactly why they have no contrast threshold.
   */
  scale?: boolean;
}) {
  return (
    <div
      data-slot="stat"
      className={cn("bg-card corner-ticks p-4", className)}
      {...props}
    >
      <dl>
        <dt className="label-caps text-muted-foreground">{label}</dt>
        <dd className="mt-2 flex items-baseline gap-1.5">
          {/* Slotted so a caller can scale the figure without reaching in with
              a positional child selector. The figure is the point of a readout;
              how loud it should be depends on how much room it has. */}
          <span data-slot="stat-value" className="text-3xl tabular-nums">
            {value}
          </span>
          {unit ? (
            <span className="text-xs text-muted-foreground">{unit}</span>
          ) : null}
        </dd>
      </dl>
      {scale ? (
        <div aria-hidden="true" className="mt-3 h-2 tick-scale" />
      ) : null}
      {hint ? (
        <p className="mt-2 text-2xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

/** A row of stats, separated by hairlines rather than gaps. */
function StatGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="stat-group"
      className={cn(
        "grid gap-px bg-hairline sm:grid-cols-2 lg:grid-cols-4 [&>*]:bg-card",
        className,
      )}
      {...props}
    />
  );
}

export { Stat, StatGroup };
