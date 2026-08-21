import { IconBrandGithub, IconBrandLinkedin } from "@tabler/icons-react";
import { Decode } from "@/components/motion/decode";
import { buttonVariants } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Link } from "@/components/ui/link";
import { Heading, Kicker, Text } from "@/components/ui/typography";
import { email, gitHubUrl, linkedInUrl, profile } from "@/content/profile";
import { BANDS } from "./bands";

/**
 * The unnumbered opening band.
 *
 * Four things about it are decisions rather than defaults:
 *
 * **It is never wrapped in a `Reveal`.** The `h1` is the largest element above
 * the fold and therefore the LCP candidate, and an element at `opacity: 0` is
 * excluded from LCP candidacy outright — it does not become one again by fading
 * in. Fading the headline would be a self-inflicted metric regression. Reveals
 * start at the first numbered band.
 *
 * **The standfirst is chrome, not `Prose`.** Forty words is not long-form, and
 * reaching for the proportional face here would be the first step in widening
 * the one deviation the anchor records.
 *
 * **The name never wraps.** Ten monospace characters at an advance of ≈0.6em is
 * ≈288px at `text-5xl`, inside a ≈350px container at 390px — and the ratio only
 * improves at the larger steps, because each one arrives with a wider viewport.
 * So the size scales and the line count does not.
 *
 * **The index panel is the answer to the empty right-hand half.** A hero that
 * is one column of text on a 1536px screen is a document; a legend beside it is
 * a panel. It is also genuinely useful — it is the only place the whole page's
 * shape is visible at once.
 */
function MastheadBand() {
  return (
    <div className="grid gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-16 lg:py-28">
      <div className="min-w-0">
        <Kicker className="flex items-center gap-2">
          {/* Rhymes with TimelineMarker's `current` treatment — same signal,
              same meaning: this is the live one. */}
          <span aria-hidden="true" className="size-1.5 shrink-0 bg-signal" />
          Current — {profile.currentOrganisation},{" "}
          {profile.currentOrganisationLocation}
        </Kicker>

        {/* The first and only use of the display steps. They were provisioned
            in the scale for exactly this and are dead weight anywhere else. */}
        <Heading level={1} size="3xl" className="mt-6 sm:text-6xl lg:text-7xl">
          <Decode text={profile.name} />
          {/* The caret. It blinks through the decode and keeps blinking after —
              a value that resolved at a prompt someone is still sitting at.
              0.45ch + the margin fits inside the ~60px the name leaves spare at
              390px, so the no-wrap guarantee above still holds. */}
          {/* `signal-edge`, not `signal`: the mark has to register on the light
              ground, where raw amber is 1.57:1. The edge token is the solved
              3:1 value in light and the identical amber in dark. */}
          <span
            aria-hidden="true"
            className="ms-[0.25ch] inline-block h-[0.72em] w-[0.45ch] masthead-caret bg-signal-edge"
          />
        </Heading>

        <p className="mt-3 font-heading text-lg font-medium text-muted-foreground sm:text-xl lg:text-2xl">
          {profile.positioning}
        </p>

        <Text size="lg" tone="muted" className="mt-6 max-w-[56ch]">
          {profile.standfirst}
        </Text>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          {/* The one amber button on the page. A second would stop the first
              meaning "start here". */}
          <Link
            href="#engagements"
            variant="unstyled"
            className={buttonVariants({
              variant: "signal",
              size: "lg",
              className: "w-full sm:w-auto",
            })}
          >
            See the work
          </Link>
          <Link
            href={`mailto:${email}`}
            variant="unstyled"
            /* Not external: a mail client is not a new tab, so the arrow and
               the "(opens in a new tab)" announcement would both be untrue. */
            external={false}
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "w-full sm:w-auto",
            })}
          >
            Email
          </Link>

          <div className="mt-1 flex items-center gap-5 sm:ms-2 sm:mt-0">
            <Link href={linkedInUrl} variant="quiet" className="text-sm">
              <Icon as={IconBrandLinkedin} />
              LinkedIn
            </Link>
            <Link href={gitHubUrl} variant="quiet" className="text-sm">
              <Icon as={IconBrandGithub} />
              GitHub
            </Link>
          </div>
        </div>
      </div>

      {/* The legend. A hero that is one column of text on a 1536px screen is a
          document; a legend beside it is a panel. It also happens to be the
          only place the whole page's shape is visible at once. */}
      <nav aria-label="Page index" className="min-w-0 lg:pt-3">
        <div className="bg-card corner-ticks [--tick-len:0.875rem]">
          <p className="border-b border-hairline px-4 py-3 label-caps text-muted-foreground">
            Index
          </p>
          <ul>
            {BANDS.map((band) => (
              <li
                key={band.id}
                className="border-b border-hairline last:border-b-0"
              >
                <Link
                  href={`#${band.id}`}
                  variant="unstyled"
                  className="flex w-full items-baseline gap-3 px-4 py-2.5 text-xs transition-colors duration-(--duration-fast) hover:bg-accent hover:text-signal-text"
                >
                  <span
                    aria-hidden="true"
                    className="text-2xs text-muted-foreground tabular-nums"
                  >
                    {band.index}
                  </span>
                  {band.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 text-2xs text-muted-foreground">
          {profile.location}
        </p>
      </nav>
    </div>
  );
}

export { MastheadBand };
