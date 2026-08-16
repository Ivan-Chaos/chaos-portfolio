import { capabilities } from "@/content/capabilities";
import { Band } from "./band";
import { ReadoutList, ReadoutRow } from "./readout";

/**
 * Band 05 — the stack, grouped, plus spoken languages.
 *
 * A text readout rather than a wall of chips. Badges are spent on engagement
 * stacks, where there are four or five per card and the reader is comparing
 * them; sixty of them in one band is a texture, not information.
 *
 * The separator is a middot rather than a comma so the row scans as a set of
 * discrete values instead of a sentence — which is the difference between an
 * instrument panel and a paragraph.
 */
function CapabilitiesBand() {
  return (
    <Band id="capabilities" index="05" title="Capabilities">
      <ReadoutList>
        {capabilities.map((capability) => (
          <ReadoutRow key={capability.id} term={capability.label}>
            {capability.items.join(" · ")}
          </ReadoutRow>
        ))}
      </ReadoutList>
    </Band>
  );
}

export { CapabilitiesBand };
