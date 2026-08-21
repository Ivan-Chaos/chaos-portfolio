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

  /**
   * Pardubice's coordinates, as the locator captions them. Derived from the
   * stated city — a public, checkable fact like everything else here — and
   * stored as display strings so no formatting logic can drift them.
   */
  coordinates: "50.04°N 15.78°E",
  currentRole: "Front-end Engineer",
  currentOrganisation: "YachtWay",
  currentOrganisationLocation: "Miami, USA — remote",

  /**
   * Two sentences under the positioning line, and they tell the developer's
   * story, not the employment one — no employer names here, because the
   * kicker above already says where he currently is and the Experience band
   * says the rest. See docs/specs/0006-portfolio-voice.md.
   *
   * Still deliberately full of checkable specifics. The generic register —
   * "passionate developer crafting beautiful experiences" — names nothing,
   * which is exactly why it reads as filler.
   *
   * Set in chrome, not `Prose`. Fifty words is not long-form, and reaching for
   * the proportional face here would be the first step in widening the one
   * recorded deviation.
   */
  standfirst:
    "Seven years shipping production web applications in React, Next.js and TypeScript — the architecture, the rendering strategy and the design system, held to numbers like a marketplace-wide 50% latency cut. Ten-plus platforms taken from an empty repository to production, across telehealth, Web3, analytics and subscriptions.",
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
