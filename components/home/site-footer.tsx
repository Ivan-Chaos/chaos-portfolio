import {
  IconArrowUp,
  IconBrandGithub,
  IconBrandLinkedin,
} from "@tabler/icons-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Icon } from "@/components/ui/icon";
import { Container } from "@/components/ui/layout";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/typography";
import { email, gitHubUrl, linkedInUrl, profile } from "@/content/profile";
import { BANDS } from "./bands";

/** What the page is made of. Four columns of chrome, and all of it checkable. */
const COLOPHON = [
  { term: "Framework", definition: "Next.js 16, App Router, React 19" },
  { term: "Styling", definition: "Tailwind v4, CSS-first tokens" },
  {
    term: "Primitives",
    definition: "Base UI via shadcn, documented in Storybook",
  },
  { term: "Type", definition: "JetBrains Mono, Archivo for prose" },
];

/**
 * The end of the page, and the only place the theme control lives.
 *
 * Putting it here rather than in the header is deliberate: a preference switch
 * is not a primary action, and a permanent seat in a 56px sticky bar is the
 * most expensive real estate on the page. Anyone who wants it will find it at
 * the bottom, which is where every other site keeps it.
 *
 * The rest is a colophon and a sign-off. Both are "filler" in the sense that
 * the page would function without them — and both are the reason the page ends
 * rather than just stopping. The oversized name is set in the heading face, not
 * `figure-condensed`: that utility is for section numerals and widening it is
 * exactly how the one recorded deviation stops being one.
 *
 * No copyright year, because the only way to get one is to read the clock, and
 * nothing on this page is derived from the current date. A year that silently
 * goes stale is worse than no year; one that differs between the server render
 * and the client render is worse than both.
 */
function SiteFooter() {
  return (
    <footer className="relative mt-8 border-t border-hairline">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-16">
          <div className="min-w-0">
            <p className="label-caps text-muted-foreground">Colophon</p>
            <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-2">
              {COLOPHON.map((item) => (
                <div key={item.term} className="min-w-0">
                  <dt className="text-2xs text-muted-foreground tabular-nums">
                    {item.term}
                  </dt>
                  <dd className="mt-0.5 text-xs">{item.definition}</dd>
                </div>
              ))}
            </dl>
          </div>

          <nav aria-label="All sections" className="min-w-0">
            <p className="label-caps text-muted-foreground">Sections</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-1.5 lg:grid-cols-1">
              {BANDS.map((band) => (
                <li key={band.id}>
                  <Link
                    href={`#${band.id}`}
                    variant="quiet"
                    className="text-xs text-muted-foreground"
                  >
                    <span aria-hidden="true" className="text-2xs tabular-nums">
                      {band.index}
                    </span>
                    {band.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* The sign-off, and it is deliberately not a word.
            The first version of this was the name set at `text-7xl` in
            `--hairline-strong` — the ghosted-watermark reflex. It measured
            2.09:1 and failed the contrast gate, which was the right result: a
            watermark is text nobody can read, and "decorative" is not an
            exemption. A ruler edge says the same thing about the page ending,
            carries no text, and has no threshold to fail. */}
        <div
          aria-hidden="true"
          className="mt-14 h-6 w-full tick-scale sm:h-8 sm:[--tick-step:1rem]"
        />

        <div className="mt-8 flex flex-col gap-6 border-t border-hairline pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href={`mailto:${email}`}
              external={false}
              variant="quiet"
              className="text-xs"
            >
              {email}
            </Link>
            <Link href={linkedInUrl} variant="quiet" className="text-xs">
              <Icon as={IconBrandLinkedin} size="sm" />
              LinkedIn
            </Link>
            <Link href={gitHubUrl} variant="quiet" className="text-xs">
              <Icon as={IconBrandGithub} size="sm" />
              GitHub
            </Link>
          </div>

          <div className="flex items-center gap-5">
            <Link href="#main" variant="quiet" className="text-xs">
              <Icon as={IconArrowUp} size="sm" />
              Top
            </Link>
            <ThemeToggle />
          </div>
        </div>

        <Text size="2xs" tone="muted" className="mt-6">
          {profile.name} — {profile.location}
        </Text>
      </Container>
    </footer>
  );
}

export { SiteFooter };
