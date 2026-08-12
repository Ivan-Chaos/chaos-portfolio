# Specs

One file per piece of work, written before it is built. `/to-spec` writes them here; `/to-tickets`
breaks them into vertical slices; `/implement` builds from them.

A spec describes **what** and **why** in terms of user-visible behaviour — the problem, the solution,
user stories, the decisions taken, what's explicitly out of scope, and how it will be tested. It
does not contain file paths or code, with one carve-out: inline a small snippet when it pins a
decision more precisely than prose can (a type shape, a state machine, a schema).

Use the vocabulary in [`../../CONTEXT.md`](../../CONTEXT.md). If a spec needs a word that isn't
there yet, that's a signal to settle the term and add it — in the same session, not later.
