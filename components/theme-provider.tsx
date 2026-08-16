"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import type * as React from "react";

/**
 * Thin client wrapper around next-themes.
 *
 * The indirection is load-bearing: `app/layout.tsx` is a Server Component, and
 * next-themes' provider uses hooks, so it needs a `"use client"` boundary of
 * its own rather than being imported directly.
 *
 * Dark mode here is class-based (`@custom-variant dark (&:is(.dark *))` in
 * globals.css), which is why the caller passes `attribute="class"`.
 */
export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
