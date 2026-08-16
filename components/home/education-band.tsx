import { Badge } from "@/components/ui/badge";
import { Heading, Text } from "@/components/ui/typography";
import { credentials } from "@/content/education";
import { Band } from "./band";
import { DateRange } from "./date-range";

/**
 * Band 06 — two degrees.
 *
 * A plain gap grid rather than a third hairline treatment. Bands 02, 05 and 07
 * all use ruled rows and band 01 uses hairline gutters; a fourth ruled block
 * here would make the page read as one long table.
 *
 * The note underneath is the part that matters. Two Software Engineering
 * degrees are unremarkable on their own — earning both while working full-time,
 * with the Bachelor's overlapping the first role end to end, is the fact.
 */
function EducationBand() {
  return (
    <Band id="education" index="06" title="Education">
      <div className="grid gap-8 sm:grid-cols-2 sm:gap-10">
        {credentials.map((credential) => (
          <div key={credential.id} className="min-w-0">
            <DateRange
              range={credential.range}
              className="label-caps text-muted-foreground"
            />
            <Heading level={3} size="xs" className="mt-1.5">
              {credential.qualification}
            </Heading>
            <Text tone="muted" className="mt-1">
              {credential.institution} · {credential.location}
            </Text>
            {credential.distinction ? (
              <Badge variant="outline" className="mt-3">
                {credential.distinction}
              </Badge>
            ) : null}
          </div>
        ))}
      </div>
    </Band>
  );
}

export { EducationBand };
