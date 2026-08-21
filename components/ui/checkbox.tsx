"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";

import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        // Checked takes the amber signal, matching Toggle: a checkbox is a state
        // readout, which is what the signal is for.
        //
        // Square, like everything else. It stays distinguishable from a Radio because
        // the *indicator* differs — a checkmark here, a solid inset square there. That
        // is the conventional round/square distinction re-expressed in a system that
        // has no round.
        //
        // `after:-inset-x-3 after:-inset-y-2` keeps the pointer target near 40x32
        // while the visible box stays 16px.
        "peer relative flex size-4 shrink-0 items-center justify-center border border-control transition-colors group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger data-checked:border-signal-edge data-checked:bg-signal data-checked:text-signal-foreground",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
