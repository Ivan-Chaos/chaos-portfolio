"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  isInViewport,
  observeOnce,
  prefersReducedMotion,
} from "@/components/motion/runtime";

/**
 * If a band is armed and the observer never reports back — a browser quirk, an
 * ancestor that is `display: none` at the wrong moment, a script that failed
 * after this one ran — the band stays invisible for good. Two seconds of
 * patience, then it shows regardless. Cheap insurance against the only failure
 * mode on this page that loses content.
 */
const WATCHDOG_MS = 2000;

/**
 * Fades and lifts its children as they enter the viewport. Once, never again.
 *
 * **It cannot hide content.** The hidden state comes from `data-reveal-armed`,
 * and that attribute is only ever written by the callback below — so it does
 * not exist in server-rendered HTML. With JavaScript off, with a failed
 * hydration, or to a crawler that never runs a script, every child is visible.
 * A test in `app/page.test.tsx` asserts exactly that about the whole page.
 *
 * **It cannot shift layout.** Only `opacity` and `transform` are touched, and
 * neither reflows. That is the entire reason nothing else is in scope here.
 *
 * The animation itself is CSS — `tw-animate-css`'s `animate-in`, driven by this
 * project's own motion tokens — so it inherits the global reduced-motion guard
 * in `globals.css` for free. The callback below still bails on reduced motion
 * rather than relying on that, because arming an element the guard then reveals
 * in 0.01ms is a pointless round trip.
 *
 * Note `animation-duration-(--duration-base)` rather than `duration-base`.
 * Tailwind's `duration-*` utility resolves against the `--transition-duration-*`
 * namespace, which this project does not populate — `duration-base` compiles to
 * nothing at all, with no error and no warning. See Foundation → Motion.
 *
 * **Compose this around a band; never inside one.** Bands stay pure server
 * components that way, and their stories render with no animation, so axe never
 * measures an element mid-fade.
 *
 * It also declares `group/reveal`, so decorative parts of a band can react to
 * the same state without a second observer. The pattern to follow is the one
 * used here: express the *hidden* half against `data-reveal-armed`, never the
 * visible half against `data-revealed` — armed cannot exist in server output,
 * so anything keyed to it fails visible.
 */
function Reveal({ className, ...props }: React.ComponentProps<"div">) {
  const attach = React.useCallback((node: HTMLDivElement | null) => {
    // React 19 calls the returned cleanup on detach rather than calling this
    // with null, but a null guard costs one line and survives that changing.
    if (!node) return;
    if (prefersReducedMotion()) return;

    const reveal = () => {
      // The two states are mutually exclusive rather than layered. Leaving
      // `data-reveal-armed` in place and overriding it with a second opacity
      // utility would make the outcome depend on which of the two lands later
      // in the generated stylesheet, which is not something to rely on.
      delete node.dataset.revealArmed;
      node.dataset.revealed = "";
    };

    // Already on screen at mount: go straight to the animated state. This runs
    // during commit, before paint, so the element never paints hidden first.
    if (isInViewport(node)) {
      reveal();
      return;
    }

    node.dataset.revealArmed = "";

    const stopObserving = observeOnce(node, reveal);
    const watchdog = window.setTimeout(() => {
      stopObserving();
      reveal();
    }, WATCHDOG_MS);

    return () => {
      window.clearTimeout(watchdog);
      stopObserving();
    };
  }, []);

  return (
    <div
      ref={attach}
      data-slot="reveal"
      className={cn(
        "group/reveal",
        "data-reveal-armed:opacity-0",
        "data-revealed:animate-in data-revealed:fade-in data-revealed:slide-in-from-bottom-2",
        "ease-mech-out animation-duration-(--duration-base)",
        className,
      )}
      {...props}
    />
  );
}

export { Reveal };
