# chaos-portfolio

Ivan's personal portfolio site. This file is the project's ubiquitous language: the words we use for
domain concepts, in code, tests, commits, specs and conversation.

## Language

### Design system

**Anchor**:
The single aesthetic direction the whole system commits to — currently Industrial, the register of a
ground-station telemetry readout. It names a fixed set of tokens, not a mood, so a rendered result
that falls outside them means the anchor did not hold.
_Avoid_: theme (that word is taken by light/dark), style, aesthetic, vibe

**Deviation**:
A rule the anchor specifies that this project deliberately breaks, recorded in an ADR with its
reason and its scope. There is exactly one — the proportional face for prose. Anything else that
falls outside the anchor is drift, which is a defect.
_Avoid_: exception, override

**Signal**:
Amber — the one colour the system spends on decoration. Buttons, focus rings, active states, marks.
_Avoid_: accent (`--accent` is the neutral hover fill and means something else), brand, primary
(`--primary` is ink), highlight

**Status**:
The functional-only hues, danger and success. Permitted in validation, destructive actions, alerts
and toasts, and nowhere else — never as decoration, a background, or a gradient.
_Avoid_: semantic colour, state colour, alert colour

**Ramp**:
A raw named colour scale with no meaning attached — `--ink-*`, `--amber-*`, `--red-*`, `--green-*`.
Ramps exist so semantic tokens have something to point at; using one directly in a component is a
defect.
_Avoid_: palette, scale, swatch set

**Semantic token**:
A named role that a component actually references — `--background`, `--signal`, `--control`. Every
one is redefined per theme, which is what makes light and dark a value change rather than a
different stylesheet.
_Avoid_: alias, variable

**Surface**:
One of the three flat planes: the ground, raised, and sunken. The anchor has no elevation model,
because it has no shadows — a surface change plus a rule is the whole vocabulary of depth.
_Avoid_: elevation, layer, level, z-plane

**Hairline**:
A decorative 1px rule — dividers, table rules, section separators. Deliberately low contrast, and
therefore not permitted on anything interactive.
_Avoid_: divider, separator, rule (`Separator` and `Divider` are component names, not this token)

**Control border**:
The border that tells a user where an interactive element is, held to 3:1. Distinct from a hairline,
and picking the wrong one of the two is an accessibility bug rather than a style preference.
_Avoid_: input border, field border, outline (that word means the focus ring)

**Corner ticks**:
The four short hairline brackets that register a surface at its corners instead of enclosing it in a
box. The system's signature treatment.
_Avoid_: crop marks, brackets, corners, reticle

**Treatment**:
One of the ways a control can be rendered — `filled`, `signal`, `outline`,
`transparent`, `underline`, `danger`. A treatment is appearance only; it never
changes what the control does or what element it renders.
_Avoid_: variant (that word means the cva prop generally), style, kind, type

**Control surface**:
The shared appearance of anything the user types into — sunken ground, 1px
`control` border, square. Exported as `controlSurface` from the Input module so
Textarea, NumberField and the date and time inputs cannot drift away from it.
_Avoid_: input style, field style

**Chrome**:
Every part of the interface that is not long-form prose — labels, buttons, inputs, headings, table
data, numerals, code. Chrome always sets in the monospace face.
_Avoid_: UI text, interface copy

**Prose**:
Long-form running text, and the only context permitted the proportional face. The distinction from
chrome is what keeps the one deviation from spreading.
_Avoid_: body text, copy, content

### Conventions

Add a term the moment it is decided, not in a later batch. The format:

```md
**Term**:
One or two sentences. Define what it IS, not what it does.
_Avoid_: rejected synonym, another rejected synonym
```

Rules that matter here:

- **Be opinionated.** When several words mean the same thing, pick one and list the rest under
  `_Avoid_`.
- **Project-specific concepts only.** General programming vocabulary does not belong, however much
  the project uses it. Before adding a term, ask whether it is unique to this project or just
  programming.
- Group under subheadings once natural clusters appear; a flat list is fine until then.
