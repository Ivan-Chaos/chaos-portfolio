import { Container } from "@/components/ui/layout";
import { Link } from "@/components/ui/link";
import { profile } from "@/content/profile";
import { SiteNav } from "./site-nav";

/**
 * Sticky from `sm`, static below it.
 *
 * A 56px bar is a tenth of a 390px-wide phone's viewport, and the home page is
 * one scroll — pinning the header there costs more than the links it keeps
 * reachable. From `sm` the trade reverses.
 *
 * **Four links, and below `sm` two.** Four is what fits a 56px bar once one of
 * them is a route: the arithmetic and the choice of which two survive the
 * compact breakpoint are both in `./nav.ts`, where the list lives. Still no
 * hamburger — a `Sheet` for four links is machinery in place of a decision, the
 * same as it was for three. The full eight-band list lives in the masthead
 * index, which is the thing a phone reaches by scrolling rather than by tapping.
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
        {/* `/`, not `#main`. Two different jobs were conflated while there was
            one page: the brand means "the site's front page", and the footer's
            *Top* link means "the top of the page you are on". Now that there is
            more than one page they are different destinations. */}
        <Link
          href="/"
          variant="quiet"
          className="font-heading text-sm font-medium text-foreground"
        >
          {profile.name}
        </Link>

        <SiteNav />
      </Container>

      {/* The gauge — scroll progress drawn along the header's rule, the page
          reading itself out. `-bottom-px` sets it on the border itself, so the
          amber overwrites the hairline as it passes rather than floating a
          pixel above it. Decoration: hidden from assistive tech, absent under
          reduced motion, and absent in browsers without scroll timelines. */}
      {/* It reads the document rather than an article, and stays that way on a
          dispatch page — where the two are very nearly the same thing. A
          `view-timeline` scoped to the `<article>` would be more precise at the
          foot of a long read and would make the gauge mean two different things
          on two routes, which is a worse trade. */}
      {/* `signal-edge` for the same reason the focus ring drops to `--ring`'s
          solved value in light: a 2px amber line at 1.57:1 on the light ground
          is a gauge nobody can read. */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 -bottom-px h-0.5 scroll-gauge bg-signal-edge"
      />
    </header>
  );
}

export { SiteHeader };
