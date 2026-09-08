import type { Metadata } from "next";
import { Container } from "@/components/ui/layout";
import { Link } from "@/components/ui/link";
import { Heading, Text } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Not found",
};

/**
 * The 404, which renders inside the root layout and therefore inside
 * `SiteShell` — so it arrives with the real header, the real `<main>` and the
 * real footer. That is a side effect of moving the shell up (docs/adr/0007),
 * and it is why this file is worth having: without it Next's bare "404 | This
 * page could not be found" appears between the site's own chrome, which is
 * off-anchor in a way that reads as broken rather than as minimal.
 *
 * The page-head grammar, same as `/news`: title as the `h1`, one sentence, and
 * a way back.
 */
export default function NotFound() {
  return (
    <Container width="prose">
      <div className="py-14 sm:py-20 lg:py-24">
        <Heading level={1}>Not found</Heading>
        <Text size="lg" tone="muted" className="mt-4">
          There is nothing at this address. It may have been renamed, or the
          link that brought you here may be wrong.
        </Text>
        <Link href="/" variant="quiet" className="mt-8 text-xs">
          Back to the front page
        </Link>
      </div>
    </Container>
  );
}
