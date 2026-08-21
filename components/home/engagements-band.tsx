import { staggerChildren } from "@/components/motion/stagger";
import { engagements } from "@/content/engagements";
import { cn } from "@/lib/utils";
import { Band } from "./band";
import { EngagementCard } from "./engagement-card";

/**
 * Band 03 — the four platforms, titled **Projects** on the page.
 *
 * Placed before Experience deliberately. The platforms are the substance and
 * the roles are the context for them; three of these four ran concurrently
 * inside one role, so leading with chronology would imply a sequence that did
 * not happen. The domain word stays *engagement* in code — the public title
 * is the portfolio voice, the glossary word is the record.
 *
 * Two-up and never three: four items in a three-column grid orphans one, and
 * there is no arrangement of four that a third column improves.
 */
function EngagementsBand() {
  return (
    <Band
      id="engagements"
      index="03"
      title="Projects"
      description="Four platforms taken from the first commit to production — what each one demanded, and what it was built with."
    >
      <div
        className={cn("grid gap-4 sm:grid-cols-2 sm:gap-5", staggerChildren)}
      >
        {engagements.map((engagement) => (
          <EngagementCard key={engagement.id} engagement={engagement} />
        ))}
      </div>
    </Band>
  );
}

export { EngagementsBand };
