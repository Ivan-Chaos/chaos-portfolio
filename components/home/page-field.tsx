import { Container } from "@/components/ui/layout";

/* Centre of a side margin, as a CSS length. 64rem is `Container`'s `max-w-5xl`
   measure — the one magic number here, and it must track that class: the
   margin is (100vw - 64rem) / 2 wide, so its centre sits at half that. */
const MARGIN_CENTRE = "calc((100vw - 64rem) / 4)";

/**
 * The figures idling in the field's margins. Geometry in hairline ink, no
 * text, no data — instruments idling, not measuring. `xl:` because that is
 * the width at which the margins exist to idle in; below it every figure is
 * gone rather than squeezed over content.
 */
function FieldFigures() {
  return (
    <div className="hidden xl:block">
      {/* The dial — nested frames, the outer one indexing round in clicks. */}
      <div
        className="absolute top-[18%] size-20 -translate-x-1/2"
        style={{ left: MARGIN_CENTRE }}
      >
        <span className="absolute inset-0 field-dial border border-hairline-strong" />
        <span className="absolute inset-[22%] rotate-45 border border-hairline" />
        <span className="absolute top-1/2 left-1/2 size-1 -translate-x-1/2 -translate-y-1/2 bg-hairline-strong" />
      </div>

      {/* The beacon — a register cross on a slow square wave. */}
      <div
        className="absolute bottom-[24%] size-3 -translate-x-1/2 field-beacon"
        style={{ left: MARGIN_CENTRE }}
      >
        <span className="absolute top-1/2 h-px w-full bg-hairline-strong" />
        <span className="absolute left-1/2 h-full w-px bg-hairline-strong" />
      </div>

      {/* The stepper — a marker clicking down a tick scale and wrapping. */}
      <div
        className="absolute top-[30%] h-32 w-3 translate-x-1/2"
        style={{ right: MARGIN_CENTRE }}
      >
        <span className="absolute inset-y-0 left-1/2 w-px bg-hairline" />
        {Array.from({ length: 8 }, (_, index) => (
          <span
            key={index}
            className="absolute left-0 h-px w-full bg-hairline"
            style={{ top: `${index}rem` }}
          />
        ))}
        <span className="absolute top-0 h-2 w-full field-stepper bg-hairline-strong" />
      </div>

      {/* The hatch plate — the one figure that holds still. */}
      <div
        className="absolute bottom-[14%] size-14 translate-x-1/2 border border-hairline field-hatch"
        style={{ right: MARGIN_CENTRE }}
      />
    </div>
  );
}

/**
 * The ground the page is drawn on.
 *
 * Four layers, all hairline, all decorative, none of them touchable:
 *
 * - A **plotted grid**, fixed to the viewport so the page travels across it —
 *   major rule every fourth cell, minor rules between, plotter paper's own
 *   hierarchy.
 * - **Column rules** flanking the content measure, aligned by reusing
 *   `Container` rather than by a matching magic number that would drift the
 *   first time the container width changed.
 * - **Register ticks** stepping down the rules, which is what makes them read
 *   as a measured edge rather than as two stray borders.
 * - **Field figures** idling in the margins, where the field is wide enough
 *   to hold them.
 *
 * `aria-hidden` and `pointer-events-none` throughout: this is paper, not
 * content. It is also the first child of `<body>`, so everything after it
 * paints on top by document order — no z-index, and therefore no stacking
 * context to fight with Base UI's portalled overlays.
 */
function PageField() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden page-field"
    >
      <Container className="h-full px-0 sm:px-0">
        <div className="relative h-full border-x border-hairline">
          {/* Eight register marks down each rule — short ticks straddling the
              edge, the way a ruler marks a scale. A count rather than a repeat,
              so the spacing stays even at every viewport height instead of
              leaving a part-cell at the bottom.

              They have to stay *short*. An earlier version spanned the full
              column and read as stray lines drawn through the content rather
              than as an edge being measured. */}
          {Array.from({ length: 8 }, (_, index) => {
            const top = `${((index + 1) / 9) * 100}%`;
            return (
              <span key={index}>
                <span
                  className="absolute -left-1.5 h-px w-3 bg-hairline-strong"
                  style={{ top }}
                />
                <span
                  className="absolute -right-1.5 h-px w-3 bg-hairline-strong"
                  style={{ top }}
                />
              </span>
            );
          })}
        </div>
      </Container>

      <FieldFigures />
    </div>
  );
}

export { PageField };
