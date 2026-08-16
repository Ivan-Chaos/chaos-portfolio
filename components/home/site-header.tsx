import { Container } from "@/components/ui/layout";
import { Link } from "@/components/ui/link";
import { profile } from "@/content/profile";
import { BANDS, COMPACT_HEADER_ANCHOR, HEADER_ANCHORS } from "./bands";

const ANCHORS = HEADER_ANCHORS.map((id) =>
  BANDS.find((band) => band.id === id)!,
);

/**
 * Sticky from `sm`, static below it.
 *
 * A 56px bar is a tenth of a 390px-wide phone's viewport, and this page is one
 * scroll — pinning the header there costs more than the three links it keeps
 * reachable. From `sm` the trade reverses. The full seven-band list lives in
 * the masthead index; three is what fits here without a hamburger, and a
 * `Sheet` for three links is machinery in place of a decision.
 *
 * **Solid, not blurred.** `backdrop-blur` under a sticky bar is the reflex, and
 * it is a soft edge — which this direction does not have. A hairline over the
 * page ground is the whole vocabulary of separation here.
 *
 * **No theme control.** It lives in the footer, once, and nowhere else — a
 * preference switch is not a primary action and does not earn a permanent seat
 * in the viewport.
 *
 * `z-40` keeps it under Base UI's portalled overlays, which manage their own
 * layer. The layout foundation reserves an explicit `z-*` for exactly this case
 * and nothing else.
 */
function SiteHeader() {
  return (
    <header className="relative z-40 border-b border-hairline bg-background sm:sticky sm:top-0">
      <Container className="flex h-14 items-center justify-between gap-4">
        <Link
          href="#main"
          variant="quiet"
          className="font-heading text-sm font-medium text-foreground"
        >
          {profile.name}
        </Link>

        <nav aria-label="Sections">
          <ul className="flex items-center gap-4 sm:gap-6">
            {ANCHORS.map((anchor) => (
              <li
                key={anchor.id}
                className={
                  anchor.id === COMPACT_HEADER_ANCHOR
                    ? undefined
                    : "hidden sm:block"
                }
              >
                <Link
                  href={`#${anchor.id}`}
                  variant="quiet"
                  className="flex items-baseline gap-1.5 text-xs text-muted-foreground"
                >
                  <span
                    aria-hidden="true"
                    className="hidden text-2xs tabular-nums sm:inline"
                  >
                    {anchor.index}
                  </span>
                  {anchor.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </header>
  );
}

export { SiteHeader };
