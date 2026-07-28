import { Link } from "react-router-dom";

export function DesignsCustomBannerSection() {
  return (
    <div className="relative overflow-hidden bg-brand-dark border-t border-brand-medium/30 py-20">
      <div className="absolute inset-0 opacity-10">
        <img
          src="/assets/svg/recurso olas, 1 ola.svg"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12 text-center">
        <span className="inline-block rounded-full bg-brand-orange/20 border border-brand-orange/40 px-4 py-1 text-xs font-bold uppercase tracking-widest text-brand-orange mb-4">
          No Additional Cost
        </span>
        <h2 className="font-heading text-3xl font-black tracking-wider text-brand-cream sm:text-4xl">
          CUSTOM DESIGN
        </h2>
        <p className="mt-4 text-base text-brand-light leading-relaxed">
          Every order includes custom design consultation at no extra charge.
          Our team will work with you to achieve the perfect look for your
          boat.
        </p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center rounded-full bg-brand-orange hover:bg-orange-600 px-10 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-105 shadow-lg leading-none"
          >
            Get It — Free
          </Link>
          <Link
            to="/services"
            className="inline-flex items-center justify-center rounded-full border-2 border-brand-cream/40 px-10 py-3.5 text-sm font-bold uppercase tracking-wider text-brand-cream/80 hover:border-brand-cream hover:text-white transition-all leading-none"
          >
            See Services
          </Link>
        </div>
      </div>
    </div>
  );
}
