import * as React from "react";
import * as RechartsPrimitive from "recharts";
import { cn } from "@/lib/utils";

// ─── Config type ──────────────────────────────────────────────────────────────

export type ChartConfig = {
  [k: string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
  };
};

// ─── Context ──────────────────────────────────────────────────────────────────

interface ChartContextValue {
  config: ChartConfig;
}

const ChartContext = React.createContext<ChartContextValue | null>(null);

function useChart() {
  const ctx = React.useContext(ChartContext);
  if (!ctx) throw new Error("useChart must be used within <ChartContainer />");
  return ctx;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getItemConfig(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== "object" || payload === null) return config[key];
  const inner = "payload" in payload && typeof (payload as Record<string, unknown>).payload === "object"
    ? (payload as Record<string, unknown>).payload as Record<string, unknown>
    : undefined;
  const resolvedKey =
    key in config
      ? key
      : inner && key in inner && typeof inner[key] === "string"
      ? (inner[key] as string)
      : key;
  return config[resolvedKey];
}

// ─── ChartStyle ───────────────────────────────────────────────────────────────

function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const entries = Object.entries(config).filter(([, c]) => c.color);
  if (!entries.length) return null;
  return (
    <style
      dangerouslySetInnerHTML={{
        __html: entries
          .map(([key, c]) => `[data-chart="${id}"] { --color-${key}: ${c.color}; }`)
          .join("\n"),
      }}
    />
  );
}

// ─── ChartContainer ───────────────────────────────────────────────────────────

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  id?: string;
  config: ChartConfig;
  children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>["children"];
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ id, className, children, config, ...props }, ref) => {
    const uid = React.useId();
    const chartId = `chart-${id ?? uid.replace(/:/g, "")}`;

    return (
      <ChartContext.Provider value={{ config }}>
        <div
          ref={ref}
          data-chart={chartId}
          className={cn(
            "flex aspect-video justify-center font-sans",
            // Recharts element overrides — harmonise with brand tokens
            "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground",
            "[&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50",
            "[&_.recharts-curve.recharts-tooltip-cursor]:stroke-border",
            "[&_.recharts-dot[stroke='#fff']]:stroke-transparent",
            "[&_.recharts-layer]:outline-none",
            "[&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border",
            "[&_.recharts-radial-bar-background-sector]:fill-muted",
            "[&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted",
            "[&_.recharts-reference-line_[stroke='#ccc']]:stroke-border",
            "[&_.recharts-sector[stroke='#fff']]:stroke-transparent",
            "[&_.recharts-sector]:outline-none",
            "[&_.recharts-surface]:outline-none",
            className
          )}
          {...props}
        >
          <ChartStyle id={chartId} config={config} />
          <RechartsPrimitive.ResponsiveContainer>
            {children}
          </RechartsPrimitive.ResponsiveContainer>
        </div>
      </ChartContext.Provider>
    );
  }
);
ChartContainer.displayName = "ChartContainer";

// ─── ChartTooltip ─────────────────────────────────────────────────────────────

const ChartTooltip = RechartsPrimitive.Tooltip;

// ─── ChartTooltipContent ──────────────────────────────────────────────────────

