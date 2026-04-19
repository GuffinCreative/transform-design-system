import * as React from "react";
import { ChevronRight, MoreHorizontal, ChevronDown } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

// ─── Root ───────────────────────────────────────────────────────────────────

const Breadcrumb = React.forwardRef<
  HTMLElement,
  React.ComponentPropsWithoutRef<"nav"> & { separator?: React.ReactNode }
>(({ ...props }, ref) => <nav ref={ref} aria-label="breadcrumb" {...props} />);
Breadcrumb.displayName = "Breadcrumb";

// ─── List ────────────────────────────────────────────────────────────────────

const BreadcrumbList = React.forwardRef<
  HTMLOListElement,
  React.ComponentPropsWithoutRef<"ol"> & { size?: "sm" | "md" }
>(({ className, size = "md", ...props }, ref) => (
  <ol
    ref={ref}
    className={cn(
      "flex flex-wrap items-center font-sans text-sm font-normal",
      size === "sm" ? "gap-1.5" : "gap-2.5",
      className
    )}
    {...props}
  />
));
BreadcrumbList.displayName = "BreadcrumbList";

// ─── Item ─────────────────────────────────────────────────────────────────────

const BreadcrumbItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentPropsWithoutRef<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    className={cn("inline-flex items-center gap-1", className)}
    {...props}
  />
));
BreadcrumbItem.displayName = "BreadcrumbItem";

// ─── Link ─────────────────────────────────────────────────────────────────────
// Navigable breadcrumb segment — muted brand-alt, darkens on hover/focus.

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & { asChild?: boolean }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot : "a";
  return (
    <Comp
      ref={ref}
      className={cn(
        "text-brand-alt transition-colors",
        "hover:text-brand-darkGreen",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-outline/50 focus-visible:rounded-sm",
        className
      )}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

// ─── Page (current) ──────────────────────────────────────────────────────────
// Non-navigable final segment — full dark green, not a link.

const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="link"
    aria-disabled="true"
    aria-current="page"
    className={cn(
      "font-medium text-brand-darkGreen",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-outline/50 focus-visible:rounded-sm",
      className
    )}
    {...props}
  />
));
BreadcrumbPage.displayName = "BreadcrumbPage";

// ─── Separator ───────────────────────────────────────────────────────────────

const BreadcrumbSeparator = ({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn("text-brand-alt [&>svg]:size-[15px]", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

// ─── Dropdown trigger ────────────────────────────────────────────────────────
// A link-style item with a ChevronDown — wires up to your own dropdown/popover.

const BreadcrumbDropdown = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button">
>(({ className, children, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "inline-flex items-center gap-1 text-sm text-brand-alt transition-colors",
      "hover:text-brand-darkGreen",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-outline/50 focus-visible:rounded-sm",
      "overflow-hidden rounded-xs",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="size-[15px] shrink-0" />
  </button>
));
BreadcrumbDropdown.displayName = "BreadcrumbDropdown";

// ─── Ellipsis ─────────────────────────────────────────────────────────────────
// Collapsed middle segments — renders a ··· icon button (36×36 tap target).

const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.ComponentProps<"span">) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn(
      "flex size-9 items-center justify-center",
      "text-brand-alt transition-colors",
      "hover:text-brand-darkGreen hover:bg-brand-light rounded-sm",
      "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brand-outline/50",
      className
    )}
    {...props}
  >
    <MoreHorizontal className="size-4" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbDropdown,
  BreadcrumbEllipsis,
};
