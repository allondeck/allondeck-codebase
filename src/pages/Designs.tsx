import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export type DesignColor = {
  id: string;
  name: string;
  hex_color: string | null;
  image_url: string | null;
};

export type DesignPattern = {
  id: string;
  name: string;
  image_url: string | null;
};

export default function Designs() {
  const [colors, setColors] = useState<DesignColor[]>([]);
  const [patterns, setPatterns] = useState<DesignPattern[]>([]);

  useEffect(() => {
    async function loadData() {
      const [colorsRes, patternsRes] = await Promise.all([
        supabase.from("design_colors" as any).select("*").order("created_at"),
        supabase.from("design_patterns" as any).select("*").order("created_at")
      ]);
      if (colorsRes.data) setColors(colorsRes.data as any);
      if (patternsRes.data) setPatterns(patternsRes.data as any);
    }
    loadData();
  }, []);
  return (
    <div className="bg-[#044155] text-white font-sans">

      {/* ── HERO SECTION MATCHING DESIGN SCREENSHOT ────────────────── */}
      <div className="relative overflow-hidden pt-16 pb-24">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/assets/svg/recurso olas, 2 olas.svg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12 text-center">
          <h1 className="font-heading text-5xl font-black tracking-widest text-[#f6ebd4] uppercase sm:text-6xl lg:text-7xl">
            DESIGNS
          </h1>

          {/* 3-Card Grid */}
          <div className="mt-16 grid gap-8 grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto text-left">
            
            {/* Card 1: Colors */}
            <div className="relative rounded-3xl border border-[#066175] bg-[#052631] p-5 pb-20 overflow-hidden flex flex-col h-full shadow-lg">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl">
                <img
                  src="/assets/images/5.2.jpg"
                  alt="Colors Palette"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-6 text-center font-heading text-2xl font-bold tracking-wider text-[#f6ebd4] uppercase">
                COLORS
              </h3>
              
              {/* Wave & Button overlay */}
              <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-4 h-24">
                {/* Wave decor */}
                <div className="absolute bottom-6 left-0 right-0 opacity-40 px-2 pointer-events-none">
                  <img src="/assets/svg/recurso olas, 2 olas.svg" alt="" className="w-full h-8 object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => scrollToSection("colors")}
                  className="relative z-10 rounded-lg bg-[#e38622] hover:bg-orange-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-transform hover:scale-105"
                >
                  SEE MORE
                </button>
              </div>
            </div>

            {/* Card 2: Patterns */}
            <div className="relative rounded-3xl border border-[#066175] bg-[#052631] p-5 pb-20 overflow-hidden flex flex-col h-full shadow-lg">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl">
                <img
                  src="/assets/images/1.jpg"
                  alt="Designs Patterns"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-6 text-center font-heading text-2xl font-bold tracking-wider text-[#f6ebd4] uppercase">
                PATTERNS
              </h3>
              
              {/* Wave & Button overlay */}
              <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-4 h-24">
                {/* Wave decor */}
                <div className="absolute bottom-6 left-0 right-0 opacity-40 px-2 pointer-events-none">
                  <svg viewBox="0 0 200 32" preserveAspectRatio="none" className="w-full h-8" xmlns="http://www.w3.org/2000/svg">
                    <path fill="white" d="M0,16 C50,28 100,4 150,16 C175,22 190,10 200,16 L200,32 L0,32 Z" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => scrollToSection("gallery")}
                  className="relative z-10 rounded-lg bg-[#e38622] hover:bg-orange-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-transform hover:scale-105"
                >
                  SEE MORE
                </button>
              </div>
            </div>

            {/* Card 3: Materials */}
            <div className="relative rounded-3xl border border-[#066175] bg-[#052631] p-5 pb-20 overflow-hidden flex flex-col h-full shadow-lg">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl">
                <img
                  src="/assets/images/9.jpg"
                  alt="Materials Close-up"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-6 text-center font-heading text-2xl font-bold tracking-wider text-[#f6ebd4] uppercase">
                MATERIALS
              </h3>
              
              {/* Wave & Button overlay */}
              <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-4 h-24">
                {/* Wave decor */}
                <div className="absolute bottom-6 left-0 right-0 opacity-40 px-2 pointer-events-none">
                  <svg viewBox="0 0 200 32" preserveAspectRatio="none" className="w-full h-8" xmlns="http://www.w3.org/2000/svg">
                    <path fill="white" d="M0,16 C50,28 100,4 150,16 C175,22 190,10 200,16 L200,32 L0,32 Z" />
                  </svg>
                </div>
                <button
                  type="button"
                  onClick={() => scrollToSection("materials")}
                  className="relative z-10 rounded-lg bg-[#e38622] hover:bg-orange-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-transform hover:scale-105"
                >
                  SEE MORE
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── DESIGN GALLERY (PATTERNS) ────────────────────────────────────── */}
      <div id="gallery" className="scroll-mt-20 border-t border-[#066175]/30 bg-[#066175] py-20 relative overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
            {/* Patterns Grid */}
            <div className="flex-1 w-full relative z-10">
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-x-4 gap-y-6">
                {patterns.map((pattern) => (
                  <div key={pattern.id} className="group flex flex-col items-center">
                    <div className="relative w-12 h-20 sm:w-14 sm:h-24 md:w-16 md:h-28 overflow-hidden rounded-t-[50px] bg-white shadow-xl flex flex-col">
                      {/* Image/Texture Area */}
                      <div className="flex-1 w-full bg-gray-200">
                        {pattern.image_url ? (
                          <img src={pattern.image_url} alt={pattern.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-[#e38622]" />
                        )}
                      </div>
                      {/* White bottom block */}
                      <div className="h-3 sm:h-4 md:h-5 w-full bg-white flex-shrink-0 border-t border-gray-100" />
                    </div>
                    <span className="mt-2 text-center text-[10px] sm:text-[11px] font-semibold text-[#f6ebd4] opacity-80 font-sans leading-tight">
                      {pattern.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Text Content */}
            <div className="lg:w-[450px] flex-shrink-0 text-left relative z-10">
              <h2 className="font-heading text-6xl md:text-7xl lg:text-[90px] font-bold tracking-tight text-[#f6ebd4] uppercase leading-none">
                PATTERNS
              </h2>
              <p className="mt-8 text-sm md:text-base text-white font-sans leading-relaxed text-justify hyphens-auto tracking-wide">
                Every deck is unique. Browse a selection of our premium pattern designs
                and get inspired for your next build. Our patterns are precision routed
                for a perfect finish that elevates the aesthetics of any vessel.
              </p>
              
              <div className="mt-8 flex flex-col items-start">
                <img src="/assets/svg/recurso olas, 2 olas.svg" alt="" className="w-64 opacity-50 mb-6" />
                <Link
                  to="/estimate"
                  className="rounded-lg bg-[#e38622] hover:bg-orange-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-105"
                >
                  GET THIS DESIGN
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── COLOR PALETTE (COLORS) ───────────────────────────────────────── */}
      <div id="colors" className="scroll-mt-20 border-t border-[#066175]/30 bg-[#0C5A6D] py-20 relative overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">
            {/* Color Swatch Grid */}
            <div className="flex-1 w-full relative z-10">
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-x-4 gap-y-6">
                {colors.map((color) => (
                  <div key={color.id} className="group flex flex-col items-center">
                    <div className="relative w-12 h-20 sm:w-14 sm:h-24 md:w-16 md:h-28 overflow-hidden rounded-t-[50px] bg-white shadow-xl flex flex-col">
                      {/* Color/Texture Area */}
                      <div 
                        className="flex-1 w-full relative"
                        style={{ backgroundColor: color.hex_color || 'transparent' }}
                      >
                        {color.image_url && (
                          <img src={color.image_url} alt={color.name} className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-90" />
                        )}
                      </div>
                      {/* White bottom block */}
                      <div className="h-3 sm:h-4 md:h-5 w-full bg-white flex-shrink-0 border-t border-gray-100" />
                    </div>
                    <span className="mt-2 text-center text-[10px] sm:text-[11px] font-semibold text-[#f6ebd4] opacity-80 font-sans leading-tight">
                      {color.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Text Content */}
            <div className="lg:w-[450px] flex-shrink-0 text-left relative z-10">
              <h2 className="font-heading text-6xl md:text-7xl lg:text-[90px] font-bold tracking-tight text-[#f6ebd4] uppercase leading-none">
                COLORS
              </h2>
              <p className="mt-8 text-sm md:text-base text-white font-sans leading-relaxed text-justify hyphens-auto tracking-wide">
                Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy
                nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi
                enim ad Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
                nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.
                Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit
                lobortis nisl ut aliquip
              </p>
              
              <div className="mt-8 flex flex-col items-start">
                <img src="/assets/svg/recurso olas, 2 olas.svg" alt="" className="w-64 opacity-50 mb-6" />
                <Link
                  to="/contact"
                  className="rounded-lg bg-[#e38622] hover:bg-orange-500 px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-105"
                >
                  MATCH COLOR
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── IMPROVISED MATERIALS SECTION ─────────────────────────────────── */}
      <div id="materials" className="scroll-mt-20 mx-auto max-w-[1400px] px-6 lg:px-12 py-20 border-t border-[#066175]/30">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#e38622]">
            Engineering
          </span>
          <h2 className="mt-2 font-heading text-3xl font-black tracking-wider text-[#f6ebd4] sm:text-4xl">
            MATERIALS & SPECS
          </h2>
          <div className="mx-auto mt-3 h-1 w-10 bg-[#e38622]" />
          <p className="mt-4 text-sm text-[#76abbf] max-w-xl mx-auto leading-relaxed">
            Engineered for high performance, maximum comfort, and ultimate durability at sea. Learn about our marine-grade raw materials.
          </p>
        </div>

        {/* Materials details layout */}
        <div className="grid gap-10 md:gap-8 grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto mb-16">
          {/* Material 1 */}
          <div className="rounded-3xl border border-[#066175]/40 bg-[#052631] p-8 flex flex-col shadow-lg">
            <div className="h-12 w-12 rounded-2xl bg-[#066175]/40 flex items-center justify-center text-[#e38622] font-black text-xl mb-6">
              01
            </div>
            <h3 className="font-heading text-xl font-bold tracking-wider text-[#f6ebd4] uppercase">
              EVA/PE Blend Foam
            </h3>
            <p className="mt-4 text-sm text-white/80 leading-relaxed font-sans flex-1">
              Our premium closed-cell EVA (ethylene-vinyl acetate) and PE (polyethylene) foam sheet materials provide exceptional non-slip traction under extreme wet/dry situations. Soft on bare feet, highly shock-absorbent, and dampens vessel vibrations.
            </p>
            <ul className="mt-6 space-y-2 border-t border-[#066175]/30 pt-6 text-xs text-[#76abbf] font-sans">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e38622]" /> Thicknesses: 6mm & 9mm
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e38622]" /> Multi-color dual layers
              </li>
            </ul>
          </div>

          {/* Material 2 */}
          <div className="rounded-3xl border border-[#066175]/40 bg-[#052631] p-8 flex flex-col shadow-lg">
            <div className="h-12 w-12 rounded-2xl bg-[#066175]/40 flex items-center justify-center text-[#e38622] font-black text-xl mb-6">
              02
            </div>
            <h3 className="font-heading text-xl font-bold tracking-wider text-[#f6ebd4] uppercase">
              Synthetic Teak
            </h3>
            <p className="mt-4 text-sm text-white/80 leading-relaxed font-sans flex-1">
              Replicate the classic warmth of traditional teak timber decks with zero maintenance requirements. It does not absorb salt water, rot, decay, splinter, or fade, and wipes clean easily from oil spills, wine, and fish blood.
            </p>
            <ul className="mt-6 space-y-2 border-t border-[#066175]/30 pt-6 text-xs text-[#76abbf] font-sans">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e38622]" /> Stain & Oil Resistant
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e38622]" /> No Oiling or Sanding
              </li>
            </ul>
          </div>

          {/* Material 3 */}
          <div className="rounded-3xl border border-[#066175]/40 bg-[#052631] p-8 flex flex-col shadow-lg">
            <div className="h-12 w-12 rounded-2xl bg-[#066175]/40 flex items-center justify-center text-[#e38622] font-black text-xl mb-6">
              03
            </div>
            <h3 className="font-heading text-xl font-bold tracking-wider text-[#f6ebd4] uppercase">
              3M™ Acrylic Adhesives
            </h3>
            <p className="mt-4 text-sm text-white/80 leading-relaxed font-sans flex-1">
              Every custom decking panel features factory-applied 3M™ Acrylic Pressure Sensitive Adhesives (PSA). Formulated to create an extremely strong, permanent chemical bond directly to gelcoat, painted metal, or clean wood surfaces.
            </p>
            <ul className="mt-6 space-y-2 border-t border-[#066175]/30 pt-6 text-xs text-[#76abbf] font-sans">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e38622]" /> High-Shear strength
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e38622]" /> Saltwater & Heat Certified
              </li>
            </ul>
          </div>
        </div>


      </div>

      {/* ── NO ADDITIONAL COST BANNER ─────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-[#044155] border-t border-[#066175]/30 py-20">
        <div className="absolute inset-0 opacity-10">
          <img src="/assets/svg/recurso olas, 1 ola.svg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12 text-center">
          <span className="inline-block rounded-full bg-[#e38622]/20 border border-[#e38622]/40 px-4 py-1 text-xs font-bold uppercase tracking-widest text-[#e38622] mb-4">
            No Additional Cost
          </span>
          <h2 className="font-heading text-3xl font-black tracking-wider text-[#f6ebd4] sm:text-4xl">
            CUSTOM DESIGN
          </h2>
          <p className="mt-4 text-base text-[#76abbf] leading-relaxed">
            Every order includes custom design consultation at no extra charge.
            Our team will work with you to achieve the perfect look for your boat.
          </p>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full bg-[#e38622] hover:bg-orange-600 px-10 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-105 shadow-lg leading-none"
            >
              Get It — Free
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center justify-center rounded-full border-2 border-[#f6ebd4]/40 px-10 py-3.5 text-sm font-bold uppercase tracking-wider text-[#f6ebd4]/80 hover:border-[#f6ebd4] hover:text-white transition-all leading-none"
            >
              See Services
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

