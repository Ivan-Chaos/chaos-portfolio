import { CapabilitiesBand } from "@/components/home/capabilities-band";
import { ContactBand } from "@/components/home/contact-band";
import { EducationBand } from "@/components/home/education-band";
import { EngagementsBand } from "@/components/home/engagements-band";
import { MastheadBand } from "@/components/home/masthead-band";
import { PracticeBand } from "@/components/home/practice-band";
import { ReadoutBand } from "@/components/home/readout-band";
import { SiteFooter } from "@/components/home/site-footer";
import { SiteHeader } from "@/components/home/site-header";
import { TrackRecordBand } from "@/components/home/track-record-band";
import { Reveal } from "@/components/motion/reveal";
import { Container } from "@/components/ui/layout";

/**
 * The home page. Composition only — there is no markup here that a band does
 * not own, and no content at all: every fact lives in `content/`.
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
    <>
      <SiteHeader />

      {/* `tabIndex={-1}` is what makes the skip link actually move focus rather
          than only the scroll position. See components/ui/skip-link.tsx. */}
      {/* `relative` so it paints above the fixed page field: both are
          positioned, so document order decides, and the field is first. */}
      <main id="main" tabIndex={-1} className="relative flex-1">
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
            <ContactBand />
          </Reveal>
        </Container>
      </main>

      <SiteFooter />
    </>
  );
}
