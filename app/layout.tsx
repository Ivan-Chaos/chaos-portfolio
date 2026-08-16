import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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

export const metadata: Metadata = {
  title: "Ivan Chaus",
  description: "Portfolio of Ivan Chaus.",
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
          <TooltipProvider>{children}</TooltipProvider>
          {/* Inside ThemeProvider on purpose: the Toaster reads `useTheme()` to
              follow the active theme, and outside it that silently stops. */}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
