import {
  IconBrandAngular,
  IconBrandDjango,
  IconBrandNextjs,
  IconBrandNodejs,
  IconBrandReact,
  IconBrandRedux,
  IconBrandStorybook,
  IconBrandTailwind,
  IconBrandTypescript,
  IconBroadcast,
  IconCurrencyEthereum,
  IconRobot,
  IconTool,
} from "@tabler/icons-react";
import { staggerChildren } from "@/components/motion/stagger";
import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { Heading, Text } from "@/components/ui/typography";
import { capabilities } from "@/content/capabilities";
import { instruments } from "@/content/instruments";
import { cn } from "@/lib/utils";
import { Band } from "./band";
import { ReadoutList, ReadoutRow } from "./readout";

/**
 * Each instrument's mark, by id. Tabler's brand set, because Lucide ships no
 * brand marks — the same reason the masthead's GitHub glyph is Tabler. Marks
 * render in the muted ink like every other icon: the anchor has one signal
 * colour and it is not React blue, so brand palettes stay outside.
 *
 * `IconTool` is the fallback so an instrument added to the content without a
 * mark here degrades to a generic glyph instead of a broken card.
 */
const MARKS: Record<string, React.ComponentType> = {
  typescript: IconBrandTypescript,
  react: IconBrandReact,
  nextjs: IconBrandNextjs,
  angular: IconBrandAngular,
  state: IconBrandRedux,
  tailwind: IconBrandTailwind,
  node: IconBrandNodejs,
  django: IconBrandDjango,
  web3: IconCurrencyEthereum,
  webrtc: IconBroadcast,
  storybook: IconBrandStorybook,
  ai: IconRobot,
};

/**
 * Band 05 — the stack, as instruments rather than as a list.
 *
 * The core tools get a card each: the mark, the name, and a field note saying
 * where the tool actually earned its place — every note traces to a project
 * or a role, which is the admission rule. What a card never carries is a
 * proficiency: "React 90%" is not a measurement, "React carried these four
 * platforms" is a record.
 *
 * The **inventory** stays underneath as the compact grouped readout. It is
 * what lets the cards be selective — nothing is lost by not being featured —
 * and it is the part a recruiter scans for keywords.
 */
function CapabilitiesBand() {
  return (
    <Band
      id="capabilities"
      index="05"
      title="Capabilities"
      description="The core of the stack, and where each piece earned its place. The full inventory below."
    >
      <div
        className={cn(
          "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
          staggerChildren,
        )}
      >
        {instruments.map((instrument) => (
          <Card key={instrument.id} size="sm">
            <CardContent>
              <Icon
                as={MARKS[instrument.id] ?? IconTool}
                size="xl"
                className="text-muted-foreground"
              />
              <Heading level={3} size="xs" className="mt-3">
                {instrument.label}
              </Heading>
              <Text size="xs" tone="muted" className="mt-1.5">
                {instrument.note}
              </Text>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-10">
        <p className="label-caps text-muted-foreground">Full inventory</p>
        <ReadoutList className="mt-4">
          {capabilities.map((capability) => (
            <ReadoutRow key={capability.id} term={capability.label}>
              {capability.items.join(" · ")}
            </ReadoutRow>
          ))}
        </ReadoutList>
      </div>
    </Band>
  );
}

export { CapabilitiesBand };
