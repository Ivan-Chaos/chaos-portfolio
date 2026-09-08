import { IconArrowRight } from "@tabler/icons-react";
import { DispatchList, DispatchRow } from "@/components/news/dispatch-list";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/link";
import { dispatches, LATEST_DISPATCH_COUNT } from "@/content/dispatches";
import { Band } from "./band";

/**
 * Band 07 — the latest dispatches, and the way to the rest.
 *
 * Placed here rather than higher, and Contact renumbered to 08 rather than
 * moved. Contact has to stay last: `contact-band.tsx` turns on being terminal,
 * and moving it off the end breaks the page's rhetoric rather than just its
 * numbering. The tempting slot was 03, straight after Practice — the writing as
 * evidence of how the work is thought about — and that is exactly why it is
 * wrong. Specs 0002 and 0006 both establish that the platforms are the
 * substance and everything else is their context; three dispatches are not the
 * substance, and claiming otherwise in the page's own structure would overstate
 * them.
 *
 * 07 is where the page turns from record to present tense. Education is the
 * last backward-looking band, this is the first forward-looking one, and
 * Contact is the invitation — what was built, what was learned, what is being
 * thought about now, how to get in touch. It also puts the only band that will
 * ever change next to the only band that asks for a reply, which is the pair a
 * returning reader came for.
 *
 * `LATEST_DISPATCH_COUNT` is a slice of a stored, test-enforced order — nothing
 * here reads the clock, matching the `roles` convention.
 *
 * Rows without topics: the band is a teaser, and topic badges between Education
 * and Contact are noise. And "All news" is a quiet text link rather than a
 * button — a third button on this page would compete with the masthead's one
 * signal button and Contact's one outline button, and by the time a reader is
 * at band 07 they do not need persuading to click a list they are looking at.
 */
function NewsBand() {
  return (
    <Band
      id="news"
      index="07"
      title="News"
      description="Notes on architecture, rendering and design systems — written when something was actually learned."
    >
      <DispatchList>
        {dispatches.slice(0, LATEST_DISPATCH_COUNT).map((dispatch) => (
          <DispatchRow key={dispatch.slug} dispatch={dispatch} />
        ))}
      </DispatchList>

      <Link
        href="/news"
        variant="quiet"
        className="mt-6 text-xs text-muted-foreground"
      >
        All news
        <Icon as={IconArrowRight} size="sm" />
      </Link>
    </Band>
  );
}

export { NewsBand };
