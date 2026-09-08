import type { Dispatch } from "./schema";

/**
 * The dispatches, newest first.
 *
 * Metadata only — every body is `content/dispatches/<slug>.mdx`, and
 * `__tests__/content.test.ts` asserts this list and that directory agree in
 * both directions. See docs/adr/0008-dispatch-metadata-in-typescript.md.
 *
 * **This module must never import an `.mdx` file.** Not even as a lazy
 * `body: () => import("./dispatches/x.mdx")`, however tidy that looks. The News
 * band reads this module, `app/page.tsx` renders the band, and
 * `app/page.test.tsx` renders the page — so an MDX import here would put the
 * MDX pipeline into Vitest's `unit` project, which has none. A test asserts the
 * absence, because the failure it prevents is a broken home-page test rather
 * than anything visible on the page.
 *
 * Ordered in the file rather than sorted at render, matching `roles` and
 * `credentials`. The order is asserted, so it cannot silently rot.
 *
 * Two threads run through this list. The three design-system pieces write out
 * decisions already recorded in `docs/adr/`. The six tagged **Planetar** track
 * the gravity simulator at github.com/Ivan-Chaos/planetar-fe, and their dates
 * are its six commit dates rather than anything invented — Jun 29, Jun 30,
 * Jul 2, Jul 5, Jul 22, Aug 16.
 *
 * Jun 29 carries both the project start and the engine because both landed that
 * day, as the repository's first two commits.
 */
export const dispatches: readonly Dispatch[] = [
  {
    slug: "the-industrial-anchor",
    title: "One direction, held",
    published: "2026-08-24",
    publishedLabel: "24 Aug 2026",
    standfirst:
      "This site commits to a single aesthetic direction and spends the whole token set on it. What that buys, and what it costs when a component arrives wanting something else.",
    topics: ["Design systems", "Tokens"],
    cover: {
      src: "/news/anchor-plot.svg",
      alt: "A hairline plot of the eleven-step ink ramp, with the amber signal marked once near the upper end.",
      width: 1200,
      height: 675,
    },
  },
  {
    slug: "planetar-density-and-mass",
    title: "Density, and why planets are the wrong size",
    published: "2026-08-16",
    publishedLabel: "16 Aug 2026",
    standfirst:
      "Mass and radius were independent numbers in Planetar, so the picture on screen could contradict the physics behind it. Tying them together with density, and rebuilding the presets around real mass ratios.",
    topics: ["Planetar", "Physics", "Simulation"],
    cover: {
      src: "/news/planetar/density-cover.svg",
      alt: "Placeholder: the planet editor with a density control, and a system whose body sizes follow from mass.",
      width: 1200,
      height: 675,
    },
  },
  {
    slug: "planetar-on-github-pages",
    title: "Planetar has an address",
    published: "2026-07-22",
    publishedLabel: "22 Jul 2026",
    standfirst:
      "Deploying a Next.js app to GitHub Pages as a static export, and the sub-path problem that quietly breaks every asset URL until you tell the build where it lives.",
    topics: ["Planetar", "Next.js", "Deployment"],
    cover: {
      src: "/news/planetar/deploy-cover.svg",
      alt: "Placeholder: the deployed simulation running at its public GitHub Pages URL.",
      width: 1200,
      height: 675,
    },
  },
  {
    slug: "one-deviation",
    title: "Monospace everywhere, and the one exception",
    published: "2026-07-13",
    publishedLabel: "13 Jul 2026",
    standfirst:
      "Every label, button and numeral on this site sets in JetBrains Mono. Long-form prose does not. Writing that exception down is what stopped it spreading.",
    topics: ["Typography", "Design systems"],
    cover: {
      src: "/news/two-faces.svg",
      alt: "Two hairline-ruled specimen bands, the upper set in a monospace grid and the lower in a proportional one.",
      width: 1200,
      height: 675,
    },
  },
  {
    slug: "planetar-engine-optimization",
    title: "Nineteen thousand pairs a frame",
    published: "2026-07-05",
    publishedLabel: "5 Jul 2026",
    standfirst:
      "An all-pairs gravity summation is quadratic by construction, and the speed controls had made that impossible to ignore. Halving the constant, removing a square root, and knowing where the real ceiling is.",
    topics: ["Planetar", "Performance", "Simulation"],
    cover: {
      src: "/news/planetar/optimisation-cover.svg",
      alt: "Placeholder: a frame profile showing the cost of the force summation before and after.",
      width: 1200,
      height: 675,
    },
  },
  {
    slug: "planetar-systems-import-export",
    title: "A system is just its initial conditions",
    published: "2026-07-02",
    publishedLabel: "2 Jul 2026",
    standfirst:
      "Saving and loading planetary systems, which turns out to be a very short file — plus the predefined systems that came almost free once import existed.",
    topics: ["Planetar", "Simulation", "Data"],
    cover: {
      src: "/news/planetar/systems-cover.svg",
      alt: "Placeholder: a system being exported, with its serialised body list beside the running simulation.",
      width: 1200,
      height: 675,
    },
  },
  {
    slug: "planetar-controls",
    title: "A simulation you cannot steer is a screensaver",
    published: "2026-06-30",
    publishedLabel: "30 Jun 2026",
    standfirst:
      "Zoom that keeps the point under the cursor, drag to pan, speed that does not break the integrator, and an arcade mode that teaches orbital mechanics faster than any diagram.",
    topics: ["Planetar", "Interaction", "Simulation"],
    cover: {
      src: "/news/planetar/controls-cover.svg",
      alt: "Placeholder: the simulation zoomed in, with a body under direct thrust control.",
      width: 1200,
      height: 675,
    },
  },
  {
    slug: "planetar-first-orbit",
    title: "Writing a gravity engine from scratch",
    published: "2026-06-29",
    publishedLabel: "29 Jun 2026",
    standfirst:
      "Starting Planetar, and why a general physics library was the wrong tool for it. Newton's law, the singularity you have to soften, and the two-line change that stops orbits spiralling apart.",
    topics: ["Planetar", "Physics", "Engine"],
    cover: {
      src: "/news/planetar/first-orbit-cover.svg",
      alt: "Placeholder: the first closed two-body orbit plotted by the engine.",
      width: 1200,
      height: 675,
    },
  },
  {
    slug: "why-cache-components-stays-off",
    title: "The flag I did not turn on",
    published: "2026-06-02",
    publishedLabel: "2 Jun 2026",
    standfirst:
      "Next 16 ships Cache Components behind a config flag. This site leaves it off, and the reasoning is more interesting than the feature.",
    topics: ["Next.js", "Rendering"],
  },
];

/**
 * How many the News band on the home page shows.
 *
 * Named rather than inlined so the band and the content test that guarantees
 * there are enough to fill it read the same number.
 */
export const LATEST_DISPATCH_COUNT = 3;

/**
 * The sentence under the `h1` on `/news`.
 *
 * Here rather than in the component for the reason spec 0002 gives: nothing on
 * a page is a string typed into a component.
 */
export const newsStandfirst =
  "Notes on architecture, rendering and design systems. Written when something was actually learned, which is why there are not many.";

/** The dispatch with this slug, or `undefined`. */
export function findDispatch(slug: string) {
  return dispatches.find((dispatch) => dispatch.slug === slug);
}
