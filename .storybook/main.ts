import type { StorybookConfig } from "@storybook/nextjs-vite";

/**
 * Storybook 10 is a floor, not a preference: 9.x crashes on Next 16 with
 * `swc.isWasm is not a function`, and that fix was not backported.
 * `@storybook/nextjs-vite` (rather than the webpack `@storybook/nextjs`) is
 * Storybook's own recommendation for Next.js and the only framework the Vitest
 * addon supports. See docs/adr/0005-storybook-10-nextjs-vite.md.
 *
 * Globs are resolved relative to this directory. There is no `src/` in this
 * repo, so the generator's default `../src/**` glob does not apply.
 */
const config: StorybookConfig = {
  stories: [
    "../stories/**/*.mdx",
    "../stories/**/*.stories.@(ts|tsx)",
    // Component docs come from autodocs (`tags: ["autodocs"]` in preview), so
    // there is deliberately no `components/**/*.mdx` glob — an unmatched glob
    // prints a warning on every Storybook and Vitest run.
    "../components/**/*.stories.@(ts|tsx)",
  ],
  addons: [
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-themes",
    "@storybook/addon-vitest",
  ],
  framework: "@storybook/nextjs-vite",
  staticDirs: ["../public"],
};

export default config;
