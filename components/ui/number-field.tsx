"use client";

import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field";
import { MinusIcon, PlusIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Numeric input with increment and decrement controls.
 *
 * Built on Base UI's NumberField rather than `<input type="number">`, which is
 * worth the extra component: the native control silently accepts non-numeric
 * text in some browsers, scrolls the value when the wheel passes over a focused
 * field, and gives no control over the spinner's appearance. Base UI also brings
 * locale-aware formatting and clamping.
 *
 * The steppers are `tabIndex={-1}` deliberately. They duplicate what the arrow
 * keys already do on the focused input, so putting them in the tab order makes
 * every numeric field cost three tab stops instead of one. They stay fully
 * usable by pointer and are still announced.
 */
function NumberField({ className, ...props }: NumberFieldPrimitive.Root.Props) {
  return (
    <NumberFieldPrimitive.Root
      data-slot="number-field"
      className={cn("w-full", className)}
      {...props}
    />
  );
}

const stepperClasses =
  "flex h-full w-8 shrink-0 items-center justify-center text-muted-foreground transition-colors select-none hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-offset-[-2px]";

function NumberFieldGroup({
  className,
  ...props
}: NumberFieldPrimitive.Group.Props) {
  return (
    <NumberFieldPrimitive.Group
      data-slot="number-field-group"
      className={cn(
        "flex h-8 w-full items-center border border-control bg-surface-sunken transition-colors",
        // Focus lands on the inner input; the whole group takes the indicator so
        // the control reads as one thing.
        "has-[input:focus-visible]:outline has-[input:focus-visible]:outline-2 has-[input:focus-visible]:outline-offset-2 has-[input:focus-visible]:outline-ring",
        "has-disabled:opacity-50 has-[input[aria-invalid=true]]:border-danger",
        className,
      )}
      {...props}
    />
  );
}

function NumberFieldDecrement({
  className,
  ...props
}: NumberFieldPrimitive.Decrement.Props) {
  return (
    <NumberFieldPrimitive.Decrement
      data-slot="number-field-decrement"
      tabIndex={-1}
      aria-label="Decrease"
      className={cn(stepperClasses, "border-e border-control", className)}
      {...props}
    >
      <MinusIcon aria-hidden="true" strokeWidth={1.75} className="size-3.5" />
    </NumberFieldPrimitive.Decrement>
  );
}

function NumberFieldIncrement({
  className,
  ...props
}: NumberFieldPrimitive.Increment.Props) {
  return (
    <NumberFieldPrimitive.Increment
      data-slot="number-field-increment"
      tabIndex={-1}
      aria-label="Increase"
      className={cn(stepperClasses, "border-s border-control", className)}
      {...props}
    >
      <PlusIcon aria-hidden="true" strokeWidth={1.75} className="size-3.5" />
    </NumberFieldPrimitive.Increment>
  );
}

function NumberFieldInput({
  className,
  ...props
}: NumberFieldPrimitive.Input.Props) {
  return (
    <NumberFieldPrimitive.Input
      data-slot="number-field-input"
      className={cn(
        "h-full min-w-0 flex-1 bg-transparent px-2.5 text-center text-sm tabular-nums placeholder:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Drag-to-change affordance. Optional and off by default — it is invisible to
 * keyboard and screen-reader users, so it can only ever be an accelerator on top
 * of controls that already work.
 */
function NumberFieldScrubArea({
  className,
  ...props
}: NumberFieldPrimitive.ScrubArea.Props) {
  return (
    <NumberFieldPrimitive.ScrubArea
      data-slot="number-field-scrub-area"
      className={cn("cursor-ew-resize select-none", className)}
      {...props}
    />
  );
}

export {
  NumberField,
  NumberFieldGroup,
  NumberFieldInput,
  NumberFieldIncrement,
  NumberFieldDecrement,
  NumberFieldScrubArea,
};
