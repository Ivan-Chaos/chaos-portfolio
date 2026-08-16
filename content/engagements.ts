import type { Engagement } from "./schema";

/**
 * Four client platforms, all delivered inside the Beleven roles.
 *
 * They ran concurrently, which is why the end dates cluster on Dec 2024 — that
 * is a departure date, not four projects finishing at once. Ordered by how much
 * they say about the work rather than by date: the two that carry the hardest
 * constraints come first.
 *
 * These are content, not navigation. There are no case-study pages yet, and a
 * card that looks clickable and is not is worse than a card that plainly is
 * not.
 */
export const engagements: readonly Engagement[] = [
  {
    id: "lamina-clinic",
    name: "Lamina Clinic",
    category: "Telehealth platform",
    range: {
      start: "2022-11",
      end: "2024-12",
      startLabel: "Nov 2022",
      endLabel: "Dec 2024",
    },
    highlights: [
      "Built a HIPAA-compliant platform handling encrypted real-time WebRTC video consultations.",
      "Integrated BankID identity verification, dynamic 2FA and digital signature workflows.",
    ],
    stack: ["React", "TypeScript", "WebRTC", "BankID", "HIPAA"],
  },
  {
    id: "peakdefi",
    name: "PEAKDEFI",
    category: "Crypto launchpad",
    range: {
      start: "2020-06",
      end: "2024-12",
      startLabel: "Jun 2020",
      endLabel: "Dec 2024",
    },
    highlights: [
      "Developed launchpad and promotion platforms processing multi-million dollar smart contract volume across EVM networks.",
      "Built fail-safe wallet connector states and transaction status UI that reduced drop-off mid-transaction.",
    ],
    stack: ["TypeScript", "React", "Web3.js", "EVM"],
  },
  {
    id: "influencers",
    name: "Influencers",
    category: "Real-time analytics",
    range: {
      start: "2022-08",
      end: "2024-12",
      startLabel: "Aug 2022",
      endLabel: "Dec 2024",
    },
    highlights: [
      "Built a real-time analytics portal for talent managers with high-throughput tracking dashboards.",
      "Implemented OAuth2/OIDC identity management with Keycloak, and optimised data fetching with React Query.",
    ],
    stack: ["TypeScript", "React", "React Query", "Chakra UI", "Keycloak"],
  },
  {
    id: "candylink-vpn",
    name: "Candylink VPN",
    category: "Subscription platform",
    range: {
      start: "2024-07",
      end: "2024-12",
      startLabel: "Jul 2024",
      endLabel: "Dec 2024",
    },
    highlights: [
      "Refactored a monolithic legacy system into clean API contracts between Angular and Django services.",
      "Implemented a custom multi-tier subscription system serving over 50,000 active customers worldwide.",
    ],
    stack: ["Angular", "TypeScript", "Django", "REST"],
  },
];
