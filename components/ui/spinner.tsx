import { LoaderCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * `role="status"` plus an accessible name is what makes a spinner announce at
 * all — without it a screen reader user gets silence while the interface
 * waits. `label` exists so the announcement can name what is loading rather
 * than always saying "Loading".
 *
 * The whole kit collapses animation durations under
 * `prefers-reduced-motion: reduce`, so this stops spinning there without
 * needing its own guard.
 */
function Spinner({
  className,
  label = "Loading",
  ...props
}: React.ComponentProps<"svg"> & { label?: string }) {
  return (
    <LoaderCircleIcon
      data-slot="spinner"
      role="status"
      aria-label={label}
      strokeWidth={1.75}
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
