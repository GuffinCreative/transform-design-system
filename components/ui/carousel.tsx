import * as React from "react";
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type CarouselOrientation = "horizontal" | "vertical";

export type CarouselApi = {
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: () => boolean;
  canScrollNext: () => boolean;
};

export interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: CarouselOrientation;
  opts?: { loop?: boolean };
  setApi?: (api: CarouselApi) => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface CarouselContextValue {
  carouselRef: React.RefObject<HTMLDivElement>;
  orientation: CarouselOrientation;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const ctx = React.useContext(CarouselContext);
  if (!ctx) throw new Error("useCarousel must be used within <Carousel />");
  return ctx;
}

// ─── Carousel ─────────────────────────────────────────────────────────────────

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({ orientation = "horizontal", opts, setApi, className, children, ...props }, ref) => {
    const carouselRef = React.useRef<HTMLDivElement>(null);
    const [canScrollPrev, setCanScrollPrev] = React.useState(false);
    const [canScrollNext, setCanScrollNext] = React.useState(false);

    const updateScrollState = React.useCallback(() => {
      const el = carouselRef.current;
      if (!el) return;
      const isH = orientation === "horizontal";
      const scrollPos = isH ? el.scrollLeft : el.scrollTop;
      const clientSize = isH ? el.clientWidth : el.clientHeight;
      const scrollSize = isH ? el.scrollWidth : el.scrollHeight;
      setCanScrollPrev(scrollPos > 1);
      setCanScrollNext(scrollPos + clientSize < scrollSize - 1);
    }, [orientation]);

    React.useEffect(() => {
      const el = carouselRef.current;
      if (!el) return;
      el.addEventListener("scroll", updateScrollState, { passive: true });
      const ro = new ResizeObserver(updateScrollState);
      ro.observe(el);
      const mo = new MutationObserver(updateScrollState);
      mo.observe(el, { childList: true, subtree: true });
      updateScrollState();
      return () => {
        el.removeEventListener("scroll", updateScrollState);
        ro.disconnect();
        mo.disconnect();
      };
    }, [updateScrollState]);

    const getItemSize = React.useCallback((): number => {
      const el = carouselRef.current;
      if (!el) return 0;
      const first = el.querySelector<HTMLElement>("[data-carousel-item]");
      if (!first) return orientation === "horizontal" ? el.clientWidth : el.clientHeight;
      return orientation === "horizontal" ? first.offsetWidth : first.offsetHeight;
    }, [orientation]);

    const scrollPrev = React.useCallback(() => {
      const el = carouselRef.current;
      if (!el) return;
      const size = getItemSize();
      if (orientation === "horizontal") {
        el.scrollBy({ left: -size, behavior: "smooth" });
      } else {
        el.scrollBy({ top: -size, behavior: "smooth" });
      }
    }, [orientation, getItemSize]);

    const scrollNext = React.useCallback(() => {
      const el = carouselRef.current;
      if (!el) return;
      const size = getItemSize();
      if (orientation === "horizontal") {
        el.scrollBy({ left: size, behavior: "smooth" });
      } else {
        el.scrollBy({ top: size, behavior: "smooth" });
      }
    }, [orientation, getItemSize]);

    React.useEffect(() => {
      setApi?.({
        scrollPrev,
        scrollNext,
        canScrollPrev: () => canScrollPrev,
        canScrollNext: () => canScrollNext,
      });
    }, [setApi, scrollPrev, scrollNext, canScrollPrev, canScrollNext]);

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (orientation === "horizontal") {
          if (e.key === "ArrowLeft") { e.preventDefault(); scrollPrev(); }
          if (e.key === "ArrowRight") { e.preventDefault(); scrollNext(); }
        } else {
          if (e.key === "ArrowUp") { e.preventDefault(); scrollPrev(); }
          if (e.key === "ArrowDown") { e.preventDefault(); scrollNext(); }
        }
      },
      [orientation, scrollPrev, scrollNext]
    );

    return (
      <CarouselContext.Provider
        value={{ carouselRef, orientation, canScrollPrev, canScrollNext, scrollPrev, scrollNext }}
      >
        <div
          ref={ref}
          role="region"
          aria-roledescription="carousel"
          onKeyDownCapture={handleKeyDown}
          className={cn("relative", className)}
          {...props}
        >
          {children}
        </div>
      </CarouselContext.Provider>
    );
  }
);
Carousel.displayName = "Carousel";

// ─── CarouselContent ──────────────────────────────────────────────────────────

const CarouselContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { carouselRef, orientation } = useCarousel();

    return (
      <div className="overflow-hidden">
        <div
          ref={(node) => {
            (carouselRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof ref === "function") ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          className={cn(
            "flex [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            orientation === "horizontal"
              ? "flex-row overflow-x-auto snap-x snap-mandatory -ml-4"
              : "flex-col overflow-y-auto snap-y snap-mandatory -mt-4",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);
CarouselContent.displayName = "CarouselContent";

// ─── CarouselItem ─────────────────────────────────────────────────────────────

const CarouselItem = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { orientation } = useCarousel();

    return (
      <div
        ref={ref}
        data-carousel-item
        role="group"
        aria-roledescription="slide"
        className={cn(
          "min-w-0 shrink-0 grow-0 basis-full snap-start",
          orientation === "horizontal" ? "pl-4" : "pt-4",
          className
        )}
        {...props}
      />
    );
  }
);
CarouselItem.displayName = "CarouselItem";

// ─── CarouselPrevious ─────────────────────────────────────────────────────────

const CarouselPrevious = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { orientation, canScrollPrev, scrollPrev } = useCarousel();

  return (
    <button
      ref={ref}
      type="button"
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      aria-label="Previous slide"
      className={cn(
        "absolute inline-flex size-8 items-center justify-center",
        "rounded-full border border-input bg-background",
        "shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]",
        "text-brand-darkGreen transition-colors",
        "hover:bg-brand-light hover:text-brand-darkGreen",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-outline/50",
        "disabled:pointer-events-none disabled:opacity-50",
        orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "left-1/2 -top-12 -translate-x-1/2",
        className
      )}
      {...props}
    >
      {orientation === "horizontal" ? (
        <ArrowLeft className="size-4" />
      ) : (
        <ArrowUp className="size-4" />
      )}
    </button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

// ─── CarouselNext ─────────────────────────────────────────────────────────────

const CarouselNext = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { orientation, canScrollNext, scrollNext } = useCarousel();

  return (
    <button
      ref={ref}
      type="button"
      onClick={scrollNext}
      disabled={!canScrollNext}
      aria-label="Next slide"
      className={cn(
        "absolute inline-flex size-8 items-center justify-center",
        "rounded-full border border-input bg-background",
        "shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]",
        "text-brand-darkGreen transition-colors",
        "hover:bg-brand-light hover:text-brand-darkGreen",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-outline/50",
        "disabled:pointer-events-none disabled:opacity-50",
        orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "left-1/2 -bottom-12 -translate-x-1/2",
        className
      )}
      {...props}
    >
      {orientation === "horizontal" ? (
        <ArrowRight className="size-4" />
      ) : (
        <ArrowDown className="size-4" />
      )}
    </button>
  );
});
CarouselNext.displayName = "CarouselNext";

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext };
