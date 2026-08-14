"use client";

import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

/**
 * A fully themed date picker: the Calendar in a Popover.
 *
 * Use this when the picker's appearance matters. Use `DateInput` when platform
 * behaviour matters more — see the note in input-datetime.tsx.
 *
 * Formatting goes through `Intl.DateTimeFormat` rather than a hand-rolled
 * template so it follows the user's locale. `format` is overridable for the
 * cases where a fixed presentation is the point.
 *
 * The trigger is a `<button>` reporting `aria-haspopup="dialog"`, and the
 * selected date is its accessible name — a trigger that just says "Choose date"
 * gives a screen-reader user no way to know what is currently set.
 */
function DatePicker({
  value,
  onValueChange,
  placeholder = "Choose date",
  format,
  disabled,
  className,
  id,
  ...props
}: Omit<React.ComponentProps<"button">, "value" | "onChange"> & {
  value?: Date;
  onValueChange?: (date: Date | undefined) => void;
  placeholder?: string;
  format?: Intl.DateTimeFormatOptions;
}) {
  const [open, setOpen] = React.useState(false);

  const formatted = value
    ? new Intl.DateTimeFormat(
        undefined,
        format ?? { year: "numeric", month: "short", day: "2-digit" },
      ).format(value)
    : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <button
            type="button"
            id={id}
            disabled={disabled}
            data-slot="date-picker-trigger"
            aria-haspopup="dialog"
            className={cn(
              "flex h-8 w-full items-center gap-2 border border-control bg-surface-sunken px-2.5 text-sm transition-colors hover:border-control-hover disabled:pointer-events-none disabled:opacity-50",
              !formatted && "text-muted-foreground",
              className,
            )}
            {...props}
          >
            <CalendarIcon
              aria-hidden="true"
              strokeWidth={1.75}
              className="size-4 shrink-0 text-muted-foreground"
            />
            <span className="tabular-nums">{formatted ?? placeholder}</span>
          </button>
        }
      />
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          autoFocus
          selected={value}
          defaultMonth={value}
          onSelect={(date) => {
            onValueChange?.(date);
            // Close on pick. Leaving it open after a single selection means the
            // user has to dismiss a panel that has nothing left to say.
            if (date) setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

export { DatePicker };
