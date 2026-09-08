import { IconArrowLeft } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/link";
import { Heading, Kicker, Prose, Text } from "@/components/ui/typography";
import type { Dispatch } from "@/content/schema";
import { DateStamp } from "./date-stamp";
import { DispatchCover } from "./dispatch-cover";

/**
 * One dispatch, header and body.
 *
 * Synchronous, and it takes the compiled MDX body as `children`. That split is
 * the point: `app/news/[slug]/page.tsx` has to be `async` (it awaits `params`
 * and the body import), and AGENTS.md rules out unit-testing an async server
 * component — so all the markup lives here, where a test can render it.
 *
 * **A plain `<article>`, not `Band` and not `Section`.** `Band` forces the rail
 * layout, a self-drawing top rule, two register crosses and a figure keyed to
 * the reveal state; all of it is home-page furniture, and the rail exists so a
 * *stack* of bands lines its figures up down the page edge. One section has
 * nothing to line up with, and register crosses on a lone section are
 * decoration with no reason, which CONTEXT.md calls drift. `Section` is closer
 * and still wrong: it draws its own rule, wants a `title`, and its
 * `aria-labelledby` would name the region identically to the `h1`.
 * `<article aria-labelledby>` is already the right element with the right role.
 *
 * **The header is entirely chrome; only `children` crosses into the
 * proportional face.** That is the boundary the one recorded deviation is
 * scoped to: the standfirst reads like prose and is chrome, because two
 * sentences do not accumulate the way thirty paragraphs do and a typeface
 * change two lines under the title buys nothing. See CONTEXT.md's Standfirst.
 *
 * **The kicker carries the date** — the one fact that positions the piece, and
 * why this page has a kicker where `/news` does not. No amber dot: that mark
 * belongs to the masthead, and the signal is already spent four times.
 *
 * **No `Reveal`.** An article that fades its paragraphs in as you scroll is the
 * AOS register. The gauge and the global reduced-motion guard are the whole
 * motion budget on this route.
 *
 * The cover sits between the header and the body, *outside* `Prose` — whose
 * `max-w-[68ch]` would otherwise narrow it to the text measure. The rule sits
 * on the `<header>`, at the column's full width, rather than on `Prose`, which
 * would draw a short one.
 */
function DispatchArticle({
  dispatch,
  children,
}: {
  dispatch: Dispatch;
  children: React.ReactNode;
}) {
  const titleId = `${dispatch.slug}-title`;

  return (
    <article
      data-slot="dispatch-article"
      aria-labelledby={titleId}
      className="py-14 sm:py-20 lg:py-24"
    >
      <header className="border-b border-hairline pb-10">
        <BackLink />

        <Kicker className="mt-8">
          <DateStamp dispatch={dispatch} />
        </Kicker>

        <Heading level={1} id={titleId} className="mt-4">
          {dispatch.title}
        </Heading>

        <Text size="lg" tone="muted" className="mt-4">
          {dispatch.standfirst}
        </Text>

        {dispatch.topics.length > 0 ? (
          <ul className="mt-6 flex flex-wrap gap-1.5">
            {dispatch.topics.map((topic) => (
              <li key={topic} className="min-w-0">
                <Badge variant="outline">{topic}</Badge>
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      {dispatch.cover ? (
        <DispatchCover
          cover={dispatch.cover}
          sizes="(min-width: 48rem) 44rem, 100vw"
          preload
          className="mt-10"
        />
      ) : null}

      <Prose className="mt-10">{children}</Prose>

      {/* Again at the foot, because "back" is the single most-wanted action
          after a long read and scrolling up to find it is not an answer. */}
      <footer className="mt-12 border-t border-hairline pt-6">
        <BackLink />
      </footer>
    </article>
  );
}

/**
 * "All news" rather than "News", so it does not collide in meaning with the
 * header's News link — this one goes to the list, that one goes to the section.
 */
function BackLink() {
  return (
    <Link
      href="/news"
      variant="quiet"
      className="text-xs text-muted-foreground"
    >
      <Icon as={IconArrowLeft} size="sm" />
      All news
    </Link>
  );
}

export { DispatchArticle };
