import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { PageField } from "@/components/home/page-field";
import { SiteShell } from "@/components/shell/site-shell";
import { ThemeProvider } from "@/components/theme-provider";
import { SkipLink } from "@/components/ui/skip-link";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { profile } from "@/content/profile";
import "./globals.css";

/* JetBrains Mono is the default UI face — see the rules block in globals.css. */
const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

/* Archivo covers both jobs the proportional face has: long-form prose, and the
   oversized condensed section figures. It is variable on `wdth` as well as
   `wght`, so requesting that axis avoids loading Archivo Narrow as a third
   family — `figure-condensed` in globals.css reaches the condensed widths via
   `font-stretch: 62%`. */
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  /* Prose is the only place the proportional face is used, and prose has
     emphasis in it. Without asking for the italic, `<em>` in a dispatch body
     gets a *synthesised oblique* — a sheared roman, which at prose size is
     visibly wrong in a way that is hard to name if you are not looking for it.
     The monospace face never needed this, because chrome has no emphasis. */
  style: ["normal", "italic"],
});

/* Absolute URLs in metadata need a base. The deployment host is not decided
   yet, so it comes from the environment with a local fallback — a wrong
   absolute URL in an Open Graph tag is worse than a local one, because it is
   the version that gets scraped. */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const description =
  "Frontend Lead and architect. Seven years building production web applications in React, Next.js and TypeScript — telehealth, Web3, analytics and marketplaces.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} — ${profile.positioning}`,
    template: `%s — ${profile.name}`,
  },
  description,
  applicationName: profile.name,
  authors: [{ name: profile.name }],
  creator: profile.name,
  /* No `alternates.canonical` and no `openGraph.url` here, deliberately.
     Metadata is inherited by every descendant segment, so a canonical declared
     on the root layout would make `/news` and every dispatch claim to be `/` —
     and the canonical is the version that gets scraped. A canonical is a
     per-route fact and a layout is not a route, so each page declares its own.
     `openGraph.type` moves to `app/page.tsx` for the same reason: only the home
     page is a profile. What is left here is genuinely site-wide. */
  openGraph: {
    siteName: profile.name,
    title: `${profile.name} — ${profile.positioning}`,
    description,
    locale: "en_GB",
  },
  twitter: {
    card: "summary",
    title: `${profile.name} — ${profile.positioning}`,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      /* next-themes writes class="dark" onto <html> before hydration, so React
         will otherwise flag the mismatch. This only suppresses one level deep. */
      suppressHydrationWarning
      /* Next 16 stopped overriding a global smooth scroll-behavior on
         navigation; this attribute is what opts back in. globals.css scopes the
         rule to it and guards it behind prefers-reduced-motion. */
      data-scroll-behavior="smooth"
      className={`${jetBrainsMono.variable} ${archivo.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* First thing in the tab order. Its target is the `<main id="main">`
              a page renders — see components/ui/skip-link.tsx for why that
              element also needs `tabIndex={-1}`. */}
          <SkipLink />
          {/* Before the content in document order, which is how it stays
              behind everything without a negative z-index — and therefore
              without a stacking context for Base UI's overlays to fight. */}
          <PageField />
          {/* The header, `<main id="main">` and the footer, for every route.
              See components/shell/site-shell.tsx and docs/adr/0007. */}
          <TooltipProvider>
            <SiteShell>{children}</SiteShell>
          </TooltipProvider>
          {/* Inside ThemeProvider on purpose: the Toaster reads `useTheme()` to
              follow the active theme, and outside it that silently stops. */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
