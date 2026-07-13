import { Link } from "react-router-dom";

// ─── Data ─────────────────────────────────────────────────────────────────────
const BOAT_DESIGNS = [
  {
    id: 1,
    label: "TEAK CLASSIC",
    tag: "Most Popular",
    image: "/assets/images/2.jpg",
  },
  {
    id: 2,
    label: "CARBON WEAVE",
    tag: "Premium",
    image: "/assets/images/3.jpg",
  },
  {
    id: 3,
    label: "ARCTIC WHITE",
    tag: "Clean Look",
    image: "/assets/images/4.jpg",
  },
  {
    id: 4,
    label: "NAVY STRIPE",
    tag: "Custom",
    image: "/assets/images/5.jpg",
  },
  {
    id: 5,
    label: "CORAL DRIFT",
    tag: "Trending",
    image: "/assets/images/10.jpg",
  },
  {
    id: 6,
    label: "EBONY MARINE",
    tag: "Bold",
    image: "/assets/images/11.jpg",
  },
];

const COLOR_SWATCHES = [
  { name: "Classic Teak",    hex: "#c19a6b" },
  { name: "Arctic White",    hex: "#f5f5f0" },
  { name: "Carbon Black",    hex: "#1a1a1a" },
  { name: "Ocean Navy",      hex: "#1b3a6b" },
  { name: "Coral Drift",     hex: "#d4704a" },
  { name: "Desert Sand",     hex: "#c2a06e" },
  { name: "Slate Grey",      hex: "#5a6475" },
  { name: "Ivory Pearl",     hex: "#ede8d9" },
  { name: "Deep Ebony",      hex: "#2c1810" },
  { name: "Sea Foam",        hex: "#4a9e8b" },
  { name: "Driftwood",       hex: "#8b7355" },
  { name: "Marine Blue",     hex: "#044155" },
];


function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Designs() {
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
            <div className="relative rounded-3xl border border-[#066175] bg-[#052631] p-5 pb-20 overflow-hidden flex flex-col h-full shadow-lg hover:shadow-xl transition-all">
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
            <div className="relative rounded-3xl border border-[#066175] bg-[#052631] p-5 pb-20 overflow-hidden flex flex-col h-full shadow-lg hover:shadow-xl transition-all">
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
                  <img src="/assets/svg/recurso olas, 2 olas.svg" alt="" className="w-full h-8 object-cover" />
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
            <div className="relative rounded-3xl border border-[#066175] bg-[#052631] p-5 pb-20 overflow-hidden flex flex-col h-full shadow-lg hover:shadow-xl transition-all">
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
                  <img src="/assets/svg/recurso olas, 2 olas.svg" alt="" className="w-full h-8 object-cover" />
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
      <div id="gallery" className="scroll-mt-20 mx-auto max-w-[1400px] px-6 lg:px-12 py-20 border-t border-[#066175]/30">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#e38622]">
            Patterns
          </span>
          <h2 className="mt-2 font-heading text-3xl font-black tracking-wider text-[#f6ebd4] sm:text-4xl">
            BOAT DESIGNS
          </h2>
          <div className="mx-auto mt-3 h-1 w-10 bg-[#e38622]" />
          <p className="mt-4 text-sm text-[#76abbf] max-w-xl mx-auto leading-relaxed">
            Every deck is unique. Browse a selection of our completed projects and
            get inspired for your next build.
          </p>
        </div>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {BOAT_DESIGNS.map((design) => (
            <div
              key={design.id}
              className="group relative overflow-hidden rounded-2xl border border-[#066175]/30 bg-[#052631] shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 aspect-[4/3]"
            >
              <img
                src={design.image}
                alt={design.label}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#033040]/90 via-[#033040]/20 to-transparent" />

              {/* Tag */}
              <span className="absolute top-3 right-3 rounded-full bg-[#e38622] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow">
                {design.tag}
              </span>

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-heading text-lg font-black tracking-wider text-[#f6ebd4]">
                  {design.label}
                </h3>
                <Link
                  to="/estimate"
                  className="mt-2 inline-block text-xs font-bold uppercase tracking-wider text-[#e38622] hover:text-orange-400 transition-colors font-sans"
                >
                  Get this design →
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-[#76abbf] mb-4">
            Don't see what you're looking for? We do fully custom builds.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-full bg-[#e38622] hover:bg-orange-600 px-10 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-105 shadow-lg leading-none"
          >
            Request Custom Design
          </Link>
        </div>
      </div>

      {/* ── COLOR PALETTE (COLORS) ───────────────────────────────────────── */}
      <div id="colors" className="scroll-mt-20 bg-[#052631] border-t border-[#066175]/30 py-20">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="text-center mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-[#e38622]">
              Palette
            </span>
            <h2 className="mt-2 font-heading text-3xl font-black tracking-wider text-[#f6ebd4] sm:text-4xl">
              COLORS
            </h2>
            <div className="mx-auto mt-3 h-1 w-10 bg-[#e38622]" />
            <p className="mt-4 text-sm text-[#76abbf] max-w-xl mx-auto leading-relaxed">
              Our marine-grade color range. Each pigment is formulated to resist
              UV fading, saltwater, and extreme temperatures.
            </p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {COLOR_SWATCHES.map((swatch) => (
              <div
                key={swatch.name}
                className="group flex flex-col items-center gap-2 cursor-pointer"
              >
                <div
                  className="h-16 w-16 rounded-full border-2 border-[#066175]/40 shadow-lg ring-2 ring-transparent group-hover:ring-[#e38622] transition-all duration-200"
                  style={{ backgroundColor: swatch.hex }}
                />
                <span className="text-center text-[11px] font-semibold text-[#f6ebd4]/80 leading-tight group-hover:text-[#f6ebd4] transition-colors font-sans">
                  {swatch.name}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-[#76abbf] mb-4">
              Need a custom color match? We can match any RAL or Pantone code.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-full border-2 border-[#e38622] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-[#e38622] hover:bg-[#e38622] hover:text-white transition-all leading-none"
            >
              Match My Color
            </Link>
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

