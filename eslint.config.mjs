import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Added for this project:
    "coverage/**",
    // `storybook build` output. Declaring the ignore list replaces
    // eslint-config-next's defaults rather than extending them, so any new
    // build directory has to be listed here or eslint will lint the bundles.
    "storybook-static/**",
  ]),
]);

export default eslintConfig;
