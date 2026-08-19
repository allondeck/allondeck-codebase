import { Link } from "react-router-dom";

export type DesignPattern = {
  id: string;
  name: string;
  image_url: string | null;
};

interface DesignsPatternsSectionProps {
  patterns: DesignPattern[];
}

export function DesignsPatternsSection({ patterns }: DesignsPatternsSectionProps) {
  return (
    <div
      id="gallery"
      className="scroll-mt-20 border-t border-brand-medium/30 bg-brand-medium py-20 relative overflow-hidden"
    >
      <div className="mx-auto max-w-content px-6 lg:px-12">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
          {/* Patterns Grid */}
          <div className="flex-1 w-full relative z-10">
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-x-4 gap-y-6">
              {patterns.map((pattern) => (
                <div
                  key={pattern.id}
                  className="group flex flex-col items-center"
                >
                  <div className="relative w-12 h-20 sm:w-14 sm:h-24 md:w-16 md:h-28 overflow-hidden rounded-t-[50px] bg-white shadow-xl flex flex-col">
                    {/* Image/Texture Area */}
                    <div className="flex-1 w-full bg-gray-200">
                      {pattern.image_url ? (
                        <img
                          src={pattern.image_url}
                          alt={pattern.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-brand-orange" />
                      )}
                    </div>
                    {/* White bottom block */}
                    <div className="h-3 sm:h-4 md:h-5 w-full bg-white flex-shrink-0 border-t border-gray-100" />
                  </div>
                  <span className="mt-2 text-center text-[10px] sm:text-[11px] font-semibold text-brand-cream opacity-80 font-sans leading-tight">
                    {pattern.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:w-[450px] flex-shrink-0 text-left relative z-10">
            <h2 className="font-heading text-6xl md:text-7xl lg:text-[90px] font-bold tracking-tight text-brand-cream uppercase leading-none">
              PATTERNS
            </h2>
            <p className="mt-8 text-sm md:text-base text-white font-sans leading-relaxed text-justify hyphens-auto tracking-wide">
              Every deck is unique. Browse a selection of our premium pattern
              designs and get inspired for your next build. Our patterns are
              precision routed for a perfect finish that elevates the
              aesthetics of any vessel.
            </p>

            <div className="mt-8 flex flex-col items-start">
              <img
                src="/assets/svg/recurso olas, 2 olas.svg"
                alt=""
                className="w-64 opacity-50 mb-6"
              />
              <Link
                to="/estimate"
                className="rounded-lg bg-brand-orange hover:bg-orange-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-105"
              >
                GET THIS DESIGN
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
