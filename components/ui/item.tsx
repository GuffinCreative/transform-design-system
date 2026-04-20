import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// ─── Item ─────────────────────────────────────────────────────────────────────

const itemVariants = cva(
  "flex gap-4 items-start overflow-hidden rounded-md",
  {
    variants: {
      variant: {
        default: "",
        outline: "border border-border",
        muted: "bg-muted/50",
      },
      size: {
        default: "p-4",
        sm: "p-3",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof itemVariants> {}

const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, variant, size, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(itemVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Item.displayName = "Item";

// ─── ItemMedia ────────────────────────────────────────────────────────────────
// Left slot — wraps an icon, image, or avatar.

const ItemMedia = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex shrink-0 items-center justify-center size-8 rounded-sm",
      "bg-muted border border-border",
      "[&_svg]:size-4 [&_svg]:shrink-0",
      className
    )}
    {...props}
  />
));
ItemMedia.displayName = "ItemMedia";

// ─── ItemContent ──────────────────────────────────────────────────────────────

const ItemContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-1 flex-col gap-1 items-start justify-center min-w-0",
      className
    )}
    {...props}
  />
));
ItemContent.displayName = "ItemContent";

// ─── ItemTitle ────────────────────────────────────────────────────────────────

const ItemTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "font-sans text-sm font-medium leading-4 text-foreground w-full",
      className
    )}
    {...props}
  />
));
ItemTitle.displayName = "ItemTitle";

// ─── ItemDescription ─────────────────────────────────────────────────────────

const ItemDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "font-sans text-sm text-muted-foreground leading-5 truncate w-full",
      className
    )}
    {...props}
  />
));
ItemDescription.displayName = "ItemDescription";

// ─── ItemActions ──────────────────────────────────────────────────────────────
// Right slot — buttons, icons, badges, etc.

const ItemActions = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex items-center justify-end gap-2 self-stretch shrink-0",
      className
    )}
    {...props}
  />
));
ItemActions.displayName = "ItemActions";

// ─── ItemGroup ────────────────────────────────────────────────────────────────
// Stacks Items with dividers between them.

const ItemGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col divide-y divide-border", className)}
    {...props}
  />
));
ItemGroup.displayName = "ItemGroup";

export {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
};