export interface ChartTooltipContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Pick<
      React.ComponentProps<typeof RechartsPrimitive.Tooltip>,
      "active" | "payload" | "label" | "labelFormatter" | "formatter"
    > {
  hideLabel?: boolean;
  hideIndicator?: boolean;
  indicator?: "dot" | "line" | "dashed";
  nameKey?: string;
  labelKey?: string;
  labelClassName?: string;
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) return null;
      const [item] = payload;
      const key = `${labelKey ?? item?.dataKey ?? item?.name ?? "value"}`;
      const itemConfig = getItemConfig(config, item, key);
      const value =
        !labelKey && typeof label === "string"
          ? (config[label as keyof typeof config]?.label ?? label)
          : itemConfig?.label;
      if (labelFormatter) {
        return (
          <div className={cn("mb-1 font-medium text-foreground text-xs", labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        );
      }
      if (!value) return null;
      return (
        <div className={cn("mb-1 font-medium text-foreground text-xs", labelClassName)}>
          {value}
        </div>
      );
    }, [hideLabel, payload, labelKey, config, label, labelFormatter, labelClassName]);

    if (!active || !payload?.length) return null;

    const nestLabel = payload.length === 1 && indicator !== "dot";

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-[8rem] items-start gap-1.5 rounded-lg",
          "border border-border/50 bg-popover px-2.5 py-1.5",
          "font-sans text-xs text-popover-foreground",
          "shadow-[0px_4px_6px_0px_rgba(0,0,0,0.1),0px_2px_4px_0px_rgba(0,0,0,0.1)]",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {payload.map((item, index) => {
            const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`;
            const itemConfig = getItemConfig(config, item, key);
            const indicatorColor =
              (item.payload as Record<string, unknown> | undefined)?.fill as string | undefined
              ?? item.color;

            return (
              <div
                key={String(item.dataKey)}
                className={cn(
                  "flex w-full flex-wrap items-stretch gap-2",
                  "[&>svg]:size-2.5 [&>svg]:text-muted-foreground",
                  indicator === "dot" && "items-center"
                )}
              >
                {itemConfig?.icon ? (
                  <itemConfig.icon />
                ) : (
                  !hideIndicator && (
                    <span
                      className={cn(
                        "shrink-0 border-[--color-border] bg-[--color-bg]",
                        indicator === "dot" && "size-2 rounded-full",
                        indicator === "line" && "my-0.5 w-1 rounded-none",
                        indicator === "dashed" && "my-0.5 w-0 border-dashed",
                        nestLabel && indicator === "dashed" && "my-1"
                      )}
                      style={
                        {
                          "--color-bg": indicatorColor,
                          "--color-border": indicatorColor,
                        } as React.CSSProperties
                      }
                    />
                  )
                )}
                <div
                  className={cn(
                    "flex flex-1 justify-between leading-none",
                    nestLabel ? "items-end" : "items-center"
                  )}
                >
                  <div className="grid gap-1.5">
                    {nestLabel ? tooltipLabel : null}
                    <span className="text-muted-foreground">
                      {itemConfig?.label ?? item.name}
                    </span>
                  </div>
                  {item.value !== undefined && (
                    <span className="font-medium tabular-nums text-foreground">
                      {formatter
                        ? formatter(item.value, item.name ?? "", item, index, payload)
                        : typeof item.value === "number"
                        ? item.value.toLocaleString()
                        : String(item.value)}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = "ChartTooltipContent";

// ─── ChartLegend ──────────────────────────────────────────────────────────────

const ChartLegend = RechartsPrimitive.Legend;

// ─── ChartLegendContent ───────────────────────────────────────────────────────

export interface ChartLegendContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> {
  hideIcon?: boolean;
  nameKey?: string;
}

const ChartLegendContent = React.forwardRef<HTMLDivElement, ChartLegendContentProps>(
  ({ className, hideIcon = false, payload, verticalAlign = "bottom", nameKey }, ref) => {
    const { config } = useChart();

    if (!payload?.length) return null;

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap items-center justify-center gap-4 font-sans text-xs",
          verticalAlign === "top" ? "pb-3" : "pt-3",
          className
        )}
      >
        {payload.map((item) => {
          const key = `${nameKey ?? item.dataKey ?? "value"}`;
          const itemConfig = getItemConfig(config, item, key);

          return (
            <div
              key={String(item.value)}
              className="flex items-center gap-1.5 [&>svg]:size-3 [&>svg]:text-muted-foreground"
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="size-2 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: item.color }}
                />
              )}
              <span className="text-muted-foreground">
                {itemConfig?.label ?? item.value}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
);
ChartLegendContent.displayName = "ChartLegendContent";

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
};
