import Image from "next/image";
import type { MDXComponents } from "mdx/types";
import { Link } from "@/components/ui/link";
import { Code, codeSurface, Heading } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

/**
 * The element map for a dispatch body, re-exported by the root
 * `mdx-components.tsx`.
 *
 * It lives here rather than there so `prose.stories.tsx` can render every entry
 * in real Chromium, in both themes, under axe — without Storybook or Vitest
 * learning to compile MDX. See docs/adr/0008.
 *
 * `@tailwindcss/typography` is **not** installed and must not be. Its `prose`
 * class ships its own colour, size and measure scale, which would sit on top of
 * the `@theme inline` tokens and fight them; and it styles headings and code as
 * prose, which is the exact distinction CONTEXT.md draws between chrome and
 * prose. Everything below is built from existing primitives and semantic
 * tokens instead.
 *
 * **Where the face switches.** The `Prose` wrapper puts `prose-face` on the
 * container, so paragraphs, list bodies, blockquotes and link text inherit the
 * proportional face — that is the one recorded deviation and it stops there.
 * Pulled back to chrome, explicitly:
 *
 * - **headings**, via `Heading`'s own `font-heading`, which resolves to
 *   JetBrains Mono. CONTEXT.md lists headings as chrome; this is the rule
 *   holding, not an oversight.
 * - **`code` and `pre`** — and these need no class. Tailwind's preflight sets
 *   `code, kbd, samp, pre { font-family: var(--default-mono-font-family) }` and
 *   globals.css points that at `--font-mono`. An author-origin rule on the
 *   element beats an inherited family, so fenced and inline code set in
 *   JetBrains Mono inside `Prose` without being asked.
 * - **the `ol` counter**, via `marker:font-mono`. A numeral is chrome.
 * - **figure captions**, which are a label rather than running text.
 *
 * **Rhythm.** `Prose` owns paragraph-to-paragraph spacing with `[&_p+p]:mt-4`,
 * a descendant rule that outranks a class on the element itself — so there is
 * deliberately no `p` entry below, and no `h1` either (the dispatch title is
 * the page's, and a second one breaks the outline). Every other block carries
 * its own `my-*` and adjacent margins collapse, which gives each relationship
 * exactly one source and needs no `first:mt-0`.
 *
 * `strong` and `em` are absent for the same reason: `Prose` already sets the
 * strong weight, and emphasis wants nothing but the proportional face's own
 * italic, which is why `app/layout.tsx` asks `next/font` for it.
 */
