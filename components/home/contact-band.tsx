import { buttonVariants } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { Text } from "@/components/ui/typography";
import { contactMethods, email } from "@/content/profile";
import { Band } from "./band";
import { ReadoutList, ReadoutRow } from "./readout";

/**
 * Band 07 — how to make contact.
 *
 * **No form.** A form needs a backend, a spam story and a success state before
 * it is anything other than a worse `mailto:`. Every comparable site reaches
 * the same conclusion.
 *
 * **The call to action is `outline`, not `signal`.** The amber is spent in the
 * masthead, on the current-position mark and on the current role in the
 * timeline. A fourth would stop the accent meaning "the one important thing" —
 * and by the time a reader is at band 07, they did not need persuading to get
 * here.
 */
function ContactBand() {
  return (
    <Band
      id="contact"
      index="07"
      title="Contact"
      description="Email is the one that gets read."
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-start lg:gap-12">
        <ReadoutList>
          {contactMethods.map((method) => (
            <ReadoutRow key={method.id} term={method.label}>
              {method.href ? (
                <Link
                  href={method.href}
                  variant="quiet"
                  /* A mail client is not a new tab. Letting the automatic
                     detection treat `mailto:` as external would attach a
                     "(opens in a new tab)" announcement that is not true. */
                  external={
                    method.href.startsWith("mailto:") ? false : undefined
                  }
                >
                  {method.display}
                </Link>
              ) : (
                method.display
              )}
            </ReadoutRow>
          ))}
        </ReadoutList>

        <div>
          <Link
            href={`mailto:${email}`}
            variant="unstyled"
            external={false}
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "w-full lg:w-auto",
            })}
          >
            Start a conversation
          </Link>
          {/* No availability claim. None of the source documents states one,
              and an invented "open to offers" is the kind of thing that has to
              be walked back in the first reply. */}
          <Text size="xs" tone="muted" className="mt-3 max-w-[34ch]">
            Everything on this page traces to a CV. Happy to send the full
            document, or the long version of any of it.
          </Text>
        </div>
      </div>
    </Band>
  );
}

export { ContactBand };
