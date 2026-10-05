import { Wave } from "../../../../components/ui/Wave";
import { Button } from "../../../../components/ui/Button";

export function PromoBannerSection() {
  return (
    <section
      id="promo-banner-section"
      className="relative z-20 w-full bg-brand-navy"
    >
      {/* Main Banner Container with Orange Waves Background */}
      <div className="relative w-full bg-brand-cream pt-10 sm:pt-12 md:pt-14 pb-12 sm:pb-14 text-center">
        {/* Background Waves from Illustrator Prototype (Exact vector curves, no deformation) */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src="/assets/svg/promo-waves.svg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Banner Content */}
        <div className="relative z-10 flex flex-col items-center px-4">
          <span className="lg:pb-6 lg:-mt-4 font-heading text-xl sm:text-2xl md:text-3xl lg:text-[40px] font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] text-brand-light">
            FINAL SALE
          </span>

          <h2 className="mt-3 sm:mt-4 md:mt-5 font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-normal tracking-[0.08em] sm:tracking-[0.1em] text-brand-dark uppercase">
            GET 30% OFF
          </h2>

          {/* Action Button with Layered Blue Waves - Solid color, no opacity */}
          <div className="relative flex items-center justify-center w-full z-20 pointer-events-none mt-8 md:mt-10 -mb-10 sm:-mb-14">
            {/* Top Wave (Solid light blue behind button) */}
            <div className="absolute top-1/2 -translate-y-4 left-1/2 -translate-x-1/2 w-[18rem] sm:w-[22rem] md:w-[26rem] z-0 text-brand-light pointer-events-none">
              <Wave className="w-full h-auto" />
            </div>

            <Button
              to="/products"
              variant="primary"
              size="lg"
              className="relative z-10 pointer-events-auto bg-brand-orange hover:bg-brand-orange/90 text-brand-cream shadow-lg !px-8 lg:!px-12 !py-3.5 lg:!py-4 !text-base sm:!text-lg lg:!text-xl font-bold !rounded-2xl"
            >
              GET IT
            </Button>

            {/* Bottom Wave (Solid light blue in front of button) */}
            <div className="absolute top-1/2 translate-y-3.5 left-1/2 -translate-x-1/2 w-[18rem] sm:w-[22rem] md:w-[26rem] z-20 text-brand-light pointer-events-none">
              <Wave className="w-full h-auto" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
