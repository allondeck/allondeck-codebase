import { Button } from "../../../../components/ui/Button";

export function AboutPrecisionBannerSection() {
  return (
    <div className="bg-brand-dark-alt border-t border-brand-medium/35 py-16 text-white text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <img
          src="/assets/svg/recurso olas, 1 ola.svg"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
        <h2 className="font-heading text-2xl font-black tracking-wider sm:text-4xl text-brand-cream">
          CRAFTED WITH PRECISION
        </h2>
        <p className="mt-4 text-sm md:text-base text-brand-light leading-relaxed font-sans">
          All On Deck sets the standard in marine deck fabrication, combining
          state of the art CAD modeling with hands-on nautical engineering
          expertise in Florida.
        </p>
        <div className="mt-8">
          <Button to="/services" variant="primary" size="md">
            See Our Work
          </Button>
        </div>
      </div>
    </div>
  );
}
