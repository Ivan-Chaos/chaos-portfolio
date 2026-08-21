/**
 * The numbered bands, in page order.
 *
 * This is the *index*, not the source of a band's own heading — each band
 * declares its own id, figure and title locally, where they are read. What this
 * list is for is everything that has to know the page's shape without rendering
 * it: the header nav and the masthead index. A test asserts the two agree, so
 * they cannot drift apart silently.
 */
export const BANDS = [
  { id: "readout", index: "01", title: "Readout" },
  { id: "practice", index: "02", title: "Practice" },
  // Public titles, not the domain words: the page says Projects and
  // Experience, the code keeps engagement and role. The ids are anchors and
  // never changed by a retitle. See docs/specs/0006-portfolio-voice.md.
  { id: "engagements", index: "03", title: "Projects" },
  { id: "track-record", index: "04", title: "Experience" },
  { id: "capabilities", index: "05", title: "Capabilities" },
  { id: "education", index: "06", title: "Education" },
  { id: "contact", index: "07", title: "Contact" },
] as const;

/** The three worth putting in a 56px header. Everything else is one scroll away. */
export const HEADER_ANCHORS = [
  "engagements",
  "track-record",
  "contact",
] as const;

/**
 * The one that survives below `sm`.
 *
 * All three fit at 390px, but only just — "Contact" lands within a few pixels
 * of the gutter and the brand has nothing between it and the nav. Below `sm`
 * the header is not sticky anyway, so the other two are only reachable by
 * scrolling back to a masthead that already lists all seven.
 */
export const COMPACT_HEADER_ANCHOR = "contact";
