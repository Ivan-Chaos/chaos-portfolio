import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  // Resolves the `@/*` alias from tsconfig.json. Native as of Vite 7 — the
  // `vite-tsconfig-paths` plugin the Next.js docs recommend is no longer needed.
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    // Explicit include: Vitest's default glob does not exclude `.next`, which
    // contains generated files that must never be collected as tests.
    include: ["__tests__/**/*.test.{ts,tsx}", "app/**/*.test.{ts,tsx}"],
  },
});
