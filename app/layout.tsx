import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { PageField } from "@/components/home/page-field";
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
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    siteName: profile.name,
    title: `${profile.name} — ${profile.positioning}`,
    description,
    url: "/",
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
          <TooltipProvider>{children}</TooltipProvider>
          {/* Inside ThemeProvider on purpose: the Toaster reads `useTheme()` to
              follow the active theme, and outside it that silently stops. */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
