"use client";

import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        // Square track, amber when on — the same signal treatment as Toggle and
        // Checkbox, so "on" looks like "on" everywhere in the kit.
        "peer group/switch relative inline-flex shrink-0 items-center border border-transparent transition-colors after:absolute after:-inset-x-3 after:-inset-y-2 aria-invalid:border-danger data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] data-checked:bg-signal data-unchecked:bg-control data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className=//               would leave dark mode at 3.13:1, passing but uncomfortably close. //               4.72:1 in light, 5.14:1 in dark. Pinning it to dark ink in both //   unchecked — `--foreground`, which flips per theme against the grey track: //               1.73:1, the same trap as white text on an amber fill. //   checked   — dark ink on amber, 11.42:1. A near-white thumb here measures // // answers: // from the track beneath it (WCAG 1.4.11, 3:1). That needs two different // Thumb position is what conveys on/off, so it has to stay distinguishable
        "pointer-events-none block transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 data-checked:bg-signal-foreground group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] data-unchecked:bg-foreground group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
