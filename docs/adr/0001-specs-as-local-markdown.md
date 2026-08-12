# Specs live as local Markdown, not in an issue tracker

Specs, tickets and ADRs are Markdown files in this repo (`docs/specs/`, `docs/adr/`) rather than
issues in GitHub or Linear. This is a solo portfolio project with no git remote yet, and keeping the
written record in the repo means it is versioned with the code that implements it, readable by any
agent without auth, and costs nothing to start.

## Considered options

**GitHub Issues** has the strongest support in the spec-driven skills — `/to-tickets` can express
real blocking edges between tickets and `/triage` can move them through states. Rejected for now
because it requires creating a remote repo and authenticating `gh`, and because for one person the
dependency graph is small enough to hold in a document.

**Linear** was rejected for the same reason plus an MCP server dependency.

## Consequences

`/to-tickets` and `/triage` are weaker here: blocking relationships are prose in a file rather than
queryable edges, and there is no board. Accepted deliberately. If the project grows past the point
where a single spec file can hold the sequencing, migrating to GitHub Issues is the fallback — and
because specs are committed, the history survives the move.
