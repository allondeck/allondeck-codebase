import { Link } from "react-router-dom";

export type DesignColor = {
  id: string;
  name: string;
  hex_color: string | null;
  image_url: string | null;
};

interface DesignsColorsSectionProps {
  colors: DesignColor[];
}

export function DesignsColorsSection({ colors }: DesignsColorsSectionProps) {
  return (
    <div
      id="colors"
      className="scroll-mt-20 border-t border-brand-medium/30 bg-[#0C5A6D] py-20 relative overflow-hidden"
    >
      <div className="mx-auto max-w-content px-6 lg:px-12">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
          {/* Color Swatch Grid */}
          <div className="flex-1 w-full relative z-10">
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-x-4 gap-y-6">
              {colors.map((color) => (
                <div
                  key={color.id}
                  className="group flex flex-col items-center"
                >
                  <div className="relative w-12 h-20 sm:w-14 sm:h-24 md:w-16 md:h-28 overflow-hidden rounded-t-[50px] bg-white shadow-xl flex flex-col">
                    {/* Color/Texture Area */}
                    <div
                      className="flex-1 w-full relative"
                      style={{
                        backgroundColor: color.hex_color || "transparent",
                      }}
                    >
                      {color.image_url && (
                        <img
                          src={color.image_url}
                          alt={color.name}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90"
                        />
                      )}
                    </div>
                    {/* White bottom block */}
                    <div className="h-3 sm:h-4 md:h-5 w-full bg-white flex-shrink-0 border-t border-gray-100" />
                  </div>
                  <span className="mt-2 text-center text-[10px] sm:text-[11px] font-semibold text-brand-cream opacity-80 font-sans leading-tight">
                    {color.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:w-[450px] flex-shrink-0 text-left relative z-10">
            <h2 className="font-heading text-6xl md:text-7xl lg:text-[90px] font-bold tracking-tight text-brand-cream uppercase leading-none">
              COLORS
            </h2>
            <p className="mt-8 text-sm md:text-base text-white font-sans leading-relaxed text-justify hyphens-auto tracking-wide">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
              diam nonummy nibh euismod tincidunt ut laoreet dolore magna
              aliquam erat volutpat. Ut wisi enim ad Lorem ipsum dolor sit
              amet, consectetuer adipiscing elit, sed diam nonummy nibh
              euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
              Ut wisi enim ad minim veniam, quis nostrud exerci tation
              ullamcorper suscipit lobortis nisl ut aliquip
            </p>

            <div className="mt-8 flex flex-col items-start">
              <img
                src="/assets/svg/recurso olas, 2 olas.svg"
                alt=""
                loading="lazy"
                decoding="async"
                className="w-64 opacity-50 mb-6"
              />
              <Link
                to="/estimate"
                className="rounded-lg bg-brand-orange hover:bg-orange-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-105"
              >
                MATCH COLOR
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
