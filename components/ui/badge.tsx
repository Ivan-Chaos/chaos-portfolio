import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-danger [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/85",
        secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-accent",
        signal: "bg-signal text-signal-foreground [a]:hover:bg-signal-hover",
        // Status badges are marked by an edge and coloured text, not a washed
        // fill. A 10%-opacity tint is a soft surface, and it also puts the
        // status text on an unpredictable background — the exact situation the
        // `-text` tokens were solved against.
        danger: "border-danger text-danger-text [a]:hover:bg-accent",
        destructive: "border-danger text-danger-text [a]:hover:bg-accent",
        success: "border-success text-success-text [a]:hover:bg-accent",
        outline: "border-control text-foreground [a]:hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-foreground underline decoration-control underline-offset-4 hover:text-signal-text",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props,
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  });
}

export { Badge, badgeVariants };
