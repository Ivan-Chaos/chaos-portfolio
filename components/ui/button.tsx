import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

/**
 * Treatments, in the project's vocabulary:
 *
 *   filled       ink fill — the ordinary primary action
 *   signal       amber fill — the single most important action on a view.
 *                Spending it on every button spends it on nothing, which is
 *                why `filled` is ink and not amber.
 *   outline      1px control border over the ground
 *   transparent  no border, no fill until hover
 *   underline    reads as a link; sits inside a line of text
 *   danger       destructive actions only
 *
 * `default`, `secondary`, `ghost`, `link` and `destructive` are kept as
 * aliases: vendored shadcn components reference them by name (calendar calls
 * `buttonVariants({ variant: "ghost" })`, and pagination will too). Prefer the
 * names above in new code.
 *
 * Focus is deliberately not handled here. `:focus-visible` in globals.css gives
 * the whole kit one hard 2px outline; a per-component ring would be a second,
 * softer treatment competing with it. That is also why `outline-none` — which
 * the upstream file sets — is gone.
 *
 * Radius classes are gone too. `--radius: 0` made them inert, and leaving them
 * in implies a roundness the system does not have.
 */
const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center border border-transparent text-sm font-medium whitespace-nowrap transition-colors select-none active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-danger [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        filled: "bg-primary text-primary-foreground hover:bg-primary/85",
        default: "bg-primary text-primary-foreground hover:bg-primary/85",

        signal: "bg-signal text-signal-foreground hover:bg-signal-hover",

        outline:
          "border-control bg-transparent hover:border-control-hover hover:bg-accent aria-expanded:bg-accent",
        secondary:
          "border-control bg-transparent hover:border-control-hover hover:bg-accent aria-expanded:bg-accent",

        transparent:
          "hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent",
        ghost:
          "hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent",

        underline:
          "text-foreground underline decoration-control underline-offset-4 hover:text-signal-text hover:decoration-current",
        link: "text-foreground underline decoration-control underline-offset-4 hover:text-signal-text hover:decoration-current",

        danger: "bg-danger text-danger-foreground hover:bg-danger/85",
        destructive: "bg-danger text-danger-foreground hover:bg-danger/85",
      },
      size: {
        default:
          "h-8 gap-2 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        xs: "h-6 gap-1 px-2 text-2xs [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1.5 px-2.5 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-2 px-4",
        icon: "size-8",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7 [&_svg:not([class*='size-'])]:size-3.5",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "filled",
      size: "default",
    },
  },
);

/**
 * `loading` swaps in a spinner and blocks interaction. It keeps the label
 * mounted rather than replacing it, so the button does not change width
 * mid-action — a button that resizes as you click it is a hit-target bug.
 */
function Button({
  className,
  variant,
  size,
  loading = false,
  disabled,
  children,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & { loading?: boolean }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      data-loading={loading || undefined}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {/* `display: contents` keeps the label in layout (so the width holds)
          while `visibility: hidden` inherits down to hide it. */}
      <span className={cn("contents", loading && "invisible")}>{children}</span>
      {loading ? <Spinner className="absolute" /> : null}
    </ButtonPrimitive>
  );
}

export { Button, buttonVariants };
