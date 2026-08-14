import { cn } from "@/lib/utils";

/**
 * The first thing in the tab order: a link that jumps past the navigation
 * straight to the main content.
 *
 * Visible only on focus. It is deliberately NOT `sr-only` permanently — sighted
 * keyboard users are the people this helps most, and a skip link they cannot see
 * is a skip link they cannot use. `sr-only` plus `focus:not-sr-only` is the
 * pattern that serves both.
 *
 * The target needs a matching `id` and should be focusable, so put
 * `id="main" tabIndex={-1}` on the `<main>` element. Without `tabIndex`, some
 * browsers move the scroll position but leave focus behind, and the next Tab
 * press starts from the top again.
 */
function SkipLink({
  className,
  href = "#main",
  children = "Skip to content",
  ...props
}: React.ComponentProps<"a">) {
  return (
    <a
      href={href}
      data-slot="skip-link"
      className={cn(
        "sr-only focus:not-sr-only",
        "focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:inline-flex focus:h-8 focus:items-center focus:border focus:border-signal-edge focus:bg-signal focus:px-3 focus:text-sm focus:text-signal-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}

/**
 * Content available to assistive technology but not shown.
 *
 * Polymorphic via `as`, because the element has to match its surroundings — a
 * visually hidden table header must still be a `<th>`, or the table's structure
 * breaks for exactly the users this is for.
 *
 * Generic rather than a union of tag names: a union makes React infer a single
 * conflicting `ref` type across every member and the whole thing stops
 * type-checking.
 */
type VisuallyHiddenProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className">;

function VisuallyHidden<T extends React.ElementType = "span">({
  as,
  className,
  ...props
}: VisuallyHiddenProps<T>) {
  const Tag = (as ?? "span") as React.ElementType;
  return (
    <Tag
      data-slot="visually-hidden"
      className={cn("sr-only", className)}
      {...props}
    />
  );
}

export { SkipLink, VisuallyHidden };
