import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const SIZES = {
  xs: "size-3",
  sm: "size-3.5",
  md: "size-4",
  lg: "size-5",
  xl: "size-6",
} as const;

/**
 * Wrapper over Lucide that makes the accessibility decision unavoidable.
 *
 * An icon is either decorative or it is the only label, and the two need
 * opposite markup. Getting it wrong is the most common failure in an icon-heavy
 * interface: a decorative icon that announces duplicates its neighbouring text,
 * and an icon-only button with no name is a button called "button".
 *
 * So: pass `label` when the icon carries the meaning, omit it when adjacent text
 * already does. There is no third option and no way to forget.
 *
 *     <Icon as={Search} />                 beside the word "Search"
 *     <Icon as={X} label="Close" />        an icon-only close button
 *
 * `strokeWidth` is 1.75, not Lucide's default 2 — at these sizes 2 reads heavier
 * than the monospace stems beside it. See the Icons foundation page.
 */
function Icon({
  as: Component,
  size = "md",
  label,
  className,
  ...props
}: Omit<React.ComponentProps<LucideIcon>, "ref"> & {
  as: LucideIcon;
  size?: keyof typeof SIZES;
  label?: string;
}) {
  return (
    <Component
      data-slot="icon"
      strokeWidth={1.75}
      className={cn("shrink-0", SIZES[size], className)}
      {...(label
        ? { role: "img", "aria-label": label }
        : { "aria-hidden": true, focusable: false })}
      {...props}
    />
  );
}

export { Icon };
