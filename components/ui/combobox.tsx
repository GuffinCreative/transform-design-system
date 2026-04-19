import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Context ──────────────────────────────────────────────────────────────────

interface ComboboxContextValue {
  value?: string;
  onValueChange?: (value: string) => void;
  search: string;
  setSearch: (s: string) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
}

const ComboboxContext = React.createContext<ComboboxContextValue>({
  search: "",
  setSearch: () => {},
  open: false,
  setOpen: () => {},
});

function useCombobox() {
  return React.useContext(ComboboxContext);
}

// ─── ComboboxRoot ─────────────────────────────────────────────────────────────

export interface ComboboxRootProps {
  value?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

function ComboboxRoot({
  value,
  onValueChange,
  open: controlledOpen,
  onOpenChange,
  children,
}: ComboboxRootProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");

  const open = controlledOpen ?? internalOpen;
  const setOpen = React.useCallback(
    (o: boolean) => {
      setInternalOpen(o);
      onOpenChange?.(o);
      if (!o) setSearch("");
    },
    [onOpenChange]
  );

  return (
    <ComboboxContext.Provider
      value={{ value, onValueChange, search, setSearch, open, setOpen }}
    >
      <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
        {children}
      </PopoverPrimitive.Root>
    </ComboboxContext.Provider>
  );
}
ComboboxRoot.displayName = "ComboboxRoot";

// ─── ComboboxTrigger ──────────────────────────────────────────────────────────

export interface ComboboxTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  placeholder?: string;
}

const ComboboxTrigger = React.forwardRef<
  HTMLButtonElement,
  ComboboxTriggerProps
>(({ className, placeholder = "Select…", children, ...props }, ref) => {
  const { value, open } = useCombobox();

  return (
    <PopoverPrimitive.Trigger asChild>
      <button
        ref={ref}
        type="button"
        role="combobox"
        aria-expanded={open}
        className={cn(
          "flex h-9 w-full items-center justify-between gap-2 rounded-md",
          "border border-input bg-background px-4 py-2",
          "font-sans text-sm font-medium",
          "shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]",
          "transition-colors",
          "hover:bg-brand-light",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-outline/50 focus-visible:ring-offset-2",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      >
        <span
          className={cn(
            "flex-1 truncate text-left",
            !value && !children && "text-muted-foreground font-normal"
          )}
        >
          {children ?? (value || placeholder)}
        </span>
        <ChevronsUpDown className="size-4 shrink-0 opacity-50" />
      </button>
    </PopoverPrimitive.Trigger>
  );
});
ComboboxTrigger.displayName = "ComboboxTrigger";

// ─── ComboboxContent ──────────────────────────────────────────────────────────

const ComboboxContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "start", sideOffset = 4, children, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-[var(--radix-popover-trigger-width)] min-w-[8rem] overflow-hidden",
        "rounded-md border border-border bg-popover",
        "shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)]",
        "data-[state=open]:animate-in data-[state=closed]:animate-out",
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
        "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
        "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
        className
      )}
      {...props}
    >
      {children}
    </PopoverPrimitive.Content>
  </PopoverPrimitive.Portal>
));
ComboboxContent.displayName = "ComboboxContent";

// ─── ComboboxInput ────────────────────────────────────────────────────────────

const ComboboxInput = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, placeholder = "Search…", ...props }, ref) => {
  const { search, setSearch } = useCombobox();

  return (
    <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
      <Search className="size-4 shrink-0 text-muted-foreground" />
      <input
        ref={ref}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "flex-1 bg-transparent font-sans text-sm text-foreground outline-none",
          "placeholder:text-muted-foreground",
          className
        )}
        {...props}
      />
    </div>
  );
});
ComboboxInput.displayName = "ComboboxInput";

// ─── ComboboxList ─────────────────────────────────────────────────────────────

const ComboboxList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("max-h-60 overflow-y-auto overflow-x-hidden p-1", className)}
    {...props}
  />
));
ComboboxList.displayName = "ComboboxList";

// ─── ComboboxItem ─────────────────────────────────────────────────────────────

export interface ComboboxItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onSelect"> {
  value: string;
  onSelect?: (value: string) => void;
  disabled?: boolean;
}

