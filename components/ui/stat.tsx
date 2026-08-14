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
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "children"> & {
  label: React.ReactNode;
  value: React.ReactNode;
  unit?: string;
  hint?: React.ReactNode;
}) {
  return (
    <div
      data-slot="stat"
      className={cn("corner-ticks bg-card p-4", className)}
      {...props}
    >
      <dl>
        <dt className="label-caps text-muted-foreground">{label}</dt>
        <dd className="mt-2 flex items-baseline gap-1.5">
          <span className="text-3xl tabular-nums">{value}</span>
          {unit ? (
            <span className="text-xs text-muted-foreground">{unit}</span>
          ) : null}
        </dd>
      </dl>
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
