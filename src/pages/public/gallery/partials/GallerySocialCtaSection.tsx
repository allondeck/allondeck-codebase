import { AnimatedSection } from "../../../../components/ui/AnimatedSection";

export interface GallerySocialCtaSectionProps {
  className?: string;
}

export function GallerySocialCtaSection({
  className = "",
}: GallerySocialCtaSectionProps) {
  return (
    <section
      id="social-media-cta"
      aria-label="Follow All On Deck on social media"
      className={`mx-auto max-w-content px-6 lg:px-12 mt-16 sm:mt-24 ${className}`}
    >
      <AnimatedSection className="relative overflow-hidden rounded-3xl border border-brand-medium/40 bg-gradient-to-b from-brand-dark-alt via-brand-dark to-brand-dark-alt p-8 sm:p-14 md:p-16 text-center shadow-2xl">
        {/* Subtle Wave Texture in Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <img
            src="/assets/svg/recurso olas, 1 ola.svg"
            alt=""
            aria-hidden="true"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Section Heading matching All On Deck Brand Lockup */}
        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="font-heading uppercase text-center leading-tight">
            <span className="block text-xs sm:text-sm font-bold tracking-[0.25em] text-brand-orange uppercase mb-2">
              DISCOVER MORE
            </span>
            <span className="block text-3xl sm:text-5xl md:text-6xl font-black tracking-wide sm:tracking-wider text-brand-cream">
              SEE MORE ON OUR SOCIALS
            </span>
          </h2>

          {/* Signature double wave squiggle matching site footer */}
          <svg
            className="w-20 h-3 text-brand-orange mt-4 mx-auto"
            viewBox="0 0 100 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            aria-hidden="true"
          >
            <path d="M0,2 Q5,-2 10,2 T20,2 T30,2 T40,2 T50,2 T60,2 T70,2 T80,2 T90,2 T100,2" />
            <path d="M0,10 Q5,6 10,10 T20,10 T30,10 T40,10 T50,10 T60,10 T70,10 T80,10 T90,10 T100,10" />
          </svg>

          <p className="mt-4 sm:mt-5 text-sm sm:text-base md:text-lg text-brand-light italic font-sans leading-relaxed max-w-xl mx-auto">
            Catch daily behind-the-scenes CNC routing, before-and-after vessel transformations, and our latest custom marine installations.
          </p>

          {/* Social Links Cards */}
          <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto">
            {/* Instagram Card */}
            <a
              href="https://www.instagram.com/all_ondeck?igsh=dHM0Y2J4ZnJqMWd3&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-2xl border border-brand-medium/40 bg-brand-dark-alt/90 p-6 sm:p-8 transition-all duration-300 hover:border-brand-orange hover:bg-brand-dark hover:scale-[1.02] shadow-xl"
              aria-label="Follow All On Deck on Instagram @all_ondeck (opens in new tab)"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-medium/30 text-brand-cream group-hover:bg-brand-orange group-hover:text-white transition-colors">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"
                      />
                    </svg>
                  </div>
                  <span className="font-heading text-xs font-bold tracking-widest text-brand-orange uppercase">
                    INSTAGRAM
                  </span>
                </div>

                <h3 className="font-heading text-xl font-bold text-brand-cream group-hover:text-white transition-colors">
                  @all_ondeck
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-brand-light leading-relaxed">
                  Daily reels, in-progress installation stories, and high-res project highlights.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-brand-medium/30 flex items-center justify-between text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-orange group-hover:text-white transition-colors">
                <span>Follow On Instagram</span>
                <span className="transform group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
              </div>
            </a>

            {/* Facebook Card */}
            <a
              href="https://www.facebook.com/profile.php?id=61571779111701"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-2xl border border-brand-medium/40 bg-brand-dark-alt/90 p-6 sm:p-8 transition-all duration-300 hover:border-brand-orange hover:bg-brand-dark hover:scale-[1.02] shadow-xl"
              aria-label="Follow All On Deck on Facebook (opens in new tab)"
            >
              <div>
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-medium/30 text-brand-cream group-hover:bg-brand-orange group-hover:text-white transition-colors">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                    </svg>
                  </div>
                  <span className="font-heading text-xs font-bold tracking-widest text-brand-orange uppercase">
                    FACEBOOK
                  </span>
                </div>

                <h3 className="font-heading text-xl font-bold text-brand-cream group-hover:text-white transition-colors">
                  All On Deck
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-brand-light leading-relaxed">
                  Full project albums, customer reviews, and local Florida community updates.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-brand-medium/30 flex items-center justify-between text-xs sm:text-sm font-bold uppercase tracking-wider text-brand-orange group-hover:text-white transition-colors">
                <span>Visit On Facebook</span>
                <span className="transform group-hover:translate-x-1 transition-transform" aria-hidden="true">→</span>
              </div>
            </a>
          </div>
        </div>
      </AnimatedSection>
    </section>
  );
}
