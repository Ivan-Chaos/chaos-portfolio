"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "system", label: "System", Icon: Monitor },
  { value: "dark", label: "Dark", Icon: Moon },
] as const;

const noopSubscribe = () => () => {};

/**
 * False during SSR and the hydration render, true afterwards.
 *
 * `useSyncExternalStore` with differing server/client snapshots is the
 * hydration-safe way to express this — a `useState` + `useEffect` pair does the
 * same job but sets state synchronously inside an effect, which the React
 * Compiler lint correctly rejects.
 */
function useHydrated() {
  return React.useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/**
 * Three-state theme control: light / system / dark.
 *
 * Three states rather than a two-way switch because the app defaults to
 * `system` — a binary toggle gives you no way back to "follow the OS" once
 * you've touched it.
 *
 * Rendered as a segmented control: square, hairline-bordered, with the active
 * segment taking the amber signal fill. `aria-pressed` on three buttons rather
 * than a radiogroup keeps Tab behaviour predictable without hand-rolling
 * arrow-key navigation; it moves onto ToggleGroup once that primitive lands.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  // `theme` is undefined during SSR and on the hydration render. Gating the
  // active state on hydration keeps both passes identical, so there is no
  // mismatch and no layout shift — the markup never changes shape, only which
  // segment reads as pressed.
  const hydrated = useHydrated();

  return (
    <div
      role="group"
      aria-label="Theme"
      className={cn("inline-flex border border-control", className)}
    >
      {OPTIONS.map(({ value, label, Icon }, i) => {
        const active = hydrated && theme === value;
        return (
          <button
            key={value}
            type="button"
            aria-pressed={active}
            title={label}
            onClick={() => setTheme(value)}
            className={cn(
              "inline-flex size-8 items-center justify-center transition-colors",
              i > 0 && "border-l border-control",
              active
                ? "bg-signal text-signal-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            <Icon aria-hidden="true" className="size-4" strokeWidth={1.75} />
            <span className="sr-only">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
