import { cn } from "@/lib/utils";
import { controlSurface } from "@/components/ui/input";

/**
 * Native date, time and datetime inputs, styled onto the kit's control surface.
 *
 * These are deliberately native rather than custom widgets. `type="date"` gets
 * the platform picker — the touch wheel on iOS, the system calendar on Android,
 * the OS date format, and keyboard segment editing — all of it already
 * accessible and already familiar. A hand-built replacement has to re-earn every
 * one of those, and usually does not.
 *
 * The trade-off is honest: the picker popup itself is browser chrome and cannot
 * be themed. Everything up to the moment it opens matches the system; the popup
 * will not. Where that matters more than platform behaviour, use `DatePicker`,
 * which is fully themed and built on the Calendar.
 *
 * `--webkit-calendar-picker-indicator` is inverted in dark mode because it is a
 * fixed dark glyph that otherwise disappears against the warm-black ground.
 */
const dateTimeSurface = cn(
  controlSurface,
  "h-8 px-2.5 py-1 tabular-nums",
  "[&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-60 hover:[&::-webkit-calendar-picker-indicator]:opacity-100",
  "dark:[&::-webkit-calendar-picker-indicator]:invert",
);

function DateInput({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  return (
    <input
      type="date"
      data-slot="date-input"
      className={cn(dateTimeSurface, className)}
      {...props}
    />
  );
}

function TimeInput({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  return (
    <input
      type="time"
      data-slot="time-input"
      className={cn(dateTimeSurface, className)}
      {...props}
    />
  );
}

function DateTimeInput({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  return (
    <input
      type="datetime-local"
      data-slot="datetime-input"
      className={cn(dateTimeSurface, className)}
      {...props}
    />
  );
}

/** Month and year only — `type="month"` is well supported and often what a date range actually needs. */
function MonthInput({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  return (
    <input
      type="month"
      data-slot="month-input"
      className={cn(dateTimeSurface, className)}
      {...props}
    />
  );
}

export { DateInput, TimeInput, DateTimeInput, MonthInput, dateTimeSurface };
