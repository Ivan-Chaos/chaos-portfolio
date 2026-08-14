import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@/lib/utils";

/**
 * Shared control surface. Exported because Textarea, NumberField and the
 * date/time controls must look identical to Input — duplicating the string
 * across four files is how they drift apart.
 *
 * `border-control`, not `border-hairline`: this border is what identifies the
 * element as an input, so it is held to 3:1. See the Surfaces foundation page.
 *
 * No focus ring and no `outline-none` — `:focus-visible` in globals.css owns
 * focus for the whole kit.
 */
const controlSurface =
  "w-full min-w-0 border border-control bg-surface-sunken text-sm transition-colors placeholder:text-muted-foreground hover:border-control-hover disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-danger";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        controlSurface,
        "h-8 px-2.5 py-1",
        // The file button is a control in its own right and needs its own
        // border, otherwise it reads as plain text sitting inside the field.
        "file:mr-2.5 file:inline-flex file:h-6 file:border file:border-control file:bg-transparent file:px-2 file:text-xs file:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

export { Input, controlSurface };
