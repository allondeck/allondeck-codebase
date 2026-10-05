import { WaveButton } from "../../../../components/ui/WaveButton";

export function EstimateBannerSection() {
  return (
    <section id="free-estimate-section" className="relative flex flex-col items-center justify-center px-4 py-16 sm:py-20 md:py-24 overflow-hidden bg-brand-dark min-h-[70vh]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/images/free-estimate.webp"
          alt="Free Estimate Marine Deck Flooring"
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover opacity-75"
        />
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center">
        {/* Title above card */}
        <h2 className="font-heading text-3xl sm:text-4xl md:text-6xl font-black tracking-wider sm:tracking-widest text-brand-orange uppercase drop-shadow-lg mb-6">
          FREE ESTIMATE
        </h2>

        {/* Center Translucent Card */}
        <div className="w-full bg-brand-dark/85 backdrop-blur-md rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-12 md:p-14 border border-white/10 shadow-2xl flex flex-col items-center text-center">
          <h3 className="font-heading text-2xl sm:text-4xl md:text-5xl font-black tracking-wide sm:tracking-wider text-white uppercase leading-tight drop-shadow-md">
            RENEWING YOUR<br />BOAT'S DECK HAS<br />NEVER BEEN EASIER!
          </h3>

          <div className="mt-8 sm:mt-10 mb-6 sm:mb-8">
            <WaveButton
              to="/estimate"
              variant="primary"
              size="lg"
            >
              GET AN ESTIMATE
            </WaveButton>
          </div>

          <p className="font-heading text-[11px] sm:text-sm md:text-base font-bold tracking-wider sm:tracking-[0.2em] text-white uppercase drop-shadow-md">
            TAKE YOUR BOAT TO THE NEXT LEVEL
          </p>
        </div>
      </div>
    </section>
  );
}
