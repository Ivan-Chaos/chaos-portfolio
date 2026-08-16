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
