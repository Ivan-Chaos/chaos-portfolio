import type { ContactMethod } from "./schema";

/**
 * Identity, positioning and the ways to make contact.
 *
 * Everything here traces to a CV or to something Ivan stated directly. No
 * availability is claimed, because no source states one — an invented "open to
 * offers" is the kind of thing that has to be walked back in the first email.
 */

export const profile = {
  name: "Ivan Chaus",

  /**
   * A description of the practice, not a claim about a current job title.
   *
   * The title at YachtWay is Front-end Engineer, and the Track record band says
   * so for every role. What this line describes is the work — directing
   * architecture and delivery across ten-plus applications — which is what the
   * Beleven lead role was, and what the YachtWay role is in substance.
   */
  positioning: "Frontend Lead / Architect",

  /** Where he is, and what the current position is. Both are facts, not offers. */
  location: "Pardubice, Czech Republic",
  currentRole: "Front-end Engineer",
  currentOrganisation: "YachtWay",
  currentOrganisationLocation: "Miami, USA — remote",

  /**
   * Two sentences under the positioning line.
   *
   * Deliberately full of proper nouns and one checkable figure. Every strong
   * portfolio hero surveyed for this page names something specific; the generic
   * register — "passionate developer crafting beautiful experiences" — names
   * nothing, which is exactly why it reads as filler.
   *
   * Set in chrome, not `Prose`. Forty words is not long-form, and reaching for
   * the proportional face here would be the first step in widening the one
   * recorded deviation.
   */
  standfirst:
    "Seven years building production web applications in React, Next.js and TypeScript — currently at YachtWay, where a performance overhaul cut page latency in half across the marketplace. Before that, five years directing frontend architecture and delivery for ten-plus client platforms.",
} as const;

export const email = "ivan13oct@gmail.com";

/**
 * The short LinkedIn URL rather than the `-229b81209` one printed on the CVs.
 * Ivan gave this form directly, which makes it the later of the two.
 */
export const linkedInUrl = "https://www.linkedin.com/in/ivan-chaus";
export const gitHubUrl = "https://github.com/Ivan-Chaos";

/**
 * Contact methods, in the order they are offered.
 *
 * Email first because it is the one that actually gets used. The phone number
 * on the CVs is deliberately not here — a phone number on a public page is a
 * spam magnet, and anyone who has read this far can ask for it.
 */
export const contactMethods: readonly ContactMethod[] = [
  {
    id: "email",
    label: "Email",
    display: email,
    href: `mailto:${email}`,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    display: "in/ivan-chaus",
    href: linkedInUrl,
  },
  {
    id: "github",
    label: "GitHub",
    display: "Ivan-Chaos",
    href: gitHubUrl,
  },
  {
    id: "location",
    label: "Location",
    display: "Pardubice, Czech Republic — CET",
  },
];
