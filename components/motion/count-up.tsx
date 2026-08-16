"use client";

import * as React from "react";
import { VisuallyHidden } from "@/components/ui/skip-link";
import {
  isDocumentVisible,
  isInViewport,
  observeOnce,
  prefersReducedMotion,
  readDurationMs,
} from "@/components/motion/runtime";

/** Two slow steps, matching `Decode`. Any counter shorter than this is a flicker. */
const DURATION_STEPS = 2;

/** Same bound as `Reveal`: if the observer never reports, show the figure anyway. */
const WATCHDOG_MS = 2000;

/** The leading run of digits, which is the part that counts. */
const LEADING_DIGITS = /^\d+/;

/**
 * Counts a figure up to its value, once, when it comes on screen.
 *
 * Widths are held by **zero-padding**, not by a pinned `min-width`: `"50K+"`
 * counts through `"00K+"`, `"07K+"`, `"23K+"`, every frame exactly four
 * characters wide. With `tabular-nums` global and a monospace face that makes
 * reflow impossible rather than unlikely — and leading zeros are what an
 * instrument does anyway.
 *
 * Anything after the digits is carried verbatim, so `"10+"`, `"50%"` and
 * `"50K+"` all work without the caller decomposing them.
 *
 * The reset to zero happens during commit, before the first paint, so the
 * figure is never seen at its final value and then snapped back. The watchdog
 * bounds the one failure that would otherwise leave a permanent `"00K+"` on the
 * page.
 *
 * Deliberately **not** an `aria-live` region, and the counting node is
 * `aria-hidden` with the real value beside it: a screen reader announces the
 * figure once, as itself, rather than fifty times on the way there.
 *
 * The count is linear. A mechanical counter advances at a constant rate — and
 * the values are integers, so it is already stepped rather than smooth, which
 * is the register the anchor asks for.
 */
function CountUp({
  value,
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & { value: string }) {
  const attach = React.useCallback(
    (node: HTMLSpanElement | null) => {
      if (!node) return;
      if (prefersReducedMotion()) return;
      if (!isDocumentVisible()) return;

      const digits = LEADING_DIGITS.exec(value)?.[0];
      // No leading digits means there is nothing to count. Leave the server's
      // value alone rather than inventing an animation for it.
      if (!digits) return;

      const target = Number(digits);
      if (target === 0) return;

      const suffix = value.slice(digits.length);
      const width = digits.length;
      const total = DURATION_STEPS * readDurationMs("--duration-slow", 280);

      const render = (figure: number) => {
        node.textContent = String(figure).padStart(width, "0") + suffix;
      };

      let frame = 0;
      const run = () => {
        const startedAt = performance.now();
        const step = () => {
          const progress = Math.min(1, (performance.now() - startedAt) / total);
          render(Math.round(progress * target));
          if (progress < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      };

      // Before paint, so the figure's first appearance is already at zero.
      render(0);

      if (isInViewport(node)) {
        run();
        return () => {
          cancelAnimationFrame(frame);
          node.textContent = value;
        };
      }

      const stopObserving = observeOnce(node, run);
      const watchdog = window.setTimeout(() => {
        stopObserving();
        run();
      }, WATCHDOG_MS);

      return () => {
        window.clearTimeout(watchdog);
        stopObserving();
        cancelAnimationFrame(frame);
        node.textContent = value;
      };
    },
    [value],
  );

  return (
    <span data-slot="count-up" className={className} {...props}>
      <span aria-hidden="true" ref={attach}>
        {value}
      </span>
      <VisuallyHidden>{value}</VisuallyHidden>
    </span>
  );
}

export { CountUp };
