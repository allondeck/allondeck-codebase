import { Wave } from "../../../../components/ui/Wave";
import { Button } from "../../../../components/ui/Button";

export function GallerySection() {
  return (
    <section
      id="gallery-section"
      className="relative overflow-hidden bg-brand-medium py-28 sm:py-36 md:py-40 text-white min-h-[75vh] lg:min-h-[90vh] flex items-center justify-center"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/images/9.jpg"
          alt="All On Deck Boat Flooring Gallery"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-content px-4 sm:px-6 lg:px-8 text-center w-full flex justify-center">
        {/* Gallery Centerpiece Card */}
        <div className="relative w-full max-w-2xl sm:max-w-3xl md:max-w-[820px] lg:max-w-[860px] rounded-[2.25rem] md:rounded-[3rem] bg-brand-dark/80 pt-8 sm:pt-11 md:pt-14 pb-12 sm:pb-15 md:pb-18 px-4 sm:px-6 md:px-8 shadow-2xl overflow-visible text-center">
          {/* Title - CHECK OUR (Brand Light) / GALLERY (Brand Cream) */}
          <h2 className="relative z-10 font-heading uppercase text-center leading-none">
            <span className="block text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-normal tracking-[0.16em] sm:tracking-[0.18em] md:tracking-[0.2em] text-brand-light">
              CHECK OUR
            </span>
            <span className="block text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[8.75rem] font-normal tracking-[0.06em] sm:tracking-[0.08em] md:tracking-[0.1em] text-brand-cream mt-1 sm:mt-2 md:mt-3">
              GALLERY
            </span>
          </h2>

          {/* Subtitle */}
          <p className="relative z-10 mt-4 sm:mt-6 md:mt-7 mb-2 text-sm sm:text-base md:text-xl lg:text-2xl xl:text-[1.65rem] text-white italic font-sans max-w-2xl lg:max-w-3xl mx-auto tracking-wide sm:tracking-wider leading-relaxed">
            Your boat could be the next star of our gallery.
          </p>

          {/* Floating Action Button with Layered Waves */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[40%] flex items-center justify-center w-full z-20 pointer-events-none">
            {/* Top Wave (Behind button, official design asset) */}
            <div className="absolute top-1/2 -translate-y-3 sm:-translate-y-4 left-1/2 -translate-x-1/2 w-[20rem] sm:w-[26rem] md:w-[32rem] lg:w-[38rem] z-0 text-brand-light pointer-events-none opacity-90">
              <Wave />
            </div>

            <Button
              to="/gallery"
              variant="primary"
              size="lg"
              className="relative z-10 pointer-events-auto !rounded-2xl !px-8 sm:!px-12 !py-3.5 sm:!py-4 text-sm sm:text-base md:text-lg font-bold tracking-wider shadow-xl"
            >
              GET VIEW
            </Button>

            {/* Bottom Wave (In front of button, official design asset) */}
            <div className="absolute top-1/2 translate-y-3 sm:translate-y-4 left-1/2 -translate-x-1/2 w-[20rem] sm:w-[26rem] md:w-[32rem] lg:w-[38rem] z-20 text-brand-light pointer-events-none opacity-90">
              <Wave />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
