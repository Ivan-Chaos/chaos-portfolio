"use client";

import {
  CircleAlertIcon,
  CircleCheckIcon,
  InfoIcon,
  LoaderCircleIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

/**
 * Mount once, inside the `ThemeProvider` — this is a client component that
 * reads `useTheme()`, so outside the provider it silently stops following the
 * theme.
 *
 * Sonner is styled through CSS custom properties rather than classes, which is
 * why the palette is wired via `style` here. The status colours use the `-text`
 * tokens, not the fills: a toast border and icon are small marks on the popover
 * surface, and the fill tokens fail contrast at that size in light mode.
 *
 * See docs/adr/0006-sonner-for-toasts.md for why this and not Base UI's Toast.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4" strokeWidth={1.75} />,
        info: <InfoIcon className="size-4" strokeWidth={1.75} />,
        warning: <TriangleAlertIcon className="size-4" strokeWidth={1.75} />,
        error: <CircleAlertIcon className="size-4" strokeWidth={1.75} />,
        loading: (
          <LoaderCircleIcon
            className="size-4 animate-spin"
            strokeWidth={1.75}
          />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--control)",
          "--success-bg": "var(--popover)",
          "--success-text": "var(--success-text)",
          "--success-border": "var(--success)",
          "--error-bg": "var(--popover)",
          "--error-text": "var(--danger-text)",
          "--error-border": "var(--danger)",
          "--warning-bg": "var(--popover)",
          "--warning-text": "var(--signal-text)",
          "--warning-border": "var(--signal-edge)",
          "--info-bg": "var(--popover)",
          "--info-text": "var(--popover-foreground)",
          "--info-border": "var(--control)",
          "--border-radius": "0",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast font-mono",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
