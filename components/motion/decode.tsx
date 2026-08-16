"use client";

import * as React from "react";
import { VisuallyHidden } from "@/components/ui/skip-link";
import {
  isDocumentVisible,
  prefersReducedMotion,
  readDurationMs,
} from "@/components/motion/runtime";

/**
 * Uppercase and digits only. Mixed-case noise reads as a rendering fault rather
 * than as a value resolving, and punctuation-heavy noise reads as mojibake.
 */
const NOISE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/**
 * How long a glyph holds before it is re-rolled.
 *
 * The anchor's characteristic movement is stepped, not interpolated — `ease-snap`
 * is `steps(3, end)` for the same reason. 45ms is roughly three display frames,
 * so the substitution reads as discrete positions rather than as a blur.
 */
const STEP_MS = 45;

/** Two slow steps. Long enough to register, short enough not to be waited on. */
const DURATION_STEPS = 2;

/** Unresolved glyphs sit one ink step back from resolved ones. */
const UNRESOLVED_CLASS = "text-muted-foreground";

/**
 * Resolves a string out of noise, once, on mount.
 *
 * Spent on the masthead name and nowhere else. It is the typographic
 * counterpart of the amber signal: distinctive because it happens once, and
 * worth nothing if it happens on every heading.
 *
 * Four rules hold this together, and each of them is load-bearing:
 *
 * 1. **The final text ships in the server HTML.** The spans below render the
 *    real characters; the script only takes over after mount. Without this the
 *    page serves scrambled text to crawlers and to anyone with scripting off.
 * 2. **The animating node is `aria-hidden`, with a real name beside it.** A
 *    screen reader gets "Ivan Chaus", never "IVAN CH4X9". This is also what
 *    keeps the heading's accessible name stable for tests.
 * 3. **Opacity is never touched.** This is the largest element above the fold
 *    and therefore the LCP candidate; an element at `opacity: 0` is excluded
 *    from LCP outright and does not recover by fading in.
 * 4. **Unresolved glyphs are dimmer than resolved ones.** Same-colour noise
 *    reads as corruption. Dimmer noise reads as a value settling, which is the
 *    entire point of the effect.
 *
 * The script rewrites `textContent`, which the reduced-motion guard in
 * `globals.css` cannot reach — so it asks the question itself and simply does
 * nothing when the answer is yes.
 */
function Decode({
  text,
  className,
  ...props
}: Omit<React.ComponentProps<"span">, "children"> & { text: string }) {
  const attach = React.useCallback(
    (node: HTMLSpanElement | null) => {
      if (!node) return;
      if (prefersReducedMotion()) return;
      // An animation in a background tab has already been missed by the time
      // the tab is looked at. The final state is the same outcome, sooner.
      if (!isDocumentVisible()) return;

      const cells = Array.from(node.children) as HTMLElement[];
      if (cells.length === 0) return;

      const settle = () => {
        cells.forEach((cell, index) => {
          cell.textContent = text[index];
          cell.classList.remove(UNRESOLVED_CLASS);
        });
      };

      const total = DURATION_STEPS * readDurationMs("--duration-slow", 280);
      const startedAt = performance.now();
      let timer = 0;

      const tick = () => {
        const progress = Math.min(1, (performance.now() - startedAt) / total);
        if (progress >= 1) {
          window.clearInterval(timer);
          settle();
          return;
        }

        const resolved = Math.round(progress * cells.length);
        cells.forEach((cell, index) => {
          if (index < resolved) {
            cell.textContent = text[index];
            cell.classList.remove(UNRESOLVED_CLASS);
            return;
          }
          // A space stays a space. Noise in a word gap reads as a typo, and it
          // would also let the line break in a different place mid-animation.
          if (text[index] === " ") return;
          cell.textContent = NOISE[Math.floor(Math.random() * NOISE.length)];
          cell.classList.add(UNRESOLVED_CLASS);
        });
      };

      // Run the first frame synchronously. Ref callbacks fire during commit,
      // before paint, so this is what stops the resolved text appearing for a
      // moment and then scrambling — which would look like a fault.
      tick();
      timer = window.setInterval(tick, STEP_MS);

      return () => {
        window.clearInterval(timer);
        settle();
      };
    },
    [text],
  );

  return (
    <span data-slot="decode" className={className} {...props}>
      <span aria-hidden="true" ref={attach}>
        {/* One span per character, so an unresolved glyph can be dimmed
            individually. The index is a stable key here: the string is fixed
            for the life of the component and nothing is inserted or reordered. */}
        {Array.from(text).map((character, index) => (
          <span key={index}>{character}</span>
        ))}
      </span>
      <VisuallyHidden>{text}</VisuallyHidden>
    </span>
  );
}

export { Decode };
