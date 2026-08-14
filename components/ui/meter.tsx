"use client";

import { Meter as MeterPrimitive } from "@base-ui/react/meter";
import { cn } from "@/lib/utils";

/**
 * A meter is not a progress bar, and the distinction is semantic rather than
 * visual.
 *
 * `Progress` measures how far along a task is — it starts empty and fills toward
 * completion. A meter measures a level within a known range that is not going
 * anywhere: disk usage, battery, capacity, a score. Screen readers announce them
 * differently (`role="meter"` vs `role="progressbar"`), so using the wrong one
 * misdescribes what the number means.
 *
 * If the value only ever goes up and then the thing is done, that is Progress.
 */
function Meter({ className, ...props }: MeterPrimitive.Root.Props) {
  return (
    <MeterPrimitive.Root
      data-slot="meter"
      className={cn("flex w-full flex-col gap-1.5", className)}
      {...props}
    />
  );
}

function MeterLabel({ className, ...props }: MeterPrimitive.Label.Props) {
  return (
    <MeterPrimitive.Label
      data-slot="meter-label"
      className={cn("label-caps text-muted-foreground", className)}
      {...props}
    />
  );
}

function MeterValue({ className, ...props }: MeterPrimitive.Value.Props) {
  return (
    <MeterPrimitive.Value
      data-slot="meter-value"
      className={cn("text-sm tabular-nums", className)}
      {...props}
    />
  );
}

function MeterTrack({ className, ...props }: MeterPrimitive.Track.Props) {
  return (
    <MeterPrimitive.Track
      data-slot="meter-track"
      className={cn("h-1 w-full overflow-hidden bg-muted", className)}
      {...props}
    />
  );
}

function MeterIndicator({
  className,
  ...props
}: MeterPrimitive.Indicator.Props) {
  return (
    <MeterPrimitive.Indicator
      data-slot="meter-indicator"
      className={cn("h-full bg-signal transition-all", className)}
      {...props}
    />
  );
}

export { Meter, MeterLabel, MeterValue, MeterTrack, MeterIndicator };
