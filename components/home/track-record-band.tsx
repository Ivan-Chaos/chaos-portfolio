import {
  Timeline,
  TimelineBody,
  TimelineDate,
  TimelineItem,
  TimelineMarker,
  TimelineTitle,
} from "@/components/ui/timeline";
import { roles } from "@/content/roles";
import { Band } from "./band";
import { DateRange } from "./date-range";
import { OpsChart } from "./ops-chart";

/**
 * Band 04 — the three positions, newest first.
 *
 * Real titles, which is what makes the masthead's "Frontend Lead / Architect"
 * a description of the practice rather than a claim about a current job title.
 * Both are on the page; neither has to be walked back.
 *
 * Identical at every width on purpose. Moving the date into a gutter at `lg`
 * means fighting `TimelineItem`'s own `border-s ps-6` rail for a rearrangement
 * that gains nothing — the rail is the structure, and it only works if it runs
 * straight.
 */
function TrackRecordBand() {
  return (
    <Band id="track-record" index="04" title="Track record">
      {/* The plot first, the prose under it — an instrument shows the reading
          before the log. The chart is aria-hidden; the timeline below is the
          accessible telling of the same facts. */}
      <OpsChart />

      <Timeline className="mt-10">
        {roles.map((role) => (
          <TimelineItem key={role.id} current={role.current}>
            <TimelineMarker />
            <TimelineDate>
              <DateRange range={role.range} />
            </TimelineDate>
            <TimelineTitle>
              {role.title}
              <span className="text-muted-foreground"> · </span>
              {role.organisation}
            </TimelineTitle>
            <TimelineBody>
              <p className="text-xs">{role.location}</p>
              <ul className="mt-3 space-y-2">
                {role.highlights.map((highlight) => (
                  <li key={highlight.slice(0, 32)} className="flex gap-2.5">
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1 shrink-0 bg-hairline-strong"
                    />
                    <span className="min-w-0">{highlight}</span>
                  </li>
                ))}
              </ul>
            </TimelineBody>
          </TimelineItem>
        ))}
      </Timeline>
    </Band>
  );
}

export { TrackRecordBand };
