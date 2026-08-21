import type { Credential } from "./schema";

/**
 * Two degrees, newest first.
 *
 * Both were earned while working full-time, and the Bachelor's overlaps the
 * first Beleven role entirely. That is the fact worth putting on the page — the
 * qualifications on their own are unremarkable, and the overlap is what they
 * actually demonstrate. It is stated once, below the pair, rather than repeated
 * on each.
 */
export const credentials: readonly Credential[] = [
  {
    id: "msc",
    qualification: "Master's Degree, Software Engineering",
    institution: "Lviv Polytechnic National University",
    location: "Lviv, Ukraine",
    range: {
      start: "2023-09",
      end: "2025-05",
      startLabel: "Sep 2023",
      endLabel: "May 2025",
    },
    distinction: "with Honors",
  },
  {
    id: "bsc",
    qualification: "Bachelor's Degree, Software Engineering",
    institution: "Lviv Polytechnic National University",
    location: "Lviv, Ukraine",
    range: {
      start: "2019-09",
      end: "2023-07",
      startLabel: "Sep 2019",
      endLabel: "Jul 2023",
    },
    distinction: "with Honors",
  },
];
