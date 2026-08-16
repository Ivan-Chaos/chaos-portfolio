import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FolderOpenIcon } from "lucide-react";
import { expect, within } from "storybook/test";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import { Button } from "./button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./empty";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./pagination";
import { ScrollArea } from "./scroll-area";

const meta = {
  title: "Components/Navigation",
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The current page is a `BreadcrumbPage`, not a link — it carries
 * `aria-current="page"` and is not clickable, because a link to where you
 * already are is a dead end.
 */
export const Breadcrumbs: Story = {
  render: () => (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbEllipsis />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="/work">Work</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Design system</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // The trail is a named landmark so it can be skipped to and skipped past.
    expect(canvas.getByRole("navigation")).toHaveAccessibleName("breadcrumb");
    expect(canvas.getByText("Design system")).toHaveAttribute(
      "aria-current",
      "page",
    );
  },
};

export const Paginations: Story = {
  render: () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#" isActive>
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#">3</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  ),
};

/**
 * An empty state should say what is missing and offer the way out of it. A
 * shrug and the word "Empty" leaves the user with nothing to do.
 */
export const EmptyStates: Story = {
  render: () => (
    <Empty className="max-w-md">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FolderOpenIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>
          Projects you create will appear here.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Create a project</Button>
      </EmptyContent>
    </Empty>
  ),
};

/**
 * A scrollable region needs to be keyboard-reachable, or its content is
 * mouse-only. `tabIndex={0}` plus a name is what makes that work.
 */
export const ScrollAreas: Story = {
  render: () => (
    <ScrollArea
      className="h-48 w-full max-w-sm border border-hairline p-3"
      tabIndex={0}
      role="region"
      aria-label="Orbital elements"
    >
      <ul className="space-y-1.5 text-sm">
        {Array.from({ length: 24 }, (_, i) => (
          <li
            key={i}
            className="flex justify-between border-b border-hairline pb-1.5"
          >
            <span className="text-muted-foreground">Pass {i + 1}</span>
            <span className="tabular-nums">
              {(92.68 + i * 0.01).toFixed(2)} min
            </span>
          </li>
        ))}
      </ul>
    </ScrollArea>
  ),
};

export const BothThemes: Story = {
  parameters: { bothThemes: true },
  render: () => (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Design system</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  ),
};
