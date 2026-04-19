import * as React from "react";
import { cn } from "@/lib/utils";

// --- Context ---

type AccordionContextValue = {
  type: "single" | "multiple";
  value: string | string[];
  collapsible: boolean;
  onValueChange: (itemValue: string) => void;
};

const AccordionContext = React.createContext<AccordionContextValue | null>(null);

function useAccordion() {
  const ctx = React.useContext(AccordionContext);
  if (!ctx) throw new Error("Accordion primitives must be wrapped in <Accordion>");
  return ctx;
}

type AccordionItemContextValue = { value: string; isOpen: boolean };
const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null);

function useAccordionItem() {
  const ctx = React.useContext(AccordionItemContext);
  if (!ctx) throw new Error("<AccordionTrigger> and <AccordionContent> must be inside <AccordionItem>");
  return ctx;
}

// --- Accordion root ---

type AccordionSingleProps = {
  type: "single";
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  collapsible?: boolean;
};

type AccordionMultipleProps = {
  type: "multiple";
  defaultValue?: string[];
  value?: string[];
  onValueChange?: (value: string[]) => void;
};

type AccordionProps = (AccordionSingleProps | AccordionMultipleProps) & {
  className?: string;
  children?: React.ReactNode;
};

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (props, ref) => {
    const { className, children, type } = props;

    const [internalValue, setInternalValue] = React.useState<string | string[]>(
      type === "multiple"
        ? ((props as AccordionMultipleProps).defaultValue ?? [])
        : ((props as AccordionSingleProps).defaultValue ?? "")
    );

    const controlled = props.value !== undefined;
    const value = controlled ? props.value! : internalValue;
    const collapsible = type === "single" ? ((props as AccordionSingleProps).collapsible ?? false) : true;

    const handleValueChange = (itemValue: string) => {
      if (type === "multiple") {
        const current = value as string[];
        const next = current.includes(itemValue)
          ? current.filter((v) => v !== itemValue)
          : [...current, itemValue];
        if (!controlled) setInternalValue(next);
        (props as AccordionMultipleProps).onValueChange?.(next);
      } else {
        const next = value === itemValue && collapsible ? "" : itemValue;
        if (!controlled) setInternalValue(next);
        (props as AccordionSingleProps).onValueChange?.(next as string);
      }
    };

    return (
      <AccordionContext.Provider value={{ type, value, collapsible, onValueChange: handleValueChange }}>
        <div ref={ref} className={cn("w-full", className)}>
          {children}
        </div>
      </AccordionContext.Provider>
    );
  }
);
Accordion.displayName = "Accordion";

// --- AccordionItem ---

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ className, value, children, ...props }, ref) => {
    const { value: accordionValue } = useAccordion();
    const isOpen = Array.isArray(accordionValue)
      ? accordionValue.includes(value)
      : accordionValue === value;

    return (
      <AccordionItemContext.Provider value={{ value, isOpen }}>
        <div
          ref={ref}
          data-state={isOpen ? "open" : "closed"}
          className={cn("border-b border-border", className)}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    );
  }
);
AccordionItem.displayName = "AccordionItem";

// --- AccordionTrigger ---

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, children, ...props }, ref) => {
  const { onValueChange } = useAccordion();
  const { value, isOpen } = useAccordionItem();

  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={isOpen}
      data-state={isOpen ? "open" : "closed"}
      onClick={() => onValueChange(value)}
      className={cn(
        "flex w-full items-center justify-between py-4 text-sm font-medium text-foreground",
        "transition-colors hover:text-primary",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "disabled:pointer-events-none disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      {/* ChevronDown — inline SVG avoids a lucide-react peer dep */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={cn(
          "shrink-0 transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

// --- AccordionContent ---
// Uses the CSS grid-rows trick for smooth height animation without custom keyframes.

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { isOpen } = useAccordionItem();

  return (
    <div
      ref={ref}
      data-state={isOpen ? "open" : "closed"}
      className={cn(
        "grid transition-all duration-200 ease-in-out",
        isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
      )}
      {...props}
    >
      <div className="overflow-hidden">
        <div className={cn("pb-4 text-sm text-muted-foreground", className)}>
          {children}
        </div>
      </div>
    </div>
  );
});
AccordionContent.displayName = "AccordionContent";

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
export type { AccordionProps, AccordionItemProps };
