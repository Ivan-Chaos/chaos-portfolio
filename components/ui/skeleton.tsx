import { cn } from "@/lib/utils";

/**
 * A loading placeholder.
 *
 * Two things a skeleton usually gets wrong and this one does not:
 *
 * `aria-hidden` — a screen reader has nothing useful to say about a grey box,
 * and announcing a dozen of them is worse than silence. The surrounding region
 * should carry `aria-busy` so the *state* is announced once.
 *
 * The pulse is `animate-pulse` rather than the shimmer sweep in
 * `shadcn/tailwind.css`: a sweep implies a moving light source, and this
 * direction has no light sources. The base layer collapses the animation under
 * `prefers-reduced-motion: reduce`, so it stops without its own guard.
 */
function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      aria-hidden="true"
      className={cn("animate-pulse bg-muted", className)}
      {...props}
    />
  );
}

export { Skeleton };
