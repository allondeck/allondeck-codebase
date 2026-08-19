import { Wave } from "../../../../components/ui/Wave";
import { Button } from "../../../../components/ui/Button";

export function GallerySection() {
  return (
    <section className="relative overflow-hidden bg-brand-medium py-20 md:py-28 text-white min-h-[75vh] flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/images/9.jpg"
          alt="Boat Gallery"
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-content px-6 lg:px-12 text-center w-full">
        {/* Gallery Centerpiece Card */}
        <div className="relative mx-auto max-w-3xl rounded-[2.5rem] bg-brand-dark/90 backdrop-blur-md p-8 sm:p-12 md:p-14 border border-brand-light/20 shadow-2xl overflow-visible text-center">
          {/* Title - CHECK OUR (Brand Light) / GALLERY (Brand Cream) */}
          <h2 className="relative z-10 font-heading uppercase text-center leading-none">
            <span className="block text-3xl sm:text-5xl md:text-6xl font-black tracking-[0.2em] text-brand-light drop-shadow-md">
              CHECK OUR
            </span>
            <span className="block text-5xl sm:text-7xl md:text-8xl font-black tracking-widest text-brand-cream drop-shadow-lg mt-1 sm:mt-2">
              GALLERY
            </span>
          </h2>

          {/* Subtitle */}
          <p className="relative z-10 mt-6 text-base sm:text-lg lg:text-xl xl:text-2xl text-white italic font-sans max-w-xl mx-auto mb-6 sm:mb-8">
            Your boat could be the next star of our gallery.
          </p>

          {/* Floating Action Button with Layered Waves (Exact same as Hero) */}
          <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 translate-y-1/4 flex items-center justify-center w-full z-20 pointer-events-none">
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
              GET VIEW
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
