# shadcn/ui on Base UI primitives

UI components come from shadcn/ui, configured with `--base base` (Base UI) rather than Radix UI or
React Aria. shadcn's CLI now defaults to Base UI and its documentation serves component examples
under `/docs/components/base/`, so copy-paste from the official docs matches this project exactly.
Recorded because the choice is baked into every component that gets vendored in — each one imports
its primitives directly — so switching later means rewriting all of them, not flipping a config flag.

## Considered options

**Radix UI** was the historical shadcn foundation and still has by far the largest ecosystem: most
community blocks, templates and tutorials written in the last few years assume it, so third-party
snippets tend to paste in cleanly. Rejected because it is no longer the CLI default, which means the
_official_ docs — the source we will reach for most often — would increasingly not match.

**React Aria** has the strongest accessibility and interaction story. Rejected as the smallest
ecosystem and the most likely to diverge from copy-pasted community code; revisit if accessibility
becomes a headline requirement rather than a baseline one.

## Consequences

Third-party shadcn blocks written for Radix may need their primitive imports adapted. Check what a
snippet is built on before pasting it.

`shadcn` is a **runtime dependency**, not a dev dependency — `app/globals.css` does
`@import "shadcn/tailwind.css"` for shared keyframes and custom variants. This is a change from the
old pure copy-paste model. `pnpm dlx shadcn@latest eject` inlines that CSS and drops the dependency
if we ever want full ownership; it is one-way.

Theme, fonts and icons come from the `nova` preset (Lucide icons, Geist). Preset choice is _not_
locked in the way the primitives base is — `pnpm dlx shadcn@latest apply --only theme` swaps it.
