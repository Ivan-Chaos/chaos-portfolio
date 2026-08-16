"use client";

import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn(
        "group/tabs flex gap-3 data-horizontal:flex-col",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Two variants, and `line` is the default here rather than `default`.
 *
 * The upstream default puts each tab in a raised rounded pill inside a grey
 * track — an elevation idiom this system does not have, and with `--radius: 0`
 * it degrades into grey rectangles that read as disabled buttons. A signal
 * underline is the honest Industrial equivalent: it marks the active tab
 * without pretending anything is raised.
 *
 * `enclosed` keeps the tracked form for the cases that genuinely need a
 * container, but built from a hairline rather than a fill.
 */
const tabsListVariants = cva(
  "group/tabs-list inline-flex w-fit items-center justify-center text-muted-foreground group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col",
  {
    variants: {
      variant: {
        line: "gap-4 border-hairline group-data-horizontal/tabs:border-b group-data-vertical/tabs:border-e",
        enclosed: "gap-px border border-control p-px",
      },
    },
    defaultVariants: {
      variant: "line",
    },
  },
);

function TabsList({
  className,
  variant = "line",
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex items-center justify-center gap-1.5 border border-transparent text-sm font-medium whitespace-nowrap transition-colors group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        // The focus outline is inset here: a 2px offset would escape the
        // tablist and collide with the neighbouring tab.
        "focus-visible:outline-offset-[-2px]",
        // line — a signal rule on the active edge.
        "group-data-[variant=line]/tabs-list:h-8 group-data-[variant=line]/tabs-list:px-1 group-data-[variant=line]/tabs-list:data-active:text-foreground",
        "after:absolute after:bg-signal after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:-bottom-px group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-end-px group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
        // enclosed — the active tab takes the signal fill.
        "group-data-[variant=enclosed]/tabs-list:h-7 group-data-[variant=enclosed]/tabs-list:px-3 group-data-[variant=enclosed]/tabs-list:data-active:bg-signal group-data-[variant=enclosed]/tabs-list:data-active:text-signal-foreground group-data-[variant=enclosed]/tabs-list:data-active:after:opacity-0",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      // The panel is focusable so keyboard users land somewhere after the tab
      // list; `outline-offset` keeps that indicator off the content edge.
      className={cn("flex-1 text-sm focus-visible:outline-offset-4", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
