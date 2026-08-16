"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { controlSurface } from "@/components/ui/input";

/**
 * Password input with a reveal toggle.
 *
 * Three details that are easy to miss and all matter:
 *
 * The toggle is a real `<button type="button">`. Inside a form, a bare
 * `<button>` defaults to `type="submit"`, so revealing the password would
 * submit the form.
 *
 * `aria-pressed` plus a label that stays constant ("Show password") describes a
 * toggle honestly. Swapping the label to "Hide password" when pressed is the
 * common alternative and it makes screen readers announce a state change as if
 * it were a different control.
 *
 * `autoComplete` is left to the caller: `current-password` and `new-password`
 * mean different things to a password manager, and guessing wrong makes it offer
 * to save the wrong thing.
 */
function PasswordInput({
  className,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  const [revealed, setRevealed] = React.useState(false);

  return (
    <div
      data-slot="password-input"
      className={cn(
        controlSurface,
        "flex h-8 items-center",
        "has-[input:focus-visible]:outline has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-ring",
        className,
      )}
    >
      <input
        type={revealed ? "text" : "password"}
        data-slot="password-input-control"
        className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none"
        {...props}
      />
      <button
        type="button"
        aria-pressed={revealed}
        aria-label="Show password"
        onClick={() => setRevealed((v) => !v)}
        className="flex h-full w-8 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-offset-[-2px]"
      >
        {revealed ? (
          <EyeOffIcon
            aria-hidden="true"
            strokeWidth={1.75}
            className="size-4"
          />
        ) : (
          <EyeIcon aria-hidden="true" strokeWidth={1.75} className="size-4" />
        )}
      </button>
    </div>
  );
}

export { PasswordInput };
