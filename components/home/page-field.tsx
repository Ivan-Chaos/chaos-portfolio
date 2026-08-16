import { Container } from "@/components/ui/layout";

/**
 * The ground the page is drawn on.
 *
 * Three layers, all hairline, all decorative, none of them touchable:
 *
 * - A **plotted grid**, fixed to the viewport so the page travels across it.
 * - **Column rules** flanking the content measure, aligned by reusing
 *   `Container` rather than by a matching magic number that would drift the
 *   first time the container width changed.
 * - **Register ticks** stepping down the rules, which is what makes them read
 *   as a measured edge rather than as two stray borders.
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
    </div>
  );
}

export { PageField };
