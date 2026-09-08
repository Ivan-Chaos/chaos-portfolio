import type { Metadata } from "next";
import { siteOpenGraph } from "@/lib/metadata";
import { CapabilitiesBand } from "@/components/home/capabilities-band";
import { ContactBand } from "@/components/home/contact-band";
import { EducationBand } from "@/components/home/education-band";
import { EngagementsBand } from "@/components/home/engagements-band";
import { MastheadBand } from "@/components/home/masthead-band";
import { NewsBand } from "@/components/home/news-band";
import { PracticeBand } from "@/components/home/practice-band";
import { ReadoutBand } from "@/components/home/readout-band";
import { TrackRecordBand } from "@/components/home/track-record-band";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/layout";

export const metadata: Metadata = {
  /* The root layout deliberately claims no canonical for the whole tree — see
     the comment there — so this page claims its own. `openGraph.type` is here
     for the same reason: only the home page is a profile. Declaring only these
     two keys leaves the layout's other `openGraph` fields intact, because they
     merge per top-level key. */
  alternates: { canonical: "/" },
  openGraph: { ...siteOpenGraph, type: "profile", url: "/" },
};

/**
 * The home page. Composition only — there is no markup here that a band does
 * not own, and no content at all: every fact lives in `content/`.
 *
 * The header, `<main>` and the footer used to be here too. They moved to
 * `app/layout.tsx` behind `SiteShell` when the site gained a second route, so
 * that every route carries them and the skip link has a target everywhere —
 * see docs/adr/0007. The `Reveal`s did not move with them: they are this
 * page's, for the reason below.
 *
 * Three decisions are visible in this file and nowhere else.
 *
 * **One `Container`, wrapping everything.** A single consistent gutter is most
 * of what "responsive" means on a page like this, and mixing widths between
 * bands is the fastest way to lose it.
 *
 * **`Reveal` is composed here, never inside a band.** It keeps every band a
 * plain server component, and it means band stories render with no animation at
 * all — so the accessibility pass never measures an element mid-fade and
 * reports a contrast figure that is true of nothing.
 *
 * **The masthead is not wrapped.** Its `h1` is the LCP element, and an element
 * at `opacity: 0` is excluded from LCP candidacy and does not recover by fading
 * in. Reveals begin at band 01.
 *
 * Synchronous, not `async` — which is what keeps the whole page renderable by
 * Testing Library. See `app/page.test.tsx`.
 */
export default function Home() {
  return (
    <Container>
      <MastheadBand />

      <Reveal>
        <ReadoutBand />
      </Reveal>
      <Reveal>
        <PracticeBand />
      </Reveal>
      <Reveal>
        <EngagementsBand />
      </Reveal>
      <Reveal>
        <TrackRecordBand />
      </Reveal>
      <Reveal>
        <CapabilitiesBand />
      </Reveal>
      <Reveal>
        <EducationBand />
      </Reveal>
      <Reveal>
        <NewsBand />
      </Reveal>
      <Reveal>
        <ContactBand />
      </Reveal>
    </Container>
  );
}
