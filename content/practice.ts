import type { Fact } from "./schema";

/**
 * What the work actually is.
 *
 * This is the one place on the page that earns the proportional face: four
 * running paragraphs is long-form by any reading, and `Prose` is the sanctioned
 * entry point. Everything else on the page stays in chrome.
 *
 * Paragraphs are strings rather than markup so the content layer holds no JSX —
 * the band maps them, and there is nothing to style per-paragraph.
 */
export const practiceParagraphs: readonly string[] = [
  "The work is architecture more than it is components. Deciding how a frontend is shaped — rendering strategy, state boundaries, where the design system stops and the product starts — and then making that decision survive contact with a team, a deadline, and a codebase somebody else wrote.",
  "Most of it has been greenfield: ten-plus client applications taken from an empty repository to production, across telehealth, crypto, real-time analytics and consumer subscriptions. The domains differ and the constraints rhyme. Something has to be fast, something has to be auditable, and someone has to be able to change it in eighteen months.",
  "The specialisms follow from that. Performance, because latency is the one requirement every stakeholder agrees on once they have seen the number. Security-sensitive delivery — HIPAA, BankID, dynamic 2FA, digital signatures — because those are the projects where a vague architecture becomes expensive. And design systems, because the alternative is rebuilding the same button in four repositories.",
];

/**
 * The facts beside the prose. Short enough to scan without reading the
 * paragraphs at all, which is what most first visits are.
 */
export const practiceFacts: readonly Fact[] = [
  {
    term: "Focus",
    definition: "Frontend architecture, performance, design systems",
  },
  {
    term: "Rendering",
    definition: "Next.js App Router and Pages Router, SSR, static",
  },
  {
    term: "Domains",
    definition: "Telehealth, Web3, analytics, marketplaces",
  },
  {
    term: "Based",
    definition: "Pardubice, Czech Republic — CET, remote",
  },
];
