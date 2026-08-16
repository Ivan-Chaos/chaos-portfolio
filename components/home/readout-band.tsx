import { CountUp } from "@/components/motion/count-up";
import { staggerChildren } from "@/components/motion/stagger";
import { Stat, StatGroup } from "@/components/ui/stat";
import { readings } from "@/content/readings";
import { cn } from "@/lib/utils";
import { Band } from "./band";

/**
 * Band 01 — the four measured claims.
 *
 * `StatGroup` supplies the hairline gutters and the responsive shape; what is
 * overridden here is how loud the figures are and how many fit across. Inside
 * the rail the content column is ~48rem, so two-up gives each figure enough
 * room to be set at a display size — which is the whole point of a readout.
 * Four-up would fit the labels and shrink the numbers, which is backwards.
 *
 * Every reading carries a hint saying where its figure came from. A number with
 * no provenance is a claim, and this band is called Readout on purpose.
 */
function ReadoutBand() {
  return (
    <Band
      id="readout"
      index="01"
      title="Readout"
      description="Four figures, each traceable to a line in a CV."
    >
      <StatGroup
        className={cn(
          "lg:grid-cols-2",
          "[&>*]:p-5 [&>*]:sm:p-6",
          "[&_[data-slot=stat-value]]:text-4xl [&_[data-slot=stat-value]]:sm:text-5xl",
          staggerChildren,
        )}
      >
        {readings.map((reading) => (
          <Stat
            key={reading.id}
            label={reading.label}
            value={<CountUp value={reading.value} />}
            unit={reading.unit}
            hint={reading.hint}
          />
        ))}
      </StatGroup>
    </Band>
  );
}

export { ReadoutBand };
