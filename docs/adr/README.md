# Architecture Decision Records

One file per decision, sequentially numbered: `NNNN-slug.md`. Scan for the highest number and
increment.

**A single paragraph is a complete ADR.** The value is recording _that_ a decision was made and
_why_ — not filling in sections. Add Status / Considered Options / Consequences only when they earn
their place.

Write one only when all three are true:

1. **Hard to reverse** — changing course later costs something real.
2. **Surprising without context** — a future reader would look at the code and wonder why on earth
   it was done this way.
3. **The result of a real trade-off** — there were genuine alternatives.

If a decision is easy to reverse, skip it; you'll just reverse it. If nobody would wonder why,
there's nothing to explain.

Before proposing an architectural change, read what's here. A decision recorded in this directory
was made deliberately — reopen it explicitly rather than quietly working around it.
