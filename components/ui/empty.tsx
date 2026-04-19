import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Empty ────────────────────────────────────────────────────────────────────

const Empty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center gap-6 text-center", className)}
    {...props}
  />
));
Empty.displayName = "Empty";

// ─── EmptyHeader ──────────────────────────────────────────────────────────────

const EmptyHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center gap-4 w-full", className)}
    {...props}
  />
));
EmptyHeader.displayName = "EmptyHeader";

// ─── EmptyMedia ───────────────────────────────────────────────────────────────
// Wraps an icon, avatar, or avatar-group in the muted icon container.

const EmptyMedia = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex size-10 items-center justify-center rounded-lg bg-muted shrink-0",
      className
    )}
    {...props}
  />
));
EmptyMedia.displayName = "EmptyMedia";

// ─── EmptyTitle ───────────────────────────────────────────────────────────────

const EmptyTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "font-sans text-lg font-medium leading-7 text-foreground w-full",
      className
    )}
    {...props}
  />
));
EmptyTitle.displayName = "EmptyTitle";

// ─── EmptyDescription ─────────────────────────────────────────────────────────

const EmptyDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "font-sans text-sm text-muted-foreground leading-relaxed w-full",
      className
    )}
    {...props}
  />
));
EmptyDescription.displayName = "EmptyDescription";

// ─── EmptyContent ─────────────────────────────────────────────────────────────
// Action area: buttons, input+description, etc.

const EmptyContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col items-center gap-4 w-full", className)}
    {...props}
  />
));
EmptyContent.displayName = "EmptyContent";

export {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
};
