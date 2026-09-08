import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DispatchArticle } from "@/components/news/dispatch-article";
import { Container } from "@/components/ui/layout";
import { dispatches, findDispatch } from "@/content/dispatches";
import { siteOpenGraph } from "@/lib/metadata";

export function generateStaticParams() {
  return dispatches.map((dispatch) => ({ slug: dispatch.slug }));
}

/**
 * An unknown slug 404s at the router rather than being rendered on demand.
 * Every dispatch is known at build time — `content/dispatches.ts` is the list —
 * so a slug outside `generateStaticParams` is never legitimate.
 *
 * `dynamicParams` is one of the route segment configs Cache Components would
 * *remove*; it is available here precisely because that flag stays off. See
 * docs/adr/0002-cache-components-stays-off.md.
 *
 * **In dev, this list is cached across edits.** Adding a dispatch to
 * `content/dispatches.ts` and creating its `.mdx` is not enough — the running
 * dev server keeps the params it already resolved, so the new slug 404s while
 * every existing one keeps working. It looks exactly like a missing file or a
 * bad slug, and it is neither. Restart `next dev` after adding one.
 */
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: PageProps<"/news/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const dispatch = findDispatch(slug);
  // No `notFound()` here: the page below owns the 404, and a metadata function
  // that throws leaves the response without a status anyone can act on.
  if (!dispatch) return {};

  return {
    title: dispatch.title,
    description: dispatch.standfirst,
    alternates: { canonical: `/news/${dispatch.slug}` },
    openGraph: {
      // A child segment *replaces* the parent's `openGraph` rather than merging
      // into it, so `siteName` and `locale` come from the shared base rather
      // than being inherited — see lib/metadata.ts.
      ...siteOpenGraph,
      type: "article",
      title: dispatch.title,
      description: dispatch.standfirst,
      url: `/news/${dispatch.slug}`,
      // The stored ISO day, passed through. Nothing here reads the clock.
      publishedTime: dispatch.published,
    },
  };
}

/**
 * **This component is async, and therefore gets no unit test.**
 *
 * It awaits `params` (a Promise in Next 16 — the synchronous fallback is fully
 * removed) and it awaits the body import. AGENTS.md rules out unit-testing an
 * async server component *and* rules out refactoring one into a client
 * component to make it testable, so this file holds as little as it can:
 * resolve the slug, load the body, hand both to a synchronous component.
 *
 * What covers it instead: `components/news/news.test.tsx` owns all the markup
 * through `DispatchArticle`; `components/shell/site-shell.test.tsx` owns the
 * landmarks; `__tests__/content.test.ts` owns the slug-to-file agreement; and
 * `news.stories.tsx` puts the rendered article under axe in both themes. The
 * MDX compile step itself has no automated coverage in `pnpm check` — that is
 * the accepted cost of docs/adr/0008, and `next build` is what catches it.
 *
 * `Container width="prose"` is `max-w-3xl`, and `Prose`'s own `max-w-[68ch]` is
 * the tighter constraint — so the container is not what measures the running
 * text. What it measures is the article *header*: the `h1`, the standfirst, the
 * badge row and the back link all get the full column. That is the standard
 * editorial arrangement, prose at its measure and everything else at the
 * column's, sharing a left edge.
 */
export default async function DispatchPage({
  params,
}: PageProps<"/news/[slug]">) {
  const { slug } = await params;
  const dispatch = findDispatch(slug);
  // Ahead of the import, so an unknown slug 404s instead of surfacing a module
  // resolution error — and so this still behaves in dev, where
  // `dynamicParams = false` is not what serves the 404.
  if (!dispatch) notFound();

  // The one place in the repo that touches an `.mdx` file, which is the
  // invariant docs/adr/0008 protects. A template-literal dynamic import, per
  // node_modules/next/dist/docs/01-app/02-guides/mdx.md. TypeScript does not
  // resolve a template-literal specifier, so the shape is asserted rather than
  // inferred.
  const { default: Body } = (await import(
    `@/content/dispatches/${dispatch.slug}.mdx`
  )) as { default: React.ComponentType };

  return (
    <Container width="prose">
      <DispatchArticle dispatch={dispatch}>
        <Body />
      </DispatchArticle>
    </Container>
  );
}
