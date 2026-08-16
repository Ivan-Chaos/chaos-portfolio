"use client";

import { SearchIcon, XIcon } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { controlSurface } from "@/components/ui/input";

/**
 * Search input with a clear control.
 *
 * Works both controlled and uncontrolled. When uncontrolled it tracks the value
 * internally purely to decide whether the clear button should exist — a clear
 * button on an empty field is a dead target.
 *
 * Clearing returns focus to the input. Without that, focus lands on a button
 * that just removed itself from the DOM and a keyboard user is dropped back to
 * the top of the document.
 *
 * `type="search"` gives the browser and assistive tech the right role; the
 * native clear affordance is suppressed in the stylesheet below so there is only
 * one, and it is the one that matches the rest of the kit.
 */
function SearchInput({
  className,
  value,
  defaultValue,
  onChange,
  ...props
}: Omit<React.ComponentProps<"input">, "type">) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [internal, setInternal] = React.useState(defaultValue ?? "");

  const isControlled = value !== undefined;
  const current = isControlled ? value : internal;
  const hasValue = String(current ?? "").length > 0;

  function clear() {
    if (!isControlled) setInternal("");
    const input = inputRef.current;
    if (input) {
      // Set through the native setter so React's onChange actually fires —
      // assigning `input.value` directly does not notify React.
      const setter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value",
      )?.set;
      setter?.call(input, "");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.focus();
    }
  }

  return (
    <div
      data-slot="search-input"
      className={cn(
        controlSurface,
        "flex h-8 items-center",
        "has-[input:focus-visible]:outline has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-ring",
        className,
      )}
    >
      <SearchIcon
        aria-hidden="true"
        strokeWidth={1.75}
        className="ms-2.5 size-4 shrink-0 text-muted-foreground"
      />
      <input
        ref={inputRef}
        type="search"
        data-slot="search-input-control"
        value={isControlled ? value : internal}
        onChange={(event) => {
          if (!isControlled) setInternal(event.target.value);
          onChange?.(event);
        }}
        className="h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm placeholder:text-muted-foreground focus-visible:outline-none [&::-webkit-search-cancel-button]:appearance-none"
        {...props}
      />
      {hasValue ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={clear}
          className="flex h-full w-8 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-offset-[-2px]"
        >
          <XIcon aria-hidden="true" strokeWidth={1.75} className="size-4" />
        </button>
      ) : null}
    </div>
  );
}

export { SearchInput };
