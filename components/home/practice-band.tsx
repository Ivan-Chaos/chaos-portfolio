import { Prose } from "@/components/ui/typography";
import { practiceFacts, practiceParagraphs } from "@/content/practice";
import { Band } from "./band";

/**
 * Band 02 — what the work actually is.
 *
 * The one place on the page that earns the proportional face. Three running
 * paragraphs is long-form by any reading, `Prose` is the sanctioned entry
 * point, and it caps its own measure — which matters more here than anywhere
 * else, because this is the only band a visitor might read rather than scan.
 *
 * The prose takes the whole content column rather than sharing it with a
 * sidebar. Inside the rail there is roughly 48rem to work with, and splitting
 * that again left the measure at about 40 characters — a newspaper column, and
 * the exact readability problem `prose-face` exists to solve.
 *
 * So the facts sit underneath instead, as a four-across strip. They are for the
 * visitor who will not read the paragraphs, which is most of them: the same
 * claim in twenty words, scannable in one pass, and they close the band on a
 * ruled edge rather than on a ragged last line.
 */
function PracticeBand() {
  return (
    <Band id="practice" index="02" title="Practice">
      <Prose>
        {practiceParagraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </Prose>

      {/* Column gaps rather than ruled cells, so the first term's left edge
          lines up with the prose above it. A hairline-gutter grid would inset
          it by its own padding and break the one alignment that matters. */}
      <dl className="mt-10 grid gap-x-8 gap-y-6 border-y border-hairline py-5 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
        {practiceFacts.map((fact) => (
          <div key={fact.term} className="min-w-0">
            <dt className="label-caps text-muted-foreground">{fact.term}</dt>
            <dd className="mt-1.5 text-xs">{fact.definition}</dd>
          </div>
        ))}
      </dl>
    </Band>
  );
}

export { PracticeBand };
