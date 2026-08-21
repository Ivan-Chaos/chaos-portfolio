import { engagements } from "@/content/engagements";
import { roles } from "@/content/roles";
import type { Range } from "@/content/schema";
import { cn } from "@/lib/utils";

/**
 * The track record, plotted — every role and engagement as a bar on one time
 * axis. This is the fact the text version cannot show: four engagements
 * running concurrently inside one role, visible as four bars under one.
 *
 * **Nothing reads the clock.** The axis runs from the earliest start to the
 * latest *stored* date, and an open range simply runs off the right edge into
 * a zone labelled with its stored `endLabel`. The chart is exactly as static
 * as the content, so it can never disagree between server and client and
 * never silently goes stale — it just ends where the content ends.
 *
 * **`aria-hidden`, but contrast-solved.** The timeline below tells the same
 * story in full, so a screen reader hears it once. The labels still set in
 * solved text tokens, because a decorative word at failing contrast is still
 * a failing word — the footer watermark lesson.
 *
 * The year gridlines render *inside each row's track cell* rather than as one
 * overlay. Rows stack with no gap, so the segments read as continuous lines —
 * broken at the group kickers, the way a drafting sheet breaks its rules at a
 * title block — and they can never drift off the bars they measure, because
 * they share the same box.
 */

/** `YYYY-MM` → months since year zero. Content is validated ISO, so no guards. */
function monthOf(iso: string): number {
  const [year, month] = iso.split("-").map(Number);
  return year * 12 + (month - 1);
}

const RANGES: readonly Range[] = [...roles, ...engagements].map(
  (item) => item.range,
);
const ORIGIN = Math.min(...RANGES.map((range) => monthOf(range.start)));
const CLOSED_END = Math.max(
  ...RANGES.map((range) => monthOf(range.end ?? range.start)),
);

/** The share of the axis past the last stored date — where open ranges run. */
const OPEN_ZONE = 0.14;

/** A stored date's position along the axis, 0..(1 - OPEN_ZONE). */
function position(iso: string): number {
  return ((monthOf(iso) - ORIGIN) / (CLOSED_END - ORIGIN)) * (1 - OPEN_ZONE);
}

/** Whole years inside the closed region, for the gridlines. */
const YEARS: number[] = [];
for (
  let year = Math.ceil((ORIGIN + 1) / 12);
  year * 12 <= CLOSED_END;
  year += 1
) {
  YEARS.push(year);
}

/** The stored label an open range ends on — "Present", never a computed now. */
const OPEN_LABEL = roles.find((role) => !role.range.end)?.range.endLabel;

const BAR_TONES = {
  current: "bg-signal-edge",
  role: "bg-control",
  engagement: "bg-hairline-strong",
} as const;

function YearLines() {
  return YEARS.map((year) => (
    <span
      key={year}
      className="absolute inset-y-0 w-px bg-hairline"
      style={{ left: `${position(`${year}-01`) * 100}%` }}
    />
  ));
}

function ChartRow({
  label,
  range,
  tone,
}: {
  label: string;
  range: Range;
  tone: keyof typeof BAR_TONES;
}) {
  const left = position(range.start) * 100;
  const right = range.end ? position(range.end) * 100 : 100;
  return (
    <>
      <span className="min-w-0 self-center text-2xs leading-[1.3] text-muted-foreground">
        {label}
      </span>
      <span className="relative h-6 min-w-0">
        <YearLines />
        <span
          className={cn(
            "absolute top-1/2 h-1.5 -translate-y-1/2",
            BAR_TONES[tone],
          )}
          style={{ left: `${left}%`, width: `${right - left}%` }}
        />
      </span>
    </>
  );
}

function OpsChart() {
  return (
    <div aria-hidden="true" className="bg-card corner-ticks p-4 sm:p-5">
      <div className="grid grid-cols-[minmax(0,8rem)_minmax(0,1fr)] gap-x-4">
        {/* The axis: year figures over their gridlines, the open label at the
            edge the open ranges run off. */}
        <span />
        <span className="relative h-6">
          {YEARS.map((year) => (
            <span
              key={year}
              className="absolute top-0 -translate-x-1/2 text-2xs text-muted-foreground tabular-nums"
              style={{ left: `${position(`${year}-01`) * 100}%` }}
            >
              {year}
            </span>
          ))}
          {OPEN_LABEL ? (
            <span className="absolute top-0 right-0 label-caps text-muted-foreground">
              {OPEN_LABEL}
            </span>
          ) : null}
        </span>

        <span className="col-span-2 pt-3 pb-1 label-caps text-muted-foreground">
          Roles
        </span>
        {roles.map((role) => (
          <ChartRow
            key={role.id}
            label={role.title}
            range={role.range}
            tone={role.current ? "current" : "role"}
          />
        ))}

        <span className="col-span-2 pt-3 pb-1 label-caps text-muted-foreground">
          Engagements
        </span>
        {engagements.map((engagement) => (
          <ChartRow
            key={engagement.id}
            label={engagement.name}
            range={engagement.range}
            tone="engagement"
          />
        ))}
      </div>
    </div>
  );
}

export { OpsChart };
