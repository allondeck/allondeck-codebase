import { useState } from "react";
import { WaveButton } from "../../../../components/ui/WaveButton";

export type DesignColor = {
  id: string;
  name: string;
  hex_color: string | null;
  image_url: string | null;
};

interface DesignsColorsSectionProps {
  colors: DesignColor[];
}

const DEFAULT_COLORS: DesignColor[] = [
  {
    id: "c1",
    name: "Classic Teak",
    hex_color: "#c19a6b",
    image_url: "/assets/images/2.jpg",
  },
  {
    id: "c2",
    name: "Arctic White",
    hex_color: "#f5f5f0",
    image_url: "/assets/images/4.jpg",
  },
  {
    id: "c3",
    name: "Carbon Black",
    hex_color: "#1a1a1a",
    image_url: "/assets/images/3.jpg",
  },
  {
    id: "c4",
    name: "Ocean Navy",
    hex_color: "#1b3a6b",
    image_url: "/assets/images/5.jpg",
  },
  {
    id: "c5",
    name: "Coral Drift",
    hex_color: "#d4704a",
    image_url: "/assets/images/10.jpg",
  },
  {
    id: "c6",
    name: "Desert Sand",
    hex_color: "#c2a06e",
    image_url: "/assets/images/1.jpg",
  },
  {
    id: "c7",
    name: "Slate Grey",
    hex_color: "#5a6475",
    image_url: "/assets/images/11.jpg",
  },
  {
    id: "c8",
    name: "Ivory Pearl",
    hex_color: "#ede8d9",
    image_url: "/assets/images/4.jpg",
  },
  {
    id: "c9",
    name: "Deep Ebony",
    hex_color: "#2c1810",
    image_url: "/assets/images/3.jpg",
  },
  {
    id: "c10",
    name: "Sea Foam",
    hex_color: "#4a9e8b",
    image_url: "/assets/images/5.2.jpg",
  },
  {
    id: "c11",
    name: "Driftwood",
    hex_color: "#8b7355",
    image_url: "/assets/images/2.jpg",
  },
  {
    id: "c12",
    name: "Marine Blue",
    hex_color: "#044155",
    image_url: "/assets/images/1.jpg",
  },
];

