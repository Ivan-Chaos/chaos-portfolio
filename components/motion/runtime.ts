/**
 * Shared browser plumbing for the motion primitives.
 *
 * All three primitives need the same three things — the reduced-motion answer,
 * a duration read off the design tokens rather than typed in again, and a
 * one-shot viewport observer. Keeping them here means there is one definition
 * of each to get wrong.
 */

/**
 * True when the visitor has asked for reduced motion.
 *
 * The global guard in `app/globals.css` collapses CSS animation and transition
 * durations, which covers every component in the kit — but it does nothing to
 * JavaScript that rewrites `textContent`. Anything in this directory that
 * animates from script has to ask this question itself.
 *
 * Also false when there is no `window`, which is the server, and false when
 * `matchMedia` is missing, which is jsdom without a stub.
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  if (typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * True when the document is on screen.
 *
 * An animation that runs in a background tab has already been missed by the
 * time the tab is looked at, and the reader gets the final state with no
 * indication anything happened. Bailing straight to the final value is the same
 * outcome without the wasted frames.
 */
export function isDocumentVisible(): boolean {
  if (typeof document === "undefined") return true;
  return document.visibilityState === "visible";
}

/**
 * Reads a duration token — `--duration-slow` and friends — as milliseconds.
 *
 * The tokens are the single source for timing, and a number typed into a
 * component is a second source that drifts. `@theme inline` puts these on
 * `:root`, so they are readable from computed style.
 *
 * `fallbackMs` covers the case where the stylesheet has not applied yet, which
 * happens in jsdom and briefly in a real browser on first paint.
 */
export function readDurationMs(token: string, fallbackMs: number): number {
  if (typeof window === "undefined" || typeof getComputedStyle !== "function") {
    return fallbackMs;
  }

  const raw = getComputedStyle(document.documentElement)
    .getPropertyValue(token)
    .trim();
  if (!raw) return fallbackMs;

  // CSS time values are either `280ms` or `0.28s`. Anything else is a token
  // that is not a duration, and the fallback is the honest answer.
  const match = /^(-?[\d.]+)(ms|s)$/.exec(raw);
  if (!match) return fallbackMs;

  const value = Number.parseFloat(match[1]);
  if (!Number.isFinite(value) || value <= 0) return fallbackMs;

  return match[2] === "s" ? value * 1000 : value;
}

/**
 * Calls `onEnter` the first time `node` is on screen, then stops watching.
 *
 * Returns a cleanup function. Fires immediately and returns a no-op when
 * `IntersectionObserver` is unavailable, because the alternative is content
 * that never appears.
 *
 * The negative bottom margin means an element only counts as entered once it is
 * a tenth of the viewport clear of the fold, rather than the instant its top
 * edge crosses. Without it, a band animates while it is still a sliver.
 */
export function observeOnce(node: Element, onEnter: () => void): () => void {
  if (typeof IntersectionObserver !== "function") {
    onEnter();
    return () => {};
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      observer.disconnect();
      onEnter();
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
  );
  observer.observe(node);

  return () => observer.disconnect();
}

/**
 * True when `node` overlaps the viewport vertically right now.
 *
 * Used to short-circuit the observer for content that is already on screen at
 * mount. A ref callback runs during commit, before paint, so reading a rect
 * here costs nothing extra and lets above-the-fold content go straight to its
 * final state instead of waiting a frame for the observer to report what is
 * already true.
 */
export function isInViewport(node: Element): boolean {
  const rect = node.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}
