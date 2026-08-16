"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * The pressed state takes the amber signal rather than a grey fill. A toggle is
 * a state readout, which is exactly what the signal is for — and grey-on-grey
 * pressed states are hard to read at a glance in either theme.
 *
 * `aria-pressed` and `data-[state=on]` are both matched because Base UI's
 * Toggle and ToggleGroup report the state differently.
 */
const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1.5 text-sm font-medium whitespace-nowrap transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-danger aria-pressed:bg-signal aria-pressed:text-signal-foreground aria-pressed:hover:bg-signal-hover data-[state=on]:bg-signal data-[state=on]:text-signal-foreground data-[state=on]:hover:bg-signal-hover [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "border border-transparent bg-transparent",
        outline: "border border-control bg-transparent",
      },
      size: {
        default: "h-8 min-w-8 px-2.5",
        sm: "h-7 min-w-7 px-2 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 min-w-10 px-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
