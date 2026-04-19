import * as React from "react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./button";

// ─── Types ───────────────────────────────────────────────────────────────────

type GroupVariant = "default" | "secondary" | "forest" | "green" | "outline";
type GroupOrientation = "horizontal" | "vertical";
type GroupSize = "sm" | "default" | "lg";

// ─── Context ─────────────────────────────────────────────────────────────────

interface ButtonGroupContextValue {
  variant: GroupVariant;
  orientation: GroupOrientation;
  size: GroupSize;
}

const ButtonGroupContext = React.createContext<ButtonGroupContextValue>({
  variant: "default",
  orientation: "horizontal",
  size: "default",
});

// ─── ButtonGroup ─────────────────────────────────────────────────────────────

export interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GroupVariant;
  orientation?: GroupOrientation;
  size?: GroupSize;
}

// Variants that use a solid fill — separator is a translucent line overlay.
// Outline uses border-collapse instead.
const FILLED: GroupVariant[] = ["default", "secondary", "forest", "green"];

const ButtonGroup = React.forwardRef<HTMLDivElement, ButtonGroupProps>(
  (
    {
      className,
      variant = "default",
      orientation = "horizontal",
      size = "default",
      ...props
    },
    ref
  ) => {
    const isFilled = FILLED.includes(variant);
    const isH = orientation === "horizontal";

    // Divider colour: white overlay on dark fills; dark overlay on light fills.
    const dividerColor =
      variant === "secondary"
        ? "divide-brand-darkGreen/10"
        : variant === "green"
        ? "divide-white/15"
        : "divide-white/20"; // default, forest

    return (
      <ButtonGroupContext.Provider value={{ variant, orientation, size }}>
        <div
          ref={ref}
          role="group"
          className={cn(
            "inline-flex items-stretch",
            isH ? "flex-row" : "flex-col",

            // ── Filled: container clips corners; dividers act as separators ──
            isFilled && [
              "rounded-md overflow-hidden",
              isH ? `divide-x ${dividerColor}` : `divide-y ${dividerColor}`,
            ],

            // ── Outline: border-collapse; corners applied to first/last item ──
            !isFilled && [
              isH
                ? [
                    // First child: full border + left rounded corners
                    "[&>*:first-child]:rounded-l-md [&>*:first-child]:rounded-r-none",
                    // Last child: right rounded corners
                    "[&>*:last-child]:rounded-r-md [&>*:last-child]:rounded-l-none",
                    // Middle children: no rounding, collapse left border
                    "[&>*:not(:first-child):not(:last-child)]:rounded-none",
                    "[&>*:not(:first-child)]:-ml-px",
                    // Raise on hover/focus so the full border shows
                    "[&>*:hover]:z-10 [&>*:focus-visible]:z-10",
                  ]
                : [
                    // Vertical
                    "[&>*:first-child]:rounded-t-md [&>*:first-child]:rounded-b-none",
                    "[&>*:last-child]:rounded-b-md [&>*:last-child]:rounded-t-none",
                    "[&>*:not(:first-child):not(:last-child)]:rounded-none",
                    "[&>*:not(:first-child)]:-mt-px",
                    "[&>*:hover]:z-10 [&>*:focus-visible]:z-10",
                  ],
            ],

            className
          )}
          {...props}
        />
      </ButtonGroupContext.Provider>
    );
  }
);
ButtonGroup.displayName = "ButtonGroup";

// ─── ButtonGroupItem ──────────────────────────────────────────────────────────
// Reads variant + size from context; always renders with rounded-none so the
// container's overflow-hidden (filled) or the sibling selectors (outline)
// control the visible corners.

export interface ButtonGroupItemProps
  extends Omit<ButtonProps, "variant" | "size"> {
  /** Override the group variant for a single item (e.g. an active/selected state). */
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
}

const ButtonGroupItem = React.forwardRef<HTMLButtonElement, ButtonGroupItemProps>(
  ({ className, variant, size, ...props }, ref) => {
    const ctx = React.useContext(ButtonGroupContext);

    return (
      <Button
        ref={ref}
        variant={variant ?? ctx.variant}
        size={size ?? ctx.size}
        className={cn(
          "rounded-none relative shrink-0",
          // For outline, make full-width in vertical mode
          ctx.orientation === "vertical" && "w-full justify-center",
          className
        )}
        {...props}
      />
    );
  }
);
ButtonGroupItem.displayName = "ButtonGroupItem";

export { ButtonGroup, ButtonGroupItem, ButtonGroupContext };
