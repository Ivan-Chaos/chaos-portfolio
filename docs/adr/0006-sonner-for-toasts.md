# Sonner for toasts, not Base UI's Toast

Toasts come from **sonner**, via `pnpm dlx shadcn@latest add sonner`. Recorded because under a Base UI
base there are now _two_ first-class toast paths and picking the non-native one looks like an
oversight.

`@base-ui/react` ships its own `Toast` primitive, and shadcn's Base registry vendors a wrapper for it
(`add toast`) alongside the sonner wrapper (`add sonner`). They are not interchangeable: Base UI's is
`toast.add({ title, description })` with built-in `success` / `info` / `warning` / `error` / `loading`
statuses, while sonner's is `toast("…")` with `toast.success()` and friends. Choosing one is choosing
a call-site API across every future feature, which is what makes it worth writing down.

Sonner was chosen because it was specified for this project, and because its stacking, swipe-dismiss
and promise handling are more polished out of the box than a primitive that has to be assembled.

Worth noting this is _not_ the deprecated shadcn Radix toast that sonner historically replaced — Base
UI's `Toast` is a fresh component, so "shadcn deprecated the toast in favour of sonner" is stale
advice that does not apply to the choice being made here.

## Consequences

`sonner` is a runtime dependency and needs a single `<Toaster />` mounted once, inside the
`ThemeProvider` — the shadcn wrapper is a client component that calls `useTheme()` to follow the
active theme, so mounting it outside the provider silently breaks theme-following.

Its visual tokens come from CSS custom properties the wrapper maps to `--popover`,
`--popover-foreground` and `--radius`, so it inherits the Industrial palette and square corners
without extra work. What it does _not_ inherit is the corner-tick treatment or the hairline border
convention, so the vendored wrapper needs editing to match — sonner's own default is a rounded card
with a shadow, and `--radius: 0` plus the neutralised shadow scale only get part of the way there.

Base UI's `Toast` stays unused. If it is ever preferred, the migration is mechanical but touches every
call site.
