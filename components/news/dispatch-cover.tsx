import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import type { DispatchCover as Cover } from "@/content/schema";
import { cn } from "@/lib/utils";

/**
 * A dispatch's cover, at two sizes: full-column on the article page and a
 * thumbnail in an index row.
 *
 * One component rather than two because the treatment is identical — 16:9,
 * `object-cover`, a hairline border, no radius and no shadow. Only the measure
 * and the preload decision differ, and both are the caller's to make.
 *
 * `preload` — **not** the deprecated `priority`, which Next 16 renamed — is for
 * the article page, where the cover is the LCP candidate. A row thumbnail must
 * never set it: preloading a below-the-fold image spends the budget on the
 * wrong one.
 *
 * There is no placeholder for a dispatch without a cover: the caller renders
 * nothing at all. A grey box or a gradient would both be inventing a visual
 * language this direction does not have.
 */
function DispatchCover({
  cover,
  sizes,
  preload = false,
  className,
}: {
  cover: Cover;
  /** The rendered width, for the srcset. Required — a wrong `sizes` is worse than none. */
  sizes: string;
  preload?: boolean;
  className?: string;
}) {
  return (
    <AspectRatio
      data-slot="dispatch-cover"
      ratio={16 / 9}
      className={cn("border border-hairline bg-surface-sunken", className)}
    >
      <Image
        src={cover.src}
        alt={cover.alt}
        fill
        sizes={sizes}
        preload={preload}
        className="object-cover"
      />
    </AspectRatio>
  );
}

export { DispatchCover };