const ComboboxItem = React.forwardRef<HTMLDivElement, ComboboxItemProps>(
  ({ className, value, onSelect, disabled, children, ...props }, ref) => {
    const { value: selected, onValueChange, setOpen, search } = useCombobox();

    // Hide when search term doesn't match
    const label = typeof children === "string" ? children : value;
    if (search && !label.toLowerCase().includes(search.toLowerCase())) {
      return null;
    }

    const isSelected = selected === value;

    return (
      <div
        ref={ref}
        role="option"
        aria-selected={isSelected}
        aria-disabled={disabled}
        onClick={() => {
          if (disabled) return;
          onValueChange?.(value);
          onSelect?.(value);
          setOpen(false);
        }}
        className={cn(
          "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5",
          "font-sans text-sm text-foreground",
          "hover:bg-accent hover:text-accent-foreground",
          "aria-selected:font-medium",
          disabled && "pointer-events-none opacity-50",
          className
        )}
        {...props}
      >
        <span className="flex-1 truncate">{children}</span>
        {isSelected && <Check className="size-4 shrink-0" />}
      </div>
    );
  }
);
ComboboxItem.displayName = "ComboboxItem";

// ─── ComboboxGroup ────────────────────────────────────────────────────────────

const ComboboxGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { heading?: string }
>(({ className, heading, children, ...props }, ref) => (
  <div ref={ref} className={cn("py-1", className)} {...props}>
    {heading && (
      <p className="px-2 pb-1 pt-0.5 font-sans text-xs font-medium text-muted-foreground">
        {heading}
      </p>
    )}
    {children}
  </div>
));
ComboboxGroup.displayName = "ComboboxGroup";

// ─── ComboboxSeparator ────────────────────────────────────────────────────────

const ComboboxSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
    {...props}
  />
));
ComboboxSeparator.displayName = "ComboboxSeparator";

// ─── ComboboxEmpty ────────────────────────────────────────────────────────────

const ComboboxEmpty = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children = "No results found.", ...props }, ref) => (
  <div
    ref={ref}
    className={cn("px-2 py-6 text-center font-sans text-sm text-muted-foreground", className)}
    {...props}
  >
    {children}
  </div>
));
ComboboxEmpty.displayName = "ComboboxEmpty";

// ─── Combobox (convenience) ───────────────────────────────────────────────────

export interface ComboboxOption {
  value: string;
  label: string;
  group?: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
}

function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyText = "No results found.",
  className,
  disabled,
}: ComboboxProps) {
  const selected = options.find((o) => o.value === value);

  // Group options if any have a group property
  const hasGroups = options.some((o) => o.group);
  const groups = hasGroups
    ? Array.from(new Set(options.map((o) => o.group ?? ""))).filter(Boolean)
    : [];
  const ungrouped = options.filter((o) => !o.group);

  return (
    <ComboboxRoot value={value} onValueChange={onValueChange}>
      <ComboboxTrigger placeholder={placeholder} disabled={disabled} className={className}>
        {selected?.label}
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput placeholder={searchPlaceholder} />
        <ComboboxList>
          <ComboboxEmpty>{emptyText}</ComboboxEmpty>
          {hasGroups ? (
            <>
              {ungrouped.map((opt) => (
                <ComboboxItem key={opt.value} value={opt.value}>
                  {opt.label}
                </ComboboxItem>
              ))}
              {groups.map((group) => (
                <React.Fragment key={group}>
                  {ungrouped.length > 0 && <ComboboxSeparator />}
                  <ComboboxGroup heading={group}>
                    {options
                      .filter((o) => o.group === group)
                      .map((opt) => (
                        <ComboboxItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </ComboboxItem>
                      ))}
                  </ComboboxGroup>
                </React.Fragment>
              ))}
            </>
          ) : (
            options.map((opt) => (
              <ComboboxItem key={opt.value} value={opt.value}>
                {opt.label}
              </ComboboxItem>
            ))
          )}
        </ComboboxList>
      </ComboboxContent>
    </ComboboxRoot>
  );
}
Combobox.displayName = "Combobox";

export {
  Combobox,
  ComboboxRoot,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxInput,
  ComboboxList,
  ComboboxItem,
  ComboboxGroup,
  ComboboxSeparator,
  ComboboxEmpty,
};
