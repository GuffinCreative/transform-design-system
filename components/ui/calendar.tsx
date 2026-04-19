import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Date helpers ─────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function firstWeekdayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay(); // 0 = Sunday
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isSameMonth(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

// ─── Types ────────────────────────────────────────────────────────────────────

type DayCell = { date: Date; outside: boolean };

export type CalendarMode = "single" | "range";

export interface DateRange {
  from: Date | undefined;
  to?: Date | undefined;
}

// Single-selection props
interface CalendarSingleProps {
  mode?: "single";
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
}

// Range-selection props
interface CalendarRangeProps {
  mode: "range";
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
}

type CalendarSelectionProps = CalendarSingleProps | CalendarRangeProps;

export type CalendarProps = CalendarSelectionProps & {
  className?: string;
  /** Month shown on first render. Defaults to selected date or today. */
  defaultMonth?: Date;
  /** Whether to render days from the previous/next month. */
  showOutsideDays?: boolean;
  /** Predicate that returns true for dates that should be non-interactive. */
  disabled?: (date: Date) => boolean;
  /** Earliest selectable date. */
  fromDate?: Date;
  /** Latest selectable date. */
  toDate?: Date;
  /** Called when the displayed month changes. */
  onMonthChange?: (month: Date) => void;
};

// ─── Calendar ─────────────────────────────────────────────────────────────────

function Calendar({
  className,
  defaultMonth,
  showOutsideDays = true,
  disabled,
  fromDate,
  toDate,
  onMonthChange,
  ...selectionProps
}: CalendarProps) {
  const today = new Date();

  const getInitialMonth = (): Date => {
    if (defaultMonth) return defaultMonth;
    if (selectionProps.mode === "range") {
      return selectionProps.selected?.from ?? today;
    }
    return (selectionProps as CalendarSingleProps).selected ?? today;
  };

  const [viewMonth, setViewMonth] = React.useState<Date>(getInitialMonth);

  const year = viewMonth.getFullYear();
  const monthIndex = viewMonth.getMonth();

  // ── Build the day grid ────────────────────────────────────────────────────

  const cells: DayCell[] = [];
  const leadCount = firstWeekdayOfMonth(year, monthIndex);
  const prevMonthDays = daysInMonth(year, monthIndex - 1);

  for (let i = leadCount - 1; i >= 0; i--) {
    cells.push({ date: new Date(year, monthIndex - 1, prevMonthDays - i), outside: true });
  }
  for (let d = 1; d <= daysInMonth(year, monthIndex); d++) {
    cells.push({ date: new Date(year, monthIndex, d), outside: false });
  }
  let next = 1;
  const targetRows = cells.length > 35 ? 42 : 35;
  while (cells.length < targetRows) {
    cells.push({ date: new Date(year, monthIndex + 1, next++), outside: true });
  }

  const weeks: DayCell[][] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  function navigate(delta: number) {
    const next = new Date(year, monthIndex + delta, 1);
    setViewMonth(next);
    onMonthChange?.(next);
  }

  const canGoPrev = !fromDate || new Date(year, monthIndex - 1, 1) >= new Date(fromDate.getFullYear(), fromDate.getMonth(), 1);
  const canGoNext = !toDate   || new Date(year, monthIndex + 1, 1) <= new Date(toDate.getFullYear(),   toDate.getMonth(),   1);

  // ── Day state helpers ─────────────────────────────────────────────────────

  function isDayDisabled(date: Date) {
    if (fromDate && date < new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate())) return true;
    if (toDate   && date > new Date(toDate.getFullYear(),   toDate.getMonth(),   toDate.getDate()))   return true;
    return disabled?.(date) ?? false;
  }

  function isDaySelected(date: Date): boolean {
    if (selectionProps.mode === "range") {
      const { from, to } = selectionProps.selected ?? {};
      if (from && isSameDay(date, from)) return true;
      if (to   && isSameDay(date, to))   return true;
      return false;
    }
    const sel = (selectionProps as CalendarSingleProps).selected;
    return !!sel && isSameDay(date, sel);
  }

  function isInRange(date: Date): boolean {
    if (selectionProps.mode !== "range") return false;
    const { from, to } = selectionProps.selected ?? {};
    if (!from || !to) return false;
    return date > from && date < to;
  }

  function isRangeStart(date: Date): boolean {
    if (selectionProps.mode !== "range") return false;
    const { from } = selectionProps.selected ?? {};
    return !!from && isSameDay(date, from);
  }

  function isRangeEnd(date: Date): boolean {
    if (selectionProps.mode !== "range") return false;
    const { to } = selectionProps.selected ?? {};
    return !!to && isSameDay(date, to);
  }

  // ── Click handler ─────────────────────────────────────────────────────────

  function handleDayClick(date: Date, outside: boolean) {
    if (isDayDisabled(date)) return;
    if (outside) {
      const next = new Date(date.getFullYear(), date.getMonth(), 1);
      setViewMonth(next);
      onMonthChange?.(next);
    }

    if (selectionProps.mode === "range") {
      const { from, to } = selectionProps.selected ?? {};
      if (!from || (from && to)) {
        selectionProps.onSelect?.({ from: date, to: undefined });
      } else {
        if (date < from) {
          selectionProps.onSelect?.({ from: date, to: from });
        } else {
          selectionProps.onSelect?.({ from, to: date });
        }
      }
    } else {
      const sel = (selectionProps as CalendarSingleProps).selected;
      const cb = (selectionProps as CalendarSingleProps).onSelect;
      cb?.(sel && isSameDay(date, sel) ? undefined : date);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      className={cn(
        "inline-flex flex-col gap-4",
        "bg-background border border-input rounded-lg p-3",
        "shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1),0px_1px_2px_0px_rgba(0,0,0,0.1)]",
        className
      )}
    >
      {/* ── Month header ── */}
      <div className="relative flex h-8 items-center justify-center">
        <button
          type="button"
          onClick={() => navigate(-1)}
          disabled={!canGoPrev}
          aria-label="Previous month"
          className={cn(
            "absolute left-0 inline-flex size-8 items-center justify-center rounded-md",
            "font-sans text-brand-alt transition-colors",
            "hover:bg-brand-light hover:text-brand-darkGreen",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-outline/50",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
        >
          <ChevronLeft className="size-4" />
        </button>

        <p className="font-sans text-sm font-medium text-brand-darkGreen">
          {MONTH_NAMES[monthIndex]} {year}
        </p>

        <button
          type="button"
          onClick={() => navigate(1)}
          disabled={!canGoNext}
          aria-label="Next month"
          className={cn(
            "absolute right-0 inline-flex size-8 items-center justify-center rounded-md",
            "font-sans text-brand-alt transition-colors",
            "hover:bg-brand-light hover:text-brand-darkGreen",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-outline/50",
            "disabled:pointer-events-none disabled:opacity-50"
          )}
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* ── Grid ── */}
      <div className="flex flex-col gap-2">

        {/* Day-of-week headers: Su Mo Tu We Th Fr Sa */}
        <div className="grid grid-cols-7">
          {DAY_LABELS.map((label) => (
            <div
              key={label}
              className="flex h-5 w-8 items-center justify-center font-sans text-xs text-brand-alt"
            >
              {label}
            </div>
          ))}
        </div>

        {/* Week rows */}
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7">
            {week.map(({ date, outside }, di) => {
              const selected  = isDaySelected(date);
              const inRange   = isInRange(date);
              const rangeStart = isRangeStart(date);
              const rangeEnd   = isRangeEnd(date);
              const isToday   = isSameDay(date, today);
              const isCurrentMonth = isSameMonth(date, viewMonth);
              const dayDisabled = isDayDisabled(date);

              return (
                <button
                  key={di}
                  type="button"
                  onClick={() => handleDayClick(date, outside)}
                  disabled={dayDisabled}
                  aria-selected={selected || inRange}
                  aria-label={date.toLocaleDateString("en-US", {
                    weekday: "long", year: "numeric", month: "long", day: "numeric",
                  })}
                  className={cn(
                    "relative inline-flex size-8 items-center justify-center",
                    "font-sans text-sm font-normal transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-outline/50 focus-visible:z-10",
                    "disabled:pointer-events-none disabled:opacity-50",

                    // Base radius — overridden for range caps
                    "rounded-md",

                    // Outside days (prev / next month)
                    outside && "text-brand-alt/40",
                    outside && !showOutsideDays && "invisible pointer-events-none",

                    // Today indicator (unselected)
                    isToday && !selected && "bg-brand-light text-brand-darkGreen font-medium",

                    // Normal in-month days
                    !selected && !isToday && isCurrentMonth && "text-brand-darkGreen",

                    // Hover (not selected, not disabled)
                    !selected && !dayDisabled && "hover:bg-brand-light hover:text-brand-darkGreen",

                    // Range: middle days
                    inRange && "rounded-none bg-brand-primary/10 text-brand-darkGreen hover:bg-brand-primary/20",

                    // Range: start cap
                    rangeStart && "rounded-l-md rounded-r-none bg-brand-primary text-white hover:bg-brand-midOrange",

                    // Range: end cap
                    rangeEnd && "rounded-r-md rounded-l-none bg-brand-primary text-white hover:bg-brand-midOrange",

                    // Single selected (or start/end that are same day)
                    selected && !rangeStart && !rangeEnd && "bg-brand-primary text-white hover:bg-brand-midOrange rounded-md",
                  )}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

Calendar.displayName = "Calendar";

export { Calendar };