export function DesignsColorsSection({ colors }: DesignsColorsSectionProps) {
  const displayColors = colors && colors.length > 0 ? colors : DEFAULT_COLORS;
  const [activeColorId, setActiveColorId] = useState<string | null>(null);
  const [hoveredColorId, setHoveredColorId] = useState<string | null>(null);

  return (
    <div
      id="colors"
      className="scroll-mt-20 border-t border-brand-medium/30 bg-[#0C5A6D] pt-8 md:pt-24 pb-[104px] relative overflow-visible"
    >
      <div className="mx-auto max-w-content px-6 lg:px-12">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-0">
          {/* Color Swatch Grid */}
          <div className="w-full lg:w-[55%] relative z-10">
            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-x-3 sm:gap-x-4 md:gap-x-5 gap-y-6 sm:gap-y-8 items-start justify-items-center">
              {displayColors.map((color, index) => {
                const isSelected = activeColorId === color.id;
                const isHovered = hoveredColorId === color.id;
                const isLoupeVisible = isHovered || isSelected;

                return (
                  <div
                    key={color.id || `color-${index}`}
                    className="relative flex flex-col items-center"
                    onMouseEnter={() => setHoveredColorId(color.id)}
                    onMouseLeave={() => setHoveredColorId(null)}
                  >
                    {/* Interactive Swatch Pill/Card (Matching Illustrator Mockup) */}
                    <button
                      type="button"
                      onClick={() =>
                        setActiveColorId(
                          activeColorId === color.id ? null : color.id,
                        )
                      }
                      className={`group relative flex flex-col items-center focus:outline-none transition-all duration-300 ${
                        isLoupeVisible
                          ? "scale-105 -translate-y-1 z-30"
                          : "hover:scale-105 hover:-translate-y-1 z-10"
                      }`}
                      aria-label={`Inspect ${color.name} color and texture`}
                    >
                      {/* 1. Top Textured Circle */}
                      <div
                        className={`relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden shadow-lg border-2 z-10 transition-all duration-300 ${
                          isLoupeVisible
                            ? "border-brand-orange ring-2 ring-brand-orange/60 shadow-orange-500/20"
                            : "border-white/30 group-hover:border-white/70"
                        }`}
                        style={{
                          backgroundColor: color.hex_color || "#c19a6b",
                        }}
                      >
                        {/* High-res Foam Texture Overlay */}
                        <img
                          src={color.image_url || "/assets/images/3.jpg"}
                          alt={color.name}
                          loading="lazy"
                          decoding="async"
                          className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-85 contrast-125 pointer-events-none"
                        />
                        {/* 3D Curved Light Reflection */}
                        <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/30 via-transparent to-black/35 pointer-events-none" />
                      </div>

                      {/* 2. Flat Color Plane & 3. White Name Box */}
                      <div className="flex flex-col items-center -mt-5 sm:-mt-6 md:-mt-7 z-0 w-10 sm:w-11 md:w-13">
                        {/* Plano de color debajo */}
                        <div
                          className="w-full h-8 sm:h-9 md:h-10 transition-colors shadow-inner"
                          style={{
                            backgroundColor: color.hex_color || "#c19a6b",
                          }}
                        />
                        {/* Plano blanco con el nombre del color */}
                        <div className="w-full h-7 sm:h-8 bg-white flex items-center justify-center px-0.5 rounded-b-md shadow-md border-t border-black/5">
                          <span className="text-[8px] sm:text-[9px] md:text-[10px] font-black text-brand-dark leading-tight text-center uppercase tracking-tighter truncate font-sans">
                            {color.name}
                          </span>
                        </div>
                      </div>
                    </button>

                    {/* 4. Magnifying Loupe (Lupa) Popup */}
                    {isLoupeVisible && (
                      <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex flex-col items-center drop-shadow-2xl animate-in fade-in zoom-in-75 duration-200">
                        {/* Circular Lens */}
                        <div className="relative size-24 sm:size-28 md:size-32 rounded-full border-4 border-white shadow-[0_12px_32px_rgba(0,0,0,0.6)] overflow-hidden bg-brand-dark-alt ring-2 ring-brand-orange">
                          {/* Magnified base color */}
                          <div
                            className="absolute inset-0"
                            style={{
                              backgroundColor: color.hex_color || "#c19a6b",
                            }}
                          />
                          {/* 3.2x Zoomed Texture */}
                          <img
                            src={color.image_url || "/assets/images/3.jpg"}
                            alt={color.name}
                            className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-95 contrast-150 scale-[3.2] origin-center"
                          />
                          {/* Lens Glare Reflection */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/35 to-transparent pointer-events-none" />
                          {/* Lens Vignette */}
                          <div className="absolute inset-0 rounded-full shadow-[inset_0_0_18px_rgba(0,0,0,0.6)] pointer-events-none" />
                          {/* Loupe Focal Reticle */}
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
                            <div className="size-8 rounded-full border border-white/70" />
                          </div>
                        </div>

                        {/* Pointer Arrow */}
                        <div className="w-0 h-0 border-x-[6px] border-x-transparent border-t-[8px] border-t-white -mt-0.5 drop-shadow-sm" />

                        {/* Name Badge */}
                        <div className="mt-1.5 bg-brand-dark/95 backdrop-blur-md px-3 py-1 rounded-full border border-brand-orange/60 shadow-xl flex items-center gap-2">
                          <span
                            className="size-2.5 rounded-full border border-white/60 shrink-0"
                            style={{
                              backgroundColor: color.hex_color || "#c19a6b",
                            }}
                          />
                          <span className="font-heading font-black text-[11px] sm:text-xs text-brand-cream uppercase tracking-wider whitespace-nowrap">
                            {color.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Text Content */}
          <div className="w-full lg:w-[40%] text-left relative z-10">
            <h2 className="font-heading text-4xl md:text-6xl font-black tracking-widest text-brand-cream uppercase leading-none">
              COLORS
            </h2>
            <p className="mt-8 text-sm md:text-base text-white font-sans leading-relaxed text-justify hyphens-auto tracking-wide">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
              nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam
              erat volutpat. Ut wisi enim ad Lorem ipsum dolor sit amet,
              consectetuer adipiscing elit, sed diam nonummy nibh euismod
              tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi
              enim ad minim veniam, quis nostrud exerci tation ullamcorper
              suscipit lobortis nisl ut aliquip
            </p>

            <div className="mt-10 flex justify-start ml-8">
              {/* Mobile */}
              <div className="md:hidden">
                <WaveButton to="/estimate" variant="primary" size="md">
                  MATCH COLOR
                </WaveButton>
              </div>

              {/* Desktop */}
              <div className="hidden md:block">
                <WaveButton to="/estimate" variant="primary" size="lg">
                  MATCH COLOR
                </WaveButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
