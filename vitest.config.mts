import path from "node:path";
import { fileURLToPath } from "node:url";
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin";
import react from "@vitejs/plugin-react";
import { playwright } from "@vitest/browser-playwright";
import { defineConfig } from "vitest/config";

const dirname = path.dirname(fileURLToPath(import.meta.url));
const storybookConfigDir = path.join(dirname, ".storybook");

/**
 * One browser project per theme.
 *
 * `storybookTest`'s own types document `initialGlobals` as the way to pin a
 * toolbar global per project, naming a per-theme project as the motivating case.
 * Because `@storybook/addon-a11y` runs axe during these runs and
 * `parameters.a11y.test` is `'error'` in `.storybook/preview.tsx`, this gets
 * every story checked for contrast in *both* themes automatically — which is
 * what makes the solved token values in globals.css enforceable rather than
 * aspirational.
 *
 * Cost: story tests run twice. If that becomes the slow part of `pnpm check`,
 * dropping the light project is a one-line change — but it is also the theme
 * most likely to break, since the anchor is dark-native.
 */
async function storyProject(theme: "light" | "dark") {
  return {
    // `storybookTest` is async and returns an array of plugins — it must be
    // awaited, which is why the whole config is an async factory.
    plugins: await storybookTest({
      configDir: storybookConfigDir,
      storybookScript: "pnpm run storybook --ci",
      initialGlobals: { theme },
    }),
    resolve: { tsconfigPaths: true },
    test: {
      name: `stories:${theme}`,
      browser: {
        enabled: true,
        provider: playwright(),
        headless: true,
        instances: [{ browser: "chromium" as const }],
      },
    },
  };
}

// The documented snippet wraps this in `mergeConfig(viteConfig, ...)`, which
// assumes a `vite.config.*`. Next.js projects have none, so that argument is
// dropped and each project declares what it needs instead. Keeping the settings
// inside explicit projects rather than at the root stops `environment: "jsdom"`
// and the unit `include` globs from leaking into the browser projects.
export default defineConfig(async () => ({
  test: {
    projects: [
      {
        plugins: [react()],
        // Resolves the `@/*` alias from tsconfig.json. Native as of Vite 7 — the
        // `vite-tsconfig-paths` plugin the Next.js docs recommend is no longer needed.
        resolve: { tsconfigPaths: true },
        test: {
          name: "unit",
          environment: "jsdom",
          setupFiles: ["./vitest.setup.ts"],
          // Explicit include: Vitest's default glob does not exclude `.next`,
          // which contains generated files that must never be collected as
          // tests. `components/**` is included so component tests can live
          // beside the component.
          include: [
            "__tests__/**/*.test.{ts,tsx}",
            "app/**/*.test.{ts,tsx}",
            "components/**/*.test.{ts,tsx}",
          ],
        },
      },
      await storyProject("light"),
      await storyProject("dark"),
    ],
  },
}));
