import type { MDXComponents } from "mdx/types";
import { dispatchProse } from "@/components/news/prose-components";

/**
 * Required by `@next/mdx` under the App Router — this file must exist at the
 * repo root and export exactly this function, which in Next 16 takes **no
 * arguments** (older signatures passed the inherited components in). Do not
 * rename the export: Next resolves it by name. See
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/mdx-components.md
 *
 * One line on purpose. The map itself lives in `components/news/` so that a
 * story can render it: nothing in `.storybook/` or `vitest.config.mts` knows
 * how to compile MDX, and keeping the map importable from plain TSX is what
 * puts every element under axe in both themes without any of them learning.
 */
export function useMDXComponents(): MDXComponents {
  return dispatchProse;
}
