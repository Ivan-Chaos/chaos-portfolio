import { cn } from "@/lib/utils";
import { controlSurface } from "@/components/ui/input";

/**
 * `field-sizing-content` is what makes this autosize to its content with no
 * JavaScript and no ref juggling — the browser does it. `rows` still sets the
 * starting height, and `min-h` keeps it from collapsing when empty.
 *
 * Shares `controlSurface` with Input so the two cannot drift apart.
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        controlSurface,
        "flex field-sizing-content min-h-16 px-2.5 py-2",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
