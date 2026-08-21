import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Heading, Kicker } from "@/components/ui/typography";
import type { Engagement } from "@/content/schema";

/**
 * One client platform.
 *
 * **Not a link.** There are no case-study pages, and a card that reads as
 * clickable and is not is a worse outcome than a card that plainly is not.
 * When the pages exist, the whole card becomes the target — not a "read more"
 * bolted onto the corner.
 *
 * The hover latch is the one piece of interactive motion on the page:
 * `hover:bg-accent` plus the title taking the signal, both pure CSS, both
 * covered by the global reduced-motion guard. It reads as a relay closing,
 * which is the anchor's own description of what a state change should be.
 *
 * `group-hover/card` rather than a fresh `group`: `Card` already declares the
 * named group, and adding a second unnamed one would leave two groups on the
 * same element for no reason.
 *
 * Heading level 3, size xs. The band title above it is only `text-lg`, so
 * anything larger here inverts the visual hierarchy against the document one.
 */
function EngagementCard({ engagement }: { engagement: Engagement }) {
  return (
    // The latch, in three parts: the accent fill, the title taking the signal,
    // and the corner ticks extending to the signal edge. The tick *length*
    // animates — brackets reaching further in — while the tick *colour* jumps,
    // because a background-image colour is not interpolable: exactly the relay
    // click the anchor wants, for free.
    <Card className="transition-[background-color,background-size] duration-(--duration-base) ease-mech-out hover:bg-accent hover:[--tick-color:var(--signal-edge)] hover:[--tick-len:1.25rem]">
      <CardContent>
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <Heading
            level={3}
            size="xs"
            className="transition-colors group-hover/card:text-signal-text"
          >
            {engagement.name}
          </Heading>
        </div>

        <Kicker className="mt-1">{engagement.category}</Kicker>

        <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
          {engagement.highlights.map((highlight) => (
            <li key={highlight.slice(0, 32)} className="flex gap-2.5">
              <span
                aria-hidden="true"
                className="mt-2 size-1 shrink-0 bg-hairline-strong"
              />
              <span className="min-w-0">{highlight}</span>
            </li>
          ))}
        </ul>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {engagement.stack.map((item) => (
            <li key={item} className="min-w-0">
              <Badge variant="outline">{item}</Badge>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export { EngagementCard };
