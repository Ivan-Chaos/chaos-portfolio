import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
  {
    variants: {
      // Marked by a 2px rule on the leading edge rather than a tinted fill.
      // A washed background would put the status text on an unpredictable
      // ground, which is exactly what the `-text` tokens were solved against;
      // an edge keeps the surface — and therefore the contrast — constant.
      //
      // The icon takes the status colour, the description stays muted. Colour
      // is never the only signal: every variant expects an icon, and the copy
      // says what happened.
      variant: {
        default: "border-s-2 border-s-control bg-card text-card-foreground",
        info: "border-s-2 border-s-control bg-card text-card-foreground",
        signal:
          "border-s-2 border-s-signal-edge bg-card text-card-foreground *:[svg]:text-signal-text",
        destructive:
          "border-s-2 border-s-danger bg-card text-card-foreground *:[svg]:text-danger-text",
        danger:
          "border-s-2 border-s-danger bg-card text-card-foreground *:[svg]:text-danger-text",
        success:
          "border-s-2 border-s-success bg-card text-card-foreground *:[svg]:text-success-text",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className,
      )}
      {...props}
    />
  );
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-2 right-2", className)}
      {...props}
    />
  );
}

export { Alert, AlertTitle, AlertDescription, AlertAction };
