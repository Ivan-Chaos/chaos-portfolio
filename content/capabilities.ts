import type { Capability } from "./schema";

/**
 * The stack, grouped by discipline, plus spoken languages.
 *
 * None of the strongest personal sites surveyed for this page carries a tech
 * grid — but those belong to people who are already known, and this one has to
 * survive a recruiter scanning for keywords. So it stays, as a compact readout
 * rather than a wall of chips, and never as a skill bar with a percentage on
 * it. A self-assessed "React 90%" is not a measurement.
 *
 * Order runs from what the work is made of to what it is made with.
 */
export const capabilities: readonly Capability[] = [
  {
    id: "languages",
    label: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "C++", "C#"],
  },
  {
    id: "frontend",
    label: "Frontend",
    items: ["React", "Next.js", "Angular"],
  },
  {
    id: "state",
    label: "State & data",
    items: ["Redux", "RTK", "Zustand", "TanStack Query", "SWR", "Axios"],
  },
  {
    id: "backend",
    label: "Backend & API",
    items: ["Node.js", "Express.js", "Django", "REST", "Firebase"],
  },
  {
    id: "styling",
    label: "Styling & UI",
    items: [
      "Tailwind CSS",
      "SASS",
      "MUI",
      "Chakra UI",
      "Styled Components",
      "Storybook",
    ],
  },
  {
    id: "tools",
    label: "Tools",
    items: [
      "Git",
      "Docker",
      "AWS",
      "Linux",
      "Jest",
      "Figma",
      "Web3.js",
      "WebRTC",
      "Keycloak",
      "OAuth2",
    ],
  },
  {
    id: "ai",
    label: "AI tooling",
    items: [
      "Claude Code",
      "Cursor",
      "GitHub Copilot",
      "MCP servers",
      "Spec-driven development",
    ],
  },
  {
    id: "spoken",
    label: "Spoken",
    items: ["English — C1", "Ukrainian — native"],
  },
];
