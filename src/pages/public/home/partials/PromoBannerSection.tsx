import { Wave } from "../../../../components/ui/Wave";
import { Button } from "../../../../components/ui/Button";

export function PromoBannerSection() {
  return (
    <section className="bg-brand-dark pb-12">
      <div className="w-full bg-brand-cream relative overflow-hidden py-16 text-center shadow-inner">
        <div className="relative z-10 flex flex-col items-center">
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-[0.3em] text-brand-light">
            FINAL SALE
          </span>
          <h2 className="mt-2 font-heading text-5xl md:text-7xl lg:text-8xl font-black tracking-wider text-brand-dark">
            GET 30% OFF
          </h2>

          {/* Action Button with Layered Waves (Exact same as Hero) */}
          <div className="relative flex items-center justify-center w-full z-20 pointer-events-none mt-10 md:mt-12">
            {/* Top Wave (Behind button, official design asset) */}
            <div className="absolute top-1/2 -translate-y-3.5 left-1/2 -translate-x-1/2 w-[18rem] sm:w-[22rem] md:w-[26rem] z-0 text-brand-light pointer-events-none opacity-95">
              <Wave />
            </div>

            <Button
              to="/products"
              variant="primary"
              size="lg"
              className="relative z-10 pointer-events-auto"
            >
              GET IT
            </Button>

            {/* Bottom Wave (In front of button, official design asset) */}
            <div className="absolute top-1/2 translate-y-3.5 left-1/2 -translate-x-1/2 w-[18rem] sm:w-[22rem] md:w-[26rem] z-20 text-brand-light pointer-events-none opacity-95">
              <Wave />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
