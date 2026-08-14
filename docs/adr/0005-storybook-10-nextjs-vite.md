# Storybook 10 on the Vite framework

The component library is developed and documented in Storybook 10, using
`@storybook/nextjs-vite` rather than the webpack `@storybook/nextjs`. Recorded because both halves
look like arbitrary version pinning and neither is.

**Storybook 10 is a floor, not a preference.** Storybook 9.x is broken on Next 16 —
`swc.isWasm is not a function` (storybookjs/storybook#33088) — and the fix was not backported,
because only security fixes land in the previous major. Next 16 support arrived in
`10.0.0-beta.2`. Downgrading Storybook is therefore not an available response to a Storybook problem
while this project is on Next 16.

**`@storybook/nextjs-vite` is Storybook's own recommendation for Next.js** and is the only framework
the Vitest addon supports, which is what lets stories run as browser tests. The webpack framework
exists for projects with a custom webpack or Babel config; this project has neither, and Turbopack is
Next 16's default anyway.

## Consequences

**`postcss.config.mjs` must stay in object form.** Next.js historically accepted an array of plugin
names; Vite does not. Storybook's Next.js framework detects the array form and **rewrites the file on
disk** to convert it. This project's config already uses the object form —

```js
const config = { plugins: { "@tailwindcss/postcss": {} } };
```

— which both Next and Vite accept, so nothing is rewritten. Changing it back to an array would make
Storybook silently edit a tracked file. Note also that the widely-circulated advice to add
`@tailwindcss/vite` inside `viteFinal` is aimed at plain Vite projects and is **not** what this
framework does; Tailwind v4 reaches Storybook through the existing PostCSS config.

**Do not install `@storybook/addon-essentials`, `@storybook/addon-interactions`, or
`@storybook/addon-viewport`.** All three are stranded on npm at 8.6.x / 9.0.8 with no `deprecated`
flag, so `pnpm add` will happily resolve a package two majors behind without warning. Their
functionality is now core: viewport, backgrounds, controls, actions, measure, outline and toolbars
ship with Storybook itself, and interaction testing is `storybook/test` plus
`@storybook/addon-vitest`.

**The theme decorator is hand-written rather than `withThemeByClassName`.** Storybook has no built-in
for rendering one story in two themes at once — `withThemeByClassName` mutates a single element and
structurally cannot — so `.storybook/preview.tsx` replaces it, using the addon's exported
`DecoratorHelpers` to keep the toolbar and the `theme` global working. The global's name matters: the
Vitest projects pin it via `initialGlobals: { theme }`.

**Story tests run twice, once per theme.** `vitest.config.mts` defines one browser project per theme,
which is what puts every story under axe in both light and dark. Combined with
`parameters.a11y.test: "error"`, a contrast regression in `app/globals.css` fails `pnpm check` instead
of waiting to be spotted. The cost is doubled story-test time; dropping the light project is a
one-line change if that ever outweighs the benefit, though light is the mode more likely to break.

**Playwright is a real dependency** with a browser binary to install (`pnpm exec playwright install
chromium`). A fresh clone needs that step before `pnpm test` passes.
