import { Icon } from "../../../../components/ui/Icon";

export function EstimateHeroSection() {
  return (
    <>
      {/* HEADER SECTION */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">
          Renewing your boat's deck has never been EASIER!
        </span>
        <h1 className="mt-4 font-heading text-4xl font-black tracking-wider text-brand-cream sm:text-5xl lg:text-6xl">
          FREE ESTIMATE
        </h1>
        <div className="mx-auto mt-4 h-1.5 w-16 bg-brand-orange rounded-full" />
        <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-brand-cream/80">
          Fill out the form below to get started. Our specialized design team
          will contact you shortly to review your project specs.
        </p>
      </div>

      {/* WAVE DIVIDER */}
      <div className="my-12 mx-auto max-w-[1400px] px-6 lg:px-12 opacity-30 text-brand-light">
        <Icon name="wave" width={380} height={29} className="w-full" />
      </div>
    </>
  );
}
