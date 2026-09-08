import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Deliberately minimal. Note that `cacheComponents` is intentionally NOT set —
  // see docs/adr/0002-cache-components-stays-off.md before enabling it.
  //
  // `pageExtensions` is intentionally not set either, which is where this parts
  // company with every `@next/mdx` snippet in circulation. Those add "md"/"mdx"
  // so an `.mdx` file can *be* a route file. No dispatch is one: bodies live in
  // `content/dispatches/` and are imported by `app/news/[slug]/page.tsx`.
  // `@next/mdx` keys both its webpack rule and its Turbopack rule on the file
  // extension rather than on this list (see node_modules/@next/mdx/index.js), so
  // the loader still runs — and Next keeps treating only ts/tsx as route,
  // `proxy` and `instrumentation` files, which is what setting it would widen.
};

/**
 * No remark and no rehype plugins, deliberately.
 *
 * Turbopack is the default builder here, and it can only take plugins named as
 * *strings* with serialisable options — JavaScript functions do not cross into
 * Rust. Both candidates were declined rather than forgotten:
 *
 * - `remark-gfm` autolinks a bare URL, which routes that link around
 *   `components/ui/link.tsx` — the single place the external `rel`, the arrow
 *   and the "(opens in a new tab)" announcement are guaranteed, and the thing
 *   `app/page.test.tsx` asserts about every external link on the site. Write
 *   links as `[text](url)` and they go through `Link` like every other one.
 * - `rehype-slug` buys heading ids, which only pay off once a dispatch is long
 *   enough to want a table of contents or a deep link. None is. Add
 *   `options: { rehypePlugins: ["rehype-slug"] }` the day one is — the string
 *   form, never the imported function — and add `scroll-mt-16` to the mapped
 *   headings at the same time, because the header is sticky and an anchor would
 *   otherwise land underneath it.
 */
const withMDX = createMDX({});

export default withMDX(nextConfig);