export const dispatchProse: MDXComponents = {
  h2: ({ children, ...props }) => (
    <Heading {...props} level={2} size="md" className="mt-12 mb-3">
      {children}
    </Heading>
  ),
  h3: ({ children, ...props }) => (
    <Heading {...props} level={3} size="sm" className="mt-8 mb-2">
      {children}
    </Heading>
  ),
  h4: ({ children, ...props }) => (
    <Heading {...props} level={4} size="xs" className="mt-6 mb-2">
      {children}
    </Heading>
  ),

  // Preflight resets `list-style: none` on ol and ul, so the marker has to be
  // put back. A filled square at `hairline-strong` is the same mark the
  // engagement card and the role highlights draw as a `size-1` span — reached
  // here through `::marker`, which needs no element per bullet. A disc is not
  // this anchor's idiom.
  ul: ({ children, ...props }) => (
    <ul
      {...props}
      className="my-6 list-[square] space-y-2 ps-5 marker:text-hairline-strong"
    >
      {children}
    </ul>
  ),
  // `marker:font-mono` because the counter is a numeral, and numerals are
  // chrome — without it the count sets in the proportional face the list body
  // legitimately inherits.
  ol: ({ children, ...props }) => (
    <ol
      {...props}
      className="my-6 list-decimal space-y-2 ps-6 marker:font-mono marker:text-muted-foreground marker:tabular-nums"
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li {...props} className="ps-1">
      {children}
    </li>
  ),

  // A rule and muted ink. Not a card, not a fill, no quote glyph, and not the
  // signal: amber is spent on the masthead mark, the masthead CTA, the current
  // role and the gauge, and a pull quote is not the most important thing on any
  // page.
  blockquote: ({ children, ...props }) => (
    <blockquote
      {...props}
      className="my-8 border-s-2 border-hairline-strong ps-5 text-muted-foreground"
    >
      {children}
    </blockquote>
  ),

  // A fenced block. This cannot render `CodeBlock` — MDX nests the fence's own
  // `<code>` inside the `<pre>`, and that component supplies a `<code>` of its
  // own, so the result would be `<pre><code><code>`. It reuses `codeSurface`
  // (the shared class string, same pattern as `controlSurface` in the Input
  // module) and flattens the inner element with a descendant rule rather than
  // sniffing for `className="language-*"`, which would be wrong for a fence
  // opened with no language.
  //
  // `tabIndex` for the reason `CodeBlock` carries it: without it an overflowing
  // block scrolls by mouse only.
  pre: ({ children, className, ...props }) => (
    <pre
      {...props}
      tabIndex={0}
      className={cn(
        codeSurface,
        // The inner element is `Code`, which carries a border, a fill, padding
        // and `text-[0.9em]`. All four have to be neutralised: inside a fence
        // the surface belongs to the `<pre>`. `[font-size:inherit]` rather than
        // `text-inherit` because that utility resets colour, not size — which
        // would leave fenced code a notch smaller than the block it sits in.
        "my-8 [&>code]:border-0 [&>code]:bg-transparent [&>code]:p-0 [&>code]:[font-size:inherit]",
        className,
      )}
    >
      {children}
    </pre>
  ),
  code: ({ children, ...props }) => <Code {...props}>{children}</Code>,

  // Straight through `components/ui/link.tsx`, which is what extends the whole
  // external-link guarantee — `target`, `rel="noopener noreferrer"`, the arrow
  // and the "(opens in a new tab)" announcement — to article prose for free.
  // `app/page.test.tsx` already asserts that guarantee sitewide. `variant`
  // stays `default`: underlined at rest, because nothing else marks a link
  // inside a paragraph.
  a: ({ href, children, ...props }) => (
    <Link
      {...props}
      href={href ?? "#"}
      // `inline`, overriding `Link`'s `inline-flex`. That default is right in a
      // nav or a CTA, where it lays the external arrow out beside the label —
      // but `inline-flex` makes an anchor an atomic inline box, so a link of
      // several words inside a paragraph cannot break across lines. Coming back
      // to `inline` restores wrapping and costs only the flex `gap`, which the
      // icon's own margin replaces.
      className="inline [&>svg]:mx-0.5 [&>svg]:inline [&>svg]:align-[-0.125em]"
    >
      {children}
    </Link>
  ),

  hr: (props) => <hr {...props} className="my-12 h-px border-0 bg-hairline" />,

  // A caption is a label, not running text, so it comes back to chrome.
  figure: ({ children, ...props }) => (
    <figure {...props} className="my-8">
      {children}
    </figure>
  ),
  figcaption: ({ children, ...props }) => (
    <figcaption
      {...props}
      className="mt-2 font-mono text-xs text-muted-foreground"
    >
      {children}
    </figcaption>
  ),

  /**
   * The in-body image, and the reason it is capitalised.
   *
   * **A lowercase JSX tag in MDX does not go through this map.** MDX compiles
   * `<img />` written as JSX straight to the intrinsic element; only elements
   * markdown *generates* — from `![alt](src)` — are looked up in the component
   * map. So a body writing `<img>` gets a bare tag: no `next/image`, no
   * `sizes`, no border, and no optimisation. A capitalised name is compiled to
   * `_components.Figure`, which is this.
   *
   * Markdown's own image syntax is not the alternative: it carries no
   * dimensions, so it cannot reserve space and every image would shift the page
   * as it loads. `__tests__/content.test.ts` forbids it for that reason.
   */
  Figure: ({
    src,
    alt,
    width,
    height,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
  }) => (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      sizes="(min-width: 48rem) 44rem, 100vw"
      className="my-8 h-auto w-full border border-hairline"
    />
  ),
};
