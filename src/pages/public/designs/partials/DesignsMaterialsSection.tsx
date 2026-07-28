export function DesignsMaterialsSection() {
  return (
    <div
      id="materials"
      className="scroll-mt-20 mx-auto max-w-[1400px] px-6 lg:px-12 py-20 border-t border-brand-medium/30"
    >
      <div className="text-center mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-brand-orange">
          Engineering
        </span>
        <h2 className="mt-2 font-heading text-3xl font-black tracking-wider text-brand-cream sm:text-4xl">
          MATERIALS & SPECS
        </h2>
        <div className="mx-auto mt-3 h-1 w-10 bg-brand-orange" />
        <p className="mt-4 text-sm text-brand-light max-w-xl mx-auto leading-relaxed">
          Engineered for high performance, maximum comfort, and ultimate
          durability at sea. Learn about our marine-grade raw materials.
        </p>
      </div>

      {/* Materials details layout */}
      <div className="grid gap-10 md:gap-8 grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto mb-16">
        {/* Material 1 */}
        <div className="rounded-3xl border border-brand-medium/40 bg-brand-dark-alt p-8 flex flex-col shadow-lg">
          <div className="h-12 w-12 rounded-2xl bg-brand-medium/40 flex items-center justify-center text-brand-orange font-black text-xl mb-6">
            01
          </div>
          <h3 className="font-heading text-xl font-bold tracking-wider text-brand-cream uppercase">
            EVA/PE Blend Foam
          </h3>
          <p className="mt-4 text-sm text-white/80 leading-relaxed font-sans flex-1">
            Our premium closed-cell EVA (ethylene-vinyl acetate) and PE
            (polyethylene) foam sheet materials provide exceptional non-slip
            traction under extreme wet/dry situations. Soft on bare feet,
            highly shock-absorbent, and dampens vessel vibrations.
          </p>
          <ul className="mt-6 space-y-2 border-t border-brand-medium/30 pt-6 text-xs text-brand-light font-sans">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />{" "}
              Thicknesses: 6mm & 9mm
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />{" "}
              Multi-color dual layers
            </li>
          </ul>
        </div>

        {/* Material 2 */}
        <div className="rounded-3xl border border-brand-medium/40 bg-brand-dark-alt p-8 flex flex-col shadow-lg">
          <div className="h-12 w-12 rounded-2xl bg-brand-medium/40 flex items-center justify-center text-brand-orange font-black text-xl mb-6">
            02
          </div>
          <h3 className="font-heading text-xl font-bold tracking-wider text-brand-cream uppercase">
            Synthetic Teak
          </h3>
          <p className="mt-4 text-sm text-white/80 leading-relaxed font-sans flex-1">
            Replicate the classic warmth of traditional teak timber decks with
            zero maintenance requirements. It does not absorb salt water, rot,
            decay, splinter, or fade, and wipes clean easily from oil spills,
            wine, and fish blood.
          </p>
          <ul className="mt-6 space-y-2 border-t border-brand-medium/30 pt-6 text-xs text-brand-light font-sans">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />{" "}
              Stain & Oil Resistant
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" /> No
              Oiling or Sanding
            </li>
          </ul>
        </div>

        {/* Material 3 */}
        <div className="rounded-3xl border border-brand-medium/40 bg-brand-dark-alt p-8 flex flex-col shadow-lg">
          <div className="h-12 w-12 rounded-2xl bg-brand-medium/40 flex items-center justify-center text-brand-orange font-black text-xl mb-6">
            03
          </div>
          <h3 className="font-heading text-xl font-bold tracking-wider text-brand-cream uppercase">
            3M™ Acrylic Adhesives
          </h3>
          <p className="mt-4 text-sm text-white/80 leading-relaxed font-sans flex-1">
            Every custom decking panel features factory-applied 3M™ Acrylic
            Pressure Sensitive Adhesives (PSA). Formulated to create an
            extremely strong, permanent chemical bond directly to gelcoat,
            painted metal, or clean wood surfaces.
          </p>
          <ul className="mt-6 space-y-2 border-t border-brand-medium/30 pt-6 text-xs text-brand-light font-sans">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />{" "}
              High-Shear strength
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-orange" />{" "}
              Saltwater & Heat Certified
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
