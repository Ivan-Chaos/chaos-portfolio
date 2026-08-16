/**
 * Steps the children of a grid in, one after another, when the `Reveal` around
 * it fires. Put it on the grid — a row of figures, a grid of cards — never on
 * running text, where a stagger delays content the reader is trying to read.
 *
 * The animation itself lives in the `reveal-stagger` utility in
 * `app/globals.css`, driven by this project's motion tokens.
 *
 * **This is a separate module from `reveal.tsx`, and it has to be.** `Reveal`
 * is a `"use client"` module, and importing *any* value from one into a server
 * component yields a client reference object rather than the value — so a
 * string exported from there arrives as an object, `clsx` finds no truthy keys
 * on it, and the class silently never reaches the DOM. No error, no warning,
 * no animation. Constants shared with server components belong in a module with
 * no directive.
 *
 * Keyed off `data-revealed` rather than `data-reveal-armed`, and safely so:
 * without the attribute there is no animation at all, which is the visible
 * state. This can never hide anything.
 */
export const staggerChildren = "group-data-[revealed]/reveal:reveal-stagger";
