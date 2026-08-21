import type { Reading } from "./schema";

/**
 * The four measured claims.
 *
 * Every one traces to a line in a CV. Nothing is rounded up and nothing is
 * invented — which is the whole reason the band is called Readout rather than
 * Highlights.
 *
 * Values are zero-padded to the width they animate through, so a count-up runs
 * at a fixed character count and the `StatGroup` cannot reflow mid-animation.
 * Padding is also just what an instrument does.
 */
export const readings: readonly Reading[] = [
  {
    id: "experience",
    label: "Years in production",
    // Bump this by hand in July. Deriving it from the clock would make the
    // page's output depend on when it was rendered, which is worse than a
    // yearly edit.
    value: "07",
    hint: "Shipping web applications professionally since July 2019.",
  },
  {
    id: "latency",
    label: "Page latency cut",
    value: "50",
    unit: "%",
    hint: "Marketplace-wide at YachtWay, via SSR and image-pipeline work.",
  },
  {
    id: "applications",
    label: "Built from scratch",
    value: "10+",
    hint: "Client applications architected and delivered at Beleven.",
  },
  {
    id: "customers",
    label: "Customers served",
    // The frontend CV says 50,000+ and the fullstack CV says 100,000+ for the
    // same platform. The conservative figure is the one on the page.
    value: "50K+",
    hint: "Active subscribers on the Candylink VPN subscription platform.",
  },
];
