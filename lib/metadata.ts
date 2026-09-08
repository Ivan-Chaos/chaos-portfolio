import type { Metadata } from "next";
import { profile } from "@/content/profile";

/**
 * The `openGraph` fields that are true of every route.
 *
 * This exists because of one Next.js behaviour that is easy to get wrong: a
 * segment's `openGraph` **replaces** its parent's rather than merging into it,
 * field by field. So a page that declares `openGraph: { type, url }` does not
 * inherit `siteName` and `locale` from the root layout — it drops them, and the
 * only symptom is two missing tags in a scraper's view of the page.
 *
 * Every route that declares its own `openGraph` spreads this first. The root
 * layout keeps a full block of its own as the default for any route that
 * declares none, so nothing here is dead code.
 */
export const siteOpenGraph = {
  siteName: profile.name,
  locale: "en_GB",
} satisfies Metadata["openGraph"];
