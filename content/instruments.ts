import type { Instrument } from "./schema";

/**
 * The core of the stack, one card each — the tool, and the work where it
 * earned its place.
 *
 * Every note traces to an engagement or a role, which is the admission rule:
 * a tool with no story stays in the inventory below the grid. That is also
 * why there is no proficiency anywhere on these — "React 90%" is not a
 * measurement, but "React carried these four platforms" is a record.
 *
 * Ids double as the lookup key for each card's mark in the Capabilities band.
 * Order runs core-out: languages and frameworks first, then the specialised
 * kit the hard projects demanded.
 */
export const instruments: readonly Instrument[] = [
  {
    id: "typescript",
    label: "TypeScript",
    note: "The default language since 2020 — every platform in Projects is typed, and so is this site.",
  },
  {
    id: "react",
    label: "React",
    note: "The core of the practice: the YachtWay marketplace, the ten-plus Beleven builds, three of the four Projects.",
  },
  {
    id: "nextjs",
    label: "Next.js",
    note: "App Router and Pages Router in production — the SSR work behind a marketplace-wide 50% latency cut.",
  },
  {
    id: "angular",
    label: "Angular",
    note: "Candylink VPN's frontend, refactored out of a monolith into clean contracts against Django services.",
  },
  {
    id: "state",
    label: "State & data",
    note: "Redux, RTK, Zustand, TanStack Query — React Query tuned to carry Influencers' real-time dashboards.",
  },
  {
    id: "tailwind",
    label: "Tailwind CSS",
    note: "Standardised responsive UI across client projects; this site runs v4, CSS-first, tokens and all.",
  },
  {
    id: "node",
    label: "Node.js & Express",
    note: "The backend half of two full-stack years — Express services and Firebase real-time data.",
  },
  {
    id: "django",
    label: "Django",
    note: "Candylink's service layer, and the Python side of the Beleven full-stack work.",
  },
  {
    id: "web3",
    label: "Web3 / EVM",
    note: "PEAKDEFI's smart-contract layers, fail-safe wallet connector states and transaction UI across EVM networks.",
  },
  {
    id: "webrtc",
    label: "WebRTC",
    note: "Lamina Clinic's encrypted real-time video consultations, delivered under HIPAA.",
  },
  {
    id: "storybook",
    label: "Storybook",
    note: "Where the design systems live — including this site's, tested in both themes on every check.",
  },
  {
    id: "ai",
    label: "AI tooling",
    note: "Claude Code, Cursor, MCP servers — AI-assisted workflows and consistency checks introduced for a distributed team.",
  },
];
