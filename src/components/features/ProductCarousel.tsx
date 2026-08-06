import { useRef, useState, useEffect, useCallback, ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCarouselProps {
  children: ReactNode;
  className?: string;
}

/**
 * ProductCarousel.tsx
 *
 * Custom horizontal carousel with smooth scroll controls.
 * Shows left/right navigation arrow buttons dynamically based on scroll position.
 */
export function ProductCarousel({
  children,
  className = "",
}: ProductCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);

    // Re-check after images/children load or render
    const timer = setTimeout(checkScroll, 100);

    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
      clearTimeout(timer);
    };
  }, [checkScroll, children]);

  const handleScroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <div className={`relative group ${className}`.trim()}>
      {/* Left Arrow Button */}
      {canScrollLeft && (
        <button
          type="button"
          onClick={() => handleScroll("left")}
          className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 z-20 size-12 sm:size-14 rounded-full bg-brand-light/95 hover:bg-brand-light text-brand-cream flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
          aria-label="Scroll left"
        >
          <ChevronLeft className="size-8 stroke-[3] relative -translate-x-0.5" />
        </button>
      )}

      {/* Right Arrow Button */}
      {canScrollRight && (
        <button
          type="button"
          onClick={() => handleScroll("right")}
          className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 z-20 size-12 sm:size-14 rounded-full bg-brand-light/95 hover:bg-brand-light text-brand-cream flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none"
          aria-label="Scroll right"
        >
          <ChevronRight className="size-8 stroke-[3] relative translate-x-0.5" />
        </button>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </div>
  );
}
