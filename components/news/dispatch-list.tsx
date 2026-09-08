import { Badge } from "@/components/ui/badge";
import { Link } from "@/components/ui/link";
import { Heading, Text } from "@/components/ui/typography";
import type { Dispatch } from "@/content/schema";
import { cn } from "@/lib/utils";
import { DateStamp } from "./date-stamp";
import { DispatchCover } from "./dispatch-cover";

/**
 * A reverse-chronological list of dispatches.
 *
 * A real `<ol>`, because the order carries meaning — this is a list where
 * position *is* information, and a screen reader should be able to say "item 2
 * of 3".
 *
 * **Ruled rows rather than a card grid**, and the reasoning is worth keeping.
 * A grid is for a set of peers where position says nothing, which is exactly
 * what the Projects band is — four platforms that ran concurrently. Reverse
 * chronology is the opposite: a two-up grid reads a dated list
 * left-right-left-right, which is out of order, and orphans the odd item. Cards
 * also cap gracefully at four, and an index grows without bound.
 *
 * `ReadoutList` was the other candidate and its own docstring rules it out: it
 * is a real `<dl>` "because every use of it is genuinely a term and its value",
 * and a published date is metadata *about* a dispatch rather than a key it is
 * filed under. `Timeline` was the third, and its rail-and-marker vocabulary is
 * spent on roles — reusing it here would imply the same kind of record, with
 * spans and a current entry, and there is no current dispatch to mark.
 *
 * What is borrowed from `readout.tsx` is the rule mechanics: the list carries
 * the closing rule, each row carries its own opening one, which is what keeps
 * them joined with no doubled 2px line between.
 */
function DispatchList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="dispatch-list"
      className={cn("border-b border-hairline", className)}
      {...props}
    />
  );
}

/**
 * One dispatch, as a row.
 *
 * **The whole row is the link target.** `engagement-card.tsx` committed to this
 * before the pages existed — "the whole card becomes the target, not a 'read
 * more' bolted onto the corner" — and the stretched-link pattern is what
 * delivers it without the usual cost. The anchor wraps *only* the headline and
 * carries `after:absolute after:inset-0`; the row is `relative`. So there is
 * exactly one link per row, its accessible name is the headline alone, and the
 * date, standfirst, topics and cover are row content rather than link text.
 *
 * Wrapping everything in the anchor and overriding the name with
 * `aria-labelledby` was the alternative, and it is worse: the link's *content*
 * would still be the date and the standfirst, so anyone browsing by element
 * still enters it, and it makes nested interactive content impossible forever.
 *
 * **Three tracks from `sm`, and the cover track is always reserved.** A row
 * without a cover renders an empty third cell rather than reclaiming the space,
 * so every headline in the list starts and ends at the same x. That alignment
 * is the datasheet virtue the whole ruled-row treatment exists for; letting
 * rows reflow around a missing image would make a mixed list read as broken
 * rather than as optional. Below `sm` the cover is dropped entirely — a 16:9
 * image stacked into a phone-width row triples the row height for decoration,
 * and this system already scopes decoration to viewports with room for it.
 *
 * The row carries the **latch** without the corner ticks a ruled row does not
 * have. The amber is a hover state, not a fifth spend of the signal: the budget
 * counts amber at rest, and `Link`'s own treatments do exactly this.
 */
function DispatchRow({
  dispatch,
  headingLevel = 3,
  topics = false,
  className,
  ...props
}: Omit<React.ComponentProps<"li">, "children"> & {
  dispatch: Dispatch;
  /** `2` on `/news`, under the page `h1`; `3` in the home band, under its `h2`. */
  headingLevel?: 2 | 3;
  /** Topics show on the index. The home band is a teaser and does without them. */
  topics?: boolean;
}) {
  // Size follows level rather than taking a third prop: a headline directly
  // under a page `h1` sets larger than one inside a band, and that is a rule
  // rather than a preference.
  const size = headingLevel === 2 ? "sm" : "xs";

  return (
    <li
      data-slot="dispatch-row"
      className={cn(
        "group/dispatch relative grid gap-1.5 border-t border-hairline py-5",
        "sm:grid-cols-[10rem_minmax(0,1fr)_9rem] sm:gap-4",
        "transition-colors duration-(--duration-base) ease-mech-out hover:bg-accent",
        // The hit area is the whole row, so the row is what shows focus. This
        // is the global `:focus-visible` outline *relocated*, not a ring
        // reintroduced — same width, same offset, same `--ring`. AGENTS.md's
        // rule against `outline-none` plus a ring is about vendored components
        // adding their own focus treatment; an outline around the headline text
        // alone would under-report a target the size of the row.
        "has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-2 has-[a:focus-visible]:outline-(--ring)",
        className,
      )}
      {...props}
    >
      <DateStamp
        dispatch={dispatch}
        className="label-caps text-muted-foreground sm:pt-1"
      />

      {/* `min-w-0` is not optional in a mono layout: without it a long unbroken
          title sets the track's minimum width and pushes the page into
          horizontal scroll. */}
      <div className="min-w-0">
        <Heading
          level={headingLevel}
          size={size}
          className="transition-colors group-hover/dispatch:text-signal-text"
        >
          <Link
            href={`/news/${dispatch.slug}`}
            variant="unstyled"
            // The stretched link. Two things are load-bearing here.
            //
            // `after:z-10`, because the cover cell is an `AspectRatio`, which is
            // `position: relative` and comes after this one in DOM order. Two
            // positioned boxes at `z-index: auto` paint in tree order, so
            // without this the thumbnail paints over the overlay and clicking
            // the image does nothing — the one part of the row that would
            // silently stop being a target.
            //
            // `focus-visible:outline-none` because the row draws the outline
            // instead; see the comment on the row.
            className="after:absolute after:inset-0 after:z-10 focus-visible:outline-none"
          >
            {dispatch.title}
          </Link>
        </Heading>

        <Text size="sm" tone="muted" className="mt-1.5">
          {dispatch.standfirst}
        </Text>

        {topics ? (
          // Labels, never links. There are no topic archives, and a badge that
          // reads as clickable and is not is the defect `engagement-card.tsx`
          // was built to avoid. They sit under the stretched overlay, which is
          // correct — they are not interactive.
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {dispatch.topics.map((topic) => (
              <li key={topic} className="min-w-0">
                <Badge variant="outline">{topic}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* The reserved track. Empty when there is no cover, so the rows above
          and below still line up. */}
      <div className="hidden sm:block">
        {dispatch.cover ? (
          <DispatchCover cover={dispatch.cover} sizes="144px" />
        ) : null}
      </div>
    </li>
  );
}

export { DispatchList, DispatchRow };
