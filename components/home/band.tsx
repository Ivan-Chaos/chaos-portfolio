import { Section } from "@/components/ui/layout";
import { cn } from "@/lib/utils";

/**
 * One numbered band of the home page.
 *
 * A thin wrapper over `Section` that holds the four decisions every band has to
 * make the same way. Getting any of them wrong is invisible until someone
 * notices the page feels like a document rather than a panel.
 *
 * - **Rail layout.** The index figure and title move into a 12rem left column
 *   from `lg`. It is what makes the figures line up down the page edge, and it
 *   gives the content the width a stacked header would have eaten.
 * - **Vertical rhythm.** `Section`'s own `py-10` is fixed rather than
 *   responsive, which is right for a component with no idea how much room it
 *   has and wrong for a page band. twMerge replaces it.
 * - **`scroll-mt`.** The header is sticky and 56px tall, and `<html>` carries
 *   `data-scroll-behavior="smooth"`. Without the offset, every anchor in the
 *   header scrolls its band's heading to precisely underneath the header.
 * - **The rule draws itself in.** `Section`'s top border is turned off and
 *   replaced with an element that can be transformed, because a `border-top`
 *   cannot.
 *
 * Both animated parts are expressed against `data-reveal-armed`, never against
 * `data-revealed` — armed is written by script and so cannot exist in server
 * output, which means both fail *visible*. A rule keyed the other way round
 * would be a permanently invisible rule for anyone without JavaScript.
 */
function Band({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Section>) {
  return (
    <Section
      layout="rail"
      className={cn(
        "relative scroll-mt-16 border-t-transparent py-14 sm:py-20 lg:py-24",
        // The index figure clicks into place rather than sliding — `ease-snap`
        // is `steps(3, end)`, and a numeral advancing through three discrete
        // positions is the anchor's characteristic movement. This is the one
        // place on the page it is spent.
        "[&_[data-slot=section-figure]]:transition [&_[data-slot=section-figure]]:duration-(--duration-slow) [&_[data-slot=section-figure]]:ease-snap",
        "group-data-[reveal-armed]/reveal:[&_[data-slot=section-figure]]:translate-y-1 group-data-[reveal-armed]/reveal:[&_[data-slot=section-figure]]:opacity-0",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute inset-x-0 top-0 h-px origin-left bg-hairline",
          "transition-transform duration-(--duration-slow) ease-mech-out",
          "group-data-[reveal-armed]/reveal:scale-x-0",
        )}
      />
      {children}
    </Section>
  );
}

export { Band };
