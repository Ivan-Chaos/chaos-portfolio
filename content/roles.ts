import type { Role } from "./schema";

/**
 * The three positions, newest first.
 *
 * Real titles, not the positioning line. "Frontend Lead / Architect" at the top
 * of the page describes the practice; this is what the contracts said, and the
 * two are allowed to differ as long as the page shows both.
 *
 * Exactly one role carries `current`, which is what drives the signal marker on
 * the timeline. A test enforces that.
 */
export const roles: readonly Role[] = [
  {
    id: "yachtway",
    title: "Front-end Engineer",
    organisation: "YachtWay",
    location: "Miami, USA — remote",
    range: {
      start: "2024-12",
      end: null,
      startLabel: "Dec 2024",
      endLabel: "Present",
    },
    current: true,
    highlights: [
      "Led a web performance overhaul that cut page latency by 50% and lifted Core Web Vitals to passing across the marketplace, via SSR optimisation and image pipeline tuning.",
      "Built modular, reusable component libraries that standardised the design system and cut duplicated UI work across teams.",
      "Set up frontend architecture for multiple sub-services, owning features end to end from technical design to production release.",
      "Introduced AI-assisted workflows and automated code-consistency checks used by the distributed team.",
    ],
  },
  {
    id: "beleven-lead",
    title: "Front-end Lead",
    organisation: "Beleven",
    location: "Lviv, Ukraine",
    range: {
      start: "2021-05",
      end: "2024-12",
      startLabel: "May 2021",
      endLabel: "Dec 2024",
    },
    highlights: [
      "Directed frontend architecture and delivery for 10+ client applications built from scratch with React, Next.js and TypeScript.",
      "Standardised responsive UI and component architecture across projects using Tailwind CSS, MUI, Chakra UI and SASS.",
      "Led refactoring of legacy React codebases to modern state management and rendering patterns.",
      "Delivered security-sensitive builds: HIPAA-compliant telehealth, WebRTC video calling, BankID and dynamic 2FA authentication, and digital signature workflows.",
    ],
  },
  {
    id: "beleven-fullstack",
    title: "Full Stack Engineer",
    organisation: "Beleven",
    location: "Lviv, Ukraine",
    range: {
      start: "2019-07",
      end: "2021-05",
      startLabel: "Jul 2019",
      endLabel: "May 2021",
    },
    highlights: [
      "Built full-stack features for client projects using React, Express.js, Django and Firebase real-time databases.",
      "Developed interfaces with centralised state management and custom design tokens for high-traffic applications.",
      "Integrated smart contract interaction layers using Web3 libraries and TypeScript.",
    ],
  },
];
