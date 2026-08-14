import { ArrowUpRightIcon } from "lucide-react";
import NextLink from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const linkVariants = cva(
  "inline-flex items-center gap-1 underline-offset-4 transition-colors [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /** Underlined at rest — for links inside a paragraph, where nothing else marks them. */
        default:
          "underline decoration-control hover:text-signal-text hover:decoration-current",
        /** Underlined on hover — for links in a nav or list, where position already marks them. */
        quiet: "hover:text-signal-text hover:underline",
        /** Carries the signal at rest. Use sparingly; it is the accent. */
        signal: "text-signal-text underline decoration-current",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

/**
 * Wraps `next/link` and handles the external case, which is the part that is
 * usually got wrong.
 *
 * An `href` that leaves the site gets `target="_blank"` plus
 * `rel="noopener noreferrer"` — `noopener` because a new tab otherwise gets a
 * handle back to this window via `window.opener`, and `noreferrer` to stop the
 * referrer leaking. It also gets a visible arrow and, critically, screen-reader
 * text saying the link opens a new tab: a tab switching without warning is
 * disorienting when you cannot see it happen.
 *
 * Detection is automatic but overridable — pass `external` explicitly for a
 * relative URL that is proxied somewhere else.
 */
function Link({
  className,
  variant,
  href,
  external,
  showExternalIcon = true,
  children,
  ...props
}: React.ComponentProps<typeof NextLink> &
  VariantProps<typeof linkVariants> & {
    external?: boolean;
    showExternalIcon?: boolean;
  }) {
  const asString = typeof href === "string" ? href : "";
  const isExternal =
    external ??
    (/^https?:\/\//.test(asString) || asString.startsWith("mailto:"));

  return (
    <NextLink
      data-slot="link"
      href={href}
      className={cn(linkVariants({ variant }), className)}
      {...(isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : undefined)}
      {...props}
    >
      {children}
      {isExternal && showExternalIcon ? (
        <>
          <ArrowUpRightIcon
            aria-hidden="true"
            strokeWidth={1.75}
            className="size-3.5"
          />
          <span className="sr-only">(opens in a new tab)</span>
        </>
      ) : null}
    </NextLink>
  );
}

export { Link, linkVariants };
