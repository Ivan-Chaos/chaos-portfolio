import { DispatchList, DispatchRow } from "@/components/news/dispatch-list";
import { Heading, Text } from "@/components/ui/typography";
import { dispatches, newsStandfirst } from "@/content/dispatches";

/**
 * The whole of `/news`: a page head, then every dispatch as a row.
 *
 * Extracted from the route rather than inlined in it, for the reason
 * `home.stories.tsx` gives about the home page — a story is the only thing that
 * puts page markup under axe in both themes, and a story needs a component.
 *
 * **A page head, not a masthead and not a numbered band.** A band would make
 * the index figure a decoration: the figures are one sequence down one page's
 * edge, and two pages both starting at 01 destroys the figure's meaning as a
 * position. A masthead is singular — it carries the name and the positioning
 * line, and it is the site's front door. What this needs is the masthead's
 * grammar one register down.
 *
 * **No kicker.** The masthead's kicker carries a fact the title cannot, the
 * current position. There is no equivalent here, the number of dispatches is
 * not interesting at three, and a kicker restating the title in small caps is
 * decoration rather than the marker `Kicker` is for. The *article* page does
 * get one, because a date is a real fact.
 *
 * **The `h1` is `size="2xl"`, not the display steps.** `masthead-band.tsx` says
 * of those "the first and only use — dead weight anywhere else", and that
 * promise should survive this feature.
 *
 * **No `Reveal` and no stagger.** The `h1` is the LCP element and must not
 * fade, for the same documented reason the masthead is never wrapped; and
 * wrapping the list would fade the page in as one block, which is the AOS
 * register CONTEXT.md lists under `_Avoid_`. An index is scanned, not
 * descended. So this route ships with no motion script at all, and its test
 * gets the stronger guarantee — no `opacity-0` anywhere, rather than "every
 * one is behind `reveal-armed`".
 *
 * The first row's own `border-t` is the rule under the page head. No extra
 * divider — that is the mechanism `readout.tsx` already uses.
 */
function DispatchIndex() {
  return (
    <div className="py-14 sm:py-20 lg:py-24">
      <header className="mb-10 lg:mb-12">
        <Heading level={1}>News</Heading>
        <Text size="lg" tone="muted" className="mt-4 max-w-[56ch]">
          {newsStandfirst}
        </Text>
      </header>

      <DispatchList>
        {dispatches.map((dispatch) => (
          <DispatchRow
            key={dispatch.slug}
            dispatch={dispatch}
            headingLevel={2}
            topics
          />
        ))}
      </DispatchList>
    </div>
  );
}

export { DispatchIndex };
