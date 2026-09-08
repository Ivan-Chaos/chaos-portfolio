import type { Metadata } from "next";
import { DispatchIndex } from "@/components/news/dispatch-index";
import { Container } from "@/components/ui/layout";
import { newsStandfirst } from "@/content/dispatches";
import { siteOpenGraph } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "News",
  description: newsStandfirst,
  // Explicit, because the root layout no longer claims "/" for the whole tree.
  alternates: { canonical: "/news" },
  openGraph: {
    ...siteOpenGraph,
    type: "website",
    title: "News",
    description: newsStandfirst,
    url: "/news",
  },
};

/**
 * Takes no props, exactly like `app/page.tsx` — which is what keeps it
 * renderable by Testing Library. A page typed `PageProps<"/news">` would force
 * every test to fabricate two Promises for params and searchParams it never
 * reads.
 *
 * Synchronous, because everything it needs is in `content/dispatches.ts`. That
 * is the capability docs/adr/0008 exists to protect.
 *
 * `Container` at its default `max-w-5xl`, not `prose`. The index is a list, so
 * chrome rather than running text: the header and footer are at the default
 * width and a visibly narrower list column under them reads as a mistake,
 * `page-field.tsx` positions the field figures against `64rem`, and a row with
 * a fixed 10rem date track plus a 9rem cover track needs the room.
 */
export default function News() {
  return (
    <Container>
      <DispatchIndex />
    </Container>
  );
}
