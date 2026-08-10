import { Wave } from "../../../../components/ui/Wave";
import { Button } from "../../../../components/ui/Button";

export function PromoBannerSection() {
  return (
    <section className="w-full bg-brand-navy pb-14 sm:pb-16">
      {/* Main Banner Container with Orange Waves Background */}
      <div className="relative w-full bg-[#fdecdb] pt-6 md:pt-8 pb-10 sm:pb-12 text-center">
        {/* 4 Consistent Horizontal Waves Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-90">
          <svg
            className="w-full h-full"
            viewBox="0 0 1400 300"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Base Light Cream Background */}
            <rect width="1400" height="300" fill="#fdecdb" />

            {/* Wave 1 */}
            <path
              d="M 0 30 C 140 55, 280 55, 420 30 C 560 5, 700 5, 840 30 C 980 55, 1120 55, 1260 30 C 1330 17.5, 1370 17.5, 1400 30 V 60 C 1370 47.5, 1330 47.5, 1260 60 C 1120 85, 980 85, 840 60 C 700 35, 560 35, 420 60 C 280 85, 140 85, 0 60 Z"
              fill="#f9d8b4"
              opacity="0.85"
            />

            {/* Wave 2 */}
            <path
              d="M 0 100 C 140 125, 280 125, 420 100 C 560 75, 700 75, 840 100 C 980 125, 1120 125, 1260 100 C 1330 87.5, 1370 87.5, 1400 100 V 130 C 1370 117.5, 1330 117.5, 1260 130 C 1120 155, 980 155, 840 130 C 700 105, 560 105, 420 130 C 280 155, 140 155, 0 130 Z"
              fill="#f6ca9c"
              opacity="0.85"
            />

            {/* Wave 3 */}
            <path
              d="M 0 170 C 140 195, 280 195, 420 170 C 560 145, 700 145, 840 170 C 980 195, 1120 195, 1260 170 C 1330 157.5, 1370 157.5, 1400 170 V 200 C 1370 187.5, 1330 187.5, 1260 200 C 1120 225, 980 225, 840 200 C 700 175, 560 175, 420 200 C 280 225, 140 225, 0 200 Z"
              fill="#f3bd85"
              opacity="0.85"
            />

            {/* Wave 4 */}
            <path
              d="M 0 240 C 140 265, 280 265, 420 240 C 560 215, 700 215, 840 240 C 980 265, 1120 265, 1260 240 C 1330 227.5, 1370 227.5, 1400 240 V 270 C 1370 257.5, 1330 257.5, 1260 270 C 1120 295, 980 295, 840 270 C 700 245, 560 245, 420 270 C 280 295, 140 295, 0 270 Z"
              fill="#f0b06e"
              opacity="0.85"
            />
          </svg>
        </div>

        {/* Banner Content */}
        <div className="relative z-10 flex flex-col items-center px-4">
          <span className="text-xl sm:text-2xl md:text-3xl lg:text-5xl font-extrabold uppercase tracking-[0.25em] text-brand-light">
            FINAL SALE
          </span>

          <h2 className="mt-6 font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-wider text-brand-dark">
            GET 30% OFF
          </h2>

          {/* Action Button with Layered Blue Waves - Overflowing past bottom edge */}
          <div className="relative flex items-center justify-center w-full z-20 pointer-events-none mt-8 md:mt-10 -mb-10 sm:-mb-10">
            {/* Top Wave (Light Blue behind button) */}
            <div className="absolute top-1/2 -translate-y-4 left-1/2 -translate-x-1/2 w-[18rem] sm:w-[22rem] md:w-[26rem] z-0 text-brand-light pointer-events-none opacity-95">
              <Wave />
            </div>

            <Button
              to="/products"
              variant="primary"
              size="lg"
              className="relative z-10 pointer-events-auto bg-[#ea8925] hover:bg-[#d77918] text-white shadow-lg !px-8 lg:!px-12 !py-3.5 lg:!py-4 !text-base sm:!text-lg lg:!text-xl font-bold !rounded-2xl"
            >
              GET IT
            </Button>

            {/* Bottom Wave (Light Blue in front/below button extending into dark section below) */}
            <div className="absolute top-1/2 translate-y-3.5 left-1/2 -translate-x-1/2 w-[18rem] sm:w-[22rem] md:w-[26rem] z-20 text-[#529ab0] pointer-events-none opacity-95">
              <Wave />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
