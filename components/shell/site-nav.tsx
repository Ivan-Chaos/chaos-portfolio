"use client";

import { usePathname } from "next/navigation";
import { Link } from "@/components/ui/link";
import { cn } from "@/lib/utils";
import { COMPACT_HEADER_LINKS, HEADER_LINKS, isCurrentRoute } from "./nav";

/**
 * The header's link list, and the only client component in the shell.
 *
 * It is a client component for one reason: `usePathname()`, which is what marks
 * the current route. A layout has no access to the pathname, and a nested
 * `app/news/layout.tsx` that knew it would have to render a second header.
 *
 * Deliberately the smallest possible island — a `<ul>` of four links. The
 * header itself, its `Container`, the brand and the gauge all stay
 * server-rendered.
 *
 * **The current route is marked with ink and `aria-current`, and no amber.**
 * The signal is already spent four times (the masthead mark, the masthead CTA,
 * the current-role marker, the gauge). A fifth on a nav item would be the worst
 * available fifth: permanently lit on two of the three routes, which is exactly
 * how an accent stops meaning "the one important thing". Ink versus muted is
 * this direction's own vocabulary of emphasis outside amber, and `aria-current`
 * carries the fact to assistive tech regardless of the visual. One device, not
 * two — no underline (the `quiet` treatment reserves that for hover), no box,
 * no dot.
 */
function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Site">
      <ul className="flex items-center gap-4 sm:gap-6">
        {HEADER_LINKS.map((link) => {
          const current = isCurrentRoute(link, pathname);

          return (
            <li
              key={link.id}
              className={
                COMPACT_HEADER_LINKS.includes(link.id)
                  ? undefined
                  : "hidden sm:block"
              }
            >
              <Link
                href={link.href}
                variant="quiet"
                aria-current={current ? "page" : undefined}
                className={cn(
                  "flex items-baseline gap-1.5 text-xs",
                  current ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <span
                  aria-hidden="true"
                  className="hidden text-2xs tabular-nums sm:inline"
                >
                  {link.index}
                </span>
                {link.title}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export { SiteNav };
