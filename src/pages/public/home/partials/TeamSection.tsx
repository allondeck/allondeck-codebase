import { Link } from "react-router-dom";

export function TeamSection() {
  return (
    <section className="py-20 bg-brand-dark text-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="text-center">
          <h2 className="font-heading text-3xl font-bold tracking-widest text-brand-cream sm:text-4xl">
            MEET OUR TEAM
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base text-brand-cream/80 leading-relaxed font-sans">
            A dedicated team with one shared goal: perfection in every detail.
            Discover the crew that makes it all happen.
          </p>
          <div className="mx-auto mt-3 h-1 w-12 bg-brand-orange" />
        </div>

        <div className="mt-16 grid gap-12 grid-cols-1 md:grid-cols-2 md:mx-auto md:max-w-4xl">
          {/* Team Member 1 */}
          <div className="flex flex-col items-center text-center bg-brand-medium p-8 rounded-3xl border border-brand-light/10 shadow-lg">
            <div className="h-48 w-48 md:h-64 md:w-64 overflow-hidden rounded-full border-4 border-brand-cream shadow-md">
              <img
                src="/assets/images/8.jpeg"
                alt="Ernesto Alvarez"
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="mt-6 font-heading text-xl font-bold tracking-wide text-brand-cream">
              Ernesto alvarez
            </h3>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
              President
            </span>
            <p className="mt-3 max-w-xs text-sm text-brand-cream/80 leading-relaxed font-sans">
              A strategist with a vision for nautical innovation. He leads All
              On Deck's premium service lines.
            </p>
            <Link
              to="/about#bio-ernesto"
              className="mt-4 text-xs font-bold uppercase tracking-wider text-brand-cream/60 hover:text-brand-orange"
            >
              View Bio →
            </Link>
          </div>

          {/* Team Member 2 */}
          <div className="flex flex-col items-center text-center bg-brand-medium p-8 rounded-3xl border border-brand-light/10 shadow-lg">
            <div className="h-48 w-48 md:h-64 md:w-64 overflow-hidden rounded-full border-4 border-brand-cream shadow-md">
              <img
                src="/assets/images/6.jpeg"
                alt="Roselena Oropesa"
                className="h-full w-full object-cover"
              />
            </div>
            <h3 className="mt-6 font-heading text-xl font-bold tracking-wide text-brand-cream">
              Roselena oropesa
            </h3>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
              Vice President
            </span>
            <p className="mt-3 max-w-xs text-sm text-brand-cream/80 leading-relaxed font-sans">
              Process optimizer and digital layout specialist. Ensures
              millimeter-precise product fabrication.
            </p>
            <Link
              to="/about#bio-roselena"
              className="mt-4 text-xs font-bold uppercase tracking-wider text-brand-cream/60 hover:text-brand-orange"
            >
              View Bio →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
