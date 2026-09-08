/**
 * Types for the portfolio content. No runtime code lives here — the modules
 * beside this one hold the data, the components render it, and nothing in
 * `components/` types its own copy of a shape.
 *
 * Vocabulary is CONTEXT.md's: a **role** is a paid position, an **engagement**
 * is a client platform delivered inside one, a **reading** is a measured claim,
 * a **capability** is a named skill in a discipline group, a **credential** is a
 * completed qualification. Those words are load-bearing — several engagements
 * ran concurrently inside a single role, so collapsing the first two would make
 * the track record read as though far more positions were held than were.
 */

/**
 * A span of time.
 *
 * `start` and `end` are ISO year-months so they can be compared and fed to
 * `<time dateTime>`; the labels are how the range actually reads and are
 * written out rather than formatted, because month abbreviations are the kind
 * of thing `Intl` renders differently per runtime.
 *
 * Nothing here is ever derived from the current date. "Present" is a stored
 * label, not a computed one — deriving it makes static output drift, and can
 * render differently on the server than on the client.
 */
export type Range = {
  /** ISO year-month, `YYYY-MM`. */
  start: string;
  /** ISO year-month, or `null` for a range that is still open. */
  end: string | null;
  /** How the start reads — `"May 2021"`. */
  startLabel: string;
  /** How the end reads — `"Dec 2024"`, or `"Present"`. */
  endLabel: string;
};

/**
 * A single measured claim, rendered as a `Stat`.
 *
 * `value` is a string, and deliberately so: it is exactly what appears on the
 * page, zero-padded to the width it animates through. A number here would
 * invite `toLocaleString`, which renders differently per runtime and would put
 * a thousands separator into a figure that is meant to read as an instrument.
 */
export type Reading = {
  id: string;
  /** The `<dt>`. Rendered uppercase by `label-caps`. */
  label: string;
  /** The figure, verbatim — `"07"`, `"50"`, `"10+"`, `"50K+"`. */
  value: string;
  /** Short qualifier beside the figure, if the label does not already carry it. */
  unit?: string;
  /** One sentence saying where the figure comes from. Every reading has one. */
  hint: string;
};

/** A paid position at one employer. */
export type Role = {
  id: string;
  title: string;
  organisation: string;
  location: string;
  range: Range;
  /** Bullet points, as written. Two to four. */
  highlights: string[];
  /** Whether this is the position currently held. Exactly one role is. */
  current?: boolean;
};

/** A client platform delivered inside a role. */
export type Engagement = {
  id: string;
  name: string;
  /** What the platform is, in two or three words — "Telehealth platform". */
  category: string;
  range: Range;
  /** Bullet points, as written. */
  highlights: string[];
  /** Named technologies, in the order they matter. */
  stack: string[];
};

/** A named group of skills. The group is the term, the items are the definition. */
export type Capability = {
  id: string;
  label: string;
  items: string[];
};

/**
 * A featured tool of the practice, rendered as a card in the Capabilities
 * band. The note is the card's whole point: one sentence saying where the
 * tool actually earned its place, traceable to an engagement or a role like
 * every other claim on the page. A tool without a real story does not get to
 * be an instrument — it stays in the inventory.
 */
export type Instrument = {
  id: string;
  label: string;
  /** One sentence: the real work where the tool was fielded. */
  note: string;
};

/** A completed qualification. */
export type Credential = {
  id: string;
  qualification: string;
  institution: string;
  location: string;
  range: Range;
  /** "with Honors", where one was awarded. */
  distinction?: string;
};

/** A term/definition pair in a hairline readout. */
export type Fact = {
  term: string;
  definition: string;
};

/** One of the ways to make contact, rendered in the Contact band. */
export type ContactMethod = {
  id: string;
  label: string;
  /** What the reader sees. */
  display: string;
  /** Where it goes. Omitted for a method that is not a link, such as location. */
  href?: string;
};

/**
 * An optional cover for a dispatch.
 *
 * Dimensions are stored because `next/image` needs them for a local file, and
 * an image without them is a layout-shift bug rather than a missing nicety.
 */
export type DispatchCover = {
  /** Root-relative path under `public/`. */
  src: string;
  /** Never empty — a cover with nothing to say would not be a cover. */
  alt: string;
  width: number;
  height: number;
};

/**
 * One written piece.
 *
 * The body is not here: it is `content/dispatches/<slug>.mdx`, and a test
 * asserts the two agree in both directions. See
 * docs/adr/0008-dispatch-metadata-in-typescript.md for why they are separate
 * files — the short version is that keeping metadata in TypeScript is what lets
 * the index page and the home band stay synchronous server components, and
 * therefore renderable by Testing Library.
 *
 * `published` is a full ISO date rather than the `YYYY-MM` a `Range` uses,
 * because a dispatch happens on a day. `publishedLabel` is written out rather
 * than formatted, for exactly the reason `Range` gives: `Intl` renders month
 * abbreviations differently per runtime, and nothing here is ever derived from
 * the clock.
 */
export type Dispatch = {
  /** The URL segment and the MDX filename. Same shape as an id. */
  slug: string;
  title: string;
  /** ISO `YYYY-MM-DD`. Sorts lexicographically; fed to `<time dateTime>`. */
  published: string;
  /** How the date reads — `"7 Sep 2026"`. */
  publishedLabel: string;
  /** One or two sentences. Chrome, never `Prose` — see CONTEXT.md's Standfirst. */
  standfirst: string;
  /** Named subjects, in the order they matter. Labels, never links. */
  topics: readonly string[];
  cover?: DispatchCover;
};
