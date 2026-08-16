import { PlusIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Container, Section } from "@/components/ui/layout";
import { Link } from "@/components/ui/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading, Numeral, Prose, Text } from "@/components/ui/typography";

/**
 * Design system index.
 *
 * Built entirely from the component library — Phase 1's version used raw
 * utilities because the components did not exist yet, and leaving it that way
 * would mean the one page in the app was the one place the kit was not used.
 *
 * The actual portfolio content is still not here, because it has not been
 * written. Inventing a bio and a project list would produce a page that looks
 * finished and says nothing true.
 */

const TOKENS = [
  { token: "--background", label: "background" },
  { token: "--surface-raised", label: "surface-raised" },
  { token: "--surface-sunken", label: "surface-sunken" },
  { token: "--signal", label: "signal", note: "fill" },
  { token: "--signal-text", label: "signal-text", note: "text" },
  { token: "--danger", label: "danger", note: "functional" },
  { token: "--success", label: "success", note: "functional" },
];

const READOUT = [
  { term: "Orbital period", value: "92.68", unit: "min" },
  { term: "Apoapsis", value: "418.20", unit: "km" },
  { term: "Inclination", value: "51.64", unit: "deg" },
];

const RULES = [
  {
    value: "type",
    q: "Why is almost everything monospace?",
    a: "The direction is Industrial — a ground-station telemetry readout. Monospace is the default UI face; the proportional face is reserved for long-form prose, which is the one recorded deviation.",
  },
  {
    value: "signal",
    q: "Why is amber three separate tokens?",
    a: "Because a hue behaves differently as a fill than as text. Amber under near-black ink measures 11.42:1 in both themes, but the same amber as text on the light ground is 1.57:1. So the fill, the border and the text are separate tokens, and light mode substitutes solved values.",
  },
  {
    value: "flat",
    q: "Where are the shadows and rounded corners?",
    a: "Removed on purpose. The radius variable is zero and the whole shadow scale resolves to transparent, which is also what lets vendored components arrive square and flat without being edited. Separation comes from a 1px rule on a solid surface.",
  },
];

function Swatch({
  token,
  label,
  note,
}: {
  token: string;
  label: string;
  note?: string;
}) {
  return (
    <div className="min-w-28 flex-1">
      <span
        aria-hidden="true"
        className="block h-12 border border-hairline"
        style={{ background: `var(${token})` }}
      />
      <Text size="2xs" className="mt-2">
        {label}
      </Text>
      {note ? (
        <Text size="2xs" tone="muted">
          {note}
        </Text>
      ) : null}
    </div>
  );
}

export default function Home() {
  return (
    <Container>
      <header className="flex flex-wrap items-center justify-between gap-4 py-8">
        <div>
          <Heading level={1} size="md">
            Ivan Chaus
          </Heading>
          <Link href="mailto:ivan@mail.com" showExternalIcon={false}>
            ivan@mail.com
          </Link>
        </div>
        <ThemeToggle />
      </header>

      <main>
        <Section id="direction" index="01" title="Direction">
          <Card className="max-w-[68ch]">
            <CardContent>
              <Prose>
                <p>
                  The design system commits to one direction: Industrial — the
                  register of a ground-station telemetry readout. Monospace
                  throughout, a warm-black ground, flat 1px rules in place of
                  shadows, square corners, and a single amber signal.
                </p>
              </Prose>
            </CardContent>
          </Card>
        </Section>

        <Section id="palette" index="02" title="Palette">
          <div className="flex flex-wrap gap-4">
            {TOKENS.map((t) => (
              <Swatch key={t.token} {...t} />
            ))}
          </div>
          <Text tone="muted" className="mt-6 max-w-[68ch]">
            Every pairing is solved numerically against its real threshold and
            re-checked in both themes on every run, so a contrast regression
            fails the build rather than waiting to be noticed.
          </Text>
        </Section>

        <Section id="readout" index="03" title="Readout">
          <div className="grid gap-6 sm:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sample values</CardTitle>
              </CardHeader>
              <CardContent>
                <dl className="space-y-1.5">
                  {READOUT.map(({ term, value, unit }) => (
                    <div
                      key={term}
                      className="flex items-baseline justify-between border-b border-hairline pb-1.5"
                    >
                      <dt className="text-sm text-muted-foreground">{term}</dt>
                      <dd className="text-sm">
                        <Numeral value={value} unit={unit} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            <div className="space-y-5">
              <Field>
                <FieldLabel htmlFor="home-email">Email</FieldLabel>
                <Input
                  id="home-email"
                  type="email"
                  placeholder="ivan@mail.com"
                />
                <FieldDescription>
                  Labels are uppercase mono; the control border is held to 3:1.
                </FieldDescription>
              </Field>
              <div className="flex flex-wrap gap-3">
                <Button variant="signal">
                  <PlusIcon data-icon="inline-start" />
                  Signal
                </Button>
                <Button>Filled</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="transparent">Transparent</Button>
              </div>
            </div>
          </div>
        </Section>

        <Section id="components" index="04" title="Components">
          <Tabs defaultValue="rules">
            <TabsList>
              <TabsTrigger value="rules">Rules</TabsTrigger>
              <TabsTrigger value="scope">Scope</TabsTrigger>
            </TabsList>
            <TabsContent value="rules">
              <Accordion className="max-w-[68ch]">
                {RULES.map((rule) => (
                  <AccordionItem key={rule.value} value={rule.value}>
                    <AccordionTrigger>{rule.q}</AccordionTrigger>
                    <AccordionContent>
                      <Text tone="muted">{rule.a}</Text>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
            <TabsContent value="scope">
              <Text tone="muted" className="max-w-[68ch]">
                Buttons, cards, the input family including numeric-with-steppers
                and date and time, typography, links, layout primitives, tabs,
                dialogs, tooltips, accordions, toggles, skeletons, spinners and
                toasts. Selection controls, overlays and data display come next.
              </Text>
            </TabsContent>
          </Tabs>
        </Section>

        <Section id="storybook" index="05" title="Storybook">
          <Text tone="muted" className="max-w-[68ch]">
            Every component is documented there with all its variants and
            states, in both themes, at four breakpoints.
          </Text>
          <p className="mt-4">
            {/* A link that looks like a button stays a link — `buttonVariants`
                exists for exactly this, rather than putting a click handler on
                a Button and losing middle-click, copy-link and Cmd-click. */}
            <Link
              href="http://localhost:6006"
              variant="quiet"
              className={buttonVariants({ variant: "outline" })}
            >
              Open Storybook
            </Link>
          </p>
          <Text size="xs" tone="muted" className="mt-2">
            After <code>pnpm storybook</code>.
          </Text>
        </Section>
      </main>

      <footer className="border-t border-hairline py-8">
        <Text size="2xs" tone="muted" className="label-caps">
          Tab through this page to see the focus treatment
        </Text>
      </footer>
    </Container>
  );
}
