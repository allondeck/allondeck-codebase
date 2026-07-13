import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function scrollToBio(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function About() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="bg-[#044155] text-white font-sans">
      {/* ── HEADER SECTION ────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 text-center pt-16 pb-16">
        <h1 className="font-heading text-5xl font-black tracking-widest text-[#f6ebd4] uppercase sm:text-6xl lg:text-7xl">
          MEET OUR TEAM
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base italic leading-relaxed text-[#76abbf]">
          A dedicated team with one shared goal: perfection in every detail.
          Discover the crew that makes it all happen.
        </p>
      </div>

      {/* ── TEASER CARDS MATCHING DESIGN SCREENSHOT ────────────────── */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 pb-24">
        <div className="grid gap-12 grid-cols-1 md:grid-cols-2">

          {/* Card 1: Ernesto Alvarez */}
          <div className="flex flex-col text-left">
            <div className="relative">
              {/* Photo Box */}
              <div className="aspect-[4/5] w-full overflow-hidden rounded-3xl border border-[#066175]/35 bg-[#052631] shadow-lg">
                <img
                  src="/assets/images/8.jpeg"
                  alt="Ernesto Alvarez"
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Overlay Wave Decor on Bottom-Left */}
              <div className="absolute -bottom-4 -left-4 w-32 h-10 pointer-events-none opacity-80">
                <img src="/assets/svg/recurso olas, 2 olas.svg" alt="" className="w-full h-full object-contain" />
              </div>
            </div>
            {/* Meta Text */}
            <div className="mt-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#76abbf]">
                PRESIDENT.
              </span>
              <h2 className="mt-1 font-heading text-xl font-black tracking-wider text-[#f6ebd4] uppercase leading-tight">
                Ernesto Alvarez
              </h2>
            </div>
            {/* Action Row */}
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToBio("bio-ernesto")}
                className="inline-flex items-center justify-center rounded-full bg-[#f6ebd4] hover:bg-white px-8 py-3 text-xs font-black uppercase tracking-wider text-[#044155] shadow-md transition-all hover:scale-105 leading-none"
              >
                View Bio
              </button>
              
              {/* Phone Icon */}
              <a
                href="tel:+18005550199"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e38622] text-[#044155] hover:bg-orange-600 hover:text-white transition-all hover:scale-105"
                aria-label="Phone"
              >
                <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </a>

              {/* Email Icon */}
              <a
                href="mailto:ernesto@allondeck.com"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e38622] text-[#044155] hover:bg-orange-600 hover:text-white transition-all hover:scale-105"
                aria-label="Email"
              >
                <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Card 2: Roselena Oropesa */}
          <div className="flex flex-col text-left">
            <div className="relative">
              {/* Photo Box */}
              <div className="aspect-[4/5] w-full overflow-hidden rounded-3xl border border-[#066175]/35 bg-[#052631] shadow-lg">
                <img
                  src="/assets/images/6.jpeg"
                  alt="Roselena Oropesa"
                  className="h-full w-full object-cover"
                />
              </div>
              {/* Overlay Wave Decor on Bottom-Right */}
              <div className="absolute -bottom-4 -right-4 w-32 h-10 pointer-events-none opacity-80">
                <img src="/assets/svg/recurso olas, 2 olas.svg" alt="" className="w-full h-full object-contain scale-x-[-1]" />
              </div>
            </div>
            {/* Meta Text */}
            <div className="mt-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#76abbf]">
                VICE PRESIDENT.
              </span>
              <h2 className="mt-1 font-heading text-xl font-black tracking-wider text-[#f6ebd4] uppercase leading-tight">
                Mng. Roselena Oropesa
              </h2>
            </div>
            {/* Action Row */}
            <div className="mt-5 flex items-center gap-3">
              <button
                type="button"
                onClick={() => scrollToBio("bio-roselena")}
                className="inline-flex items-center justify-center rounded-full bg-[#e38622] hover:bg-orange-600 px-8 py-3 text-xs font-black uppercase tracking-wider text-white shadow-md transition-all hover:scale-105 leading-none"
              >
                View Bio
              </button>
              
              {/* Phone Icon */}
              <a
                href="tel:+18005550198"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e38622] text-[#044155] hover:bg-orange-600 hover:text-white transition-all hover:scale-105"
                aria-label="Phone"
              >
                <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
              </a>

              {/* Email Icon */}
              <a
                href="mailto:roselena@allondeck.com"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#e38622] text-[#044155] hover:bg-orange-600 hover:text-white transition-all hover:scale-105"
                aria-label="Email"
              >
                <svg className="h-4.5 w-4.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ── ERNESTO BIO SECTION ────────────────────────────────── */}
      <div
        id="bio-ernesto"
        className="scroll-mt-24 bg-[#066175] py-20 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <img src="/assets/svg/recurso olas, 1 ola.svg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="grid gap-12 grid-cols-1 md:grid-cols-2 items-center">
            <div className="overflow-hidden rounded-3xl shadow-xl border border-[#044155]/30 aspect-square max-w-sm mx-auto w-full">
              <img
                src="/assets/images/8.jpeg"
                alt="Ernesto Alvarez"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#f6ebd4]/70">
                Meet our team
              </span>
              <h2 className="mt-2 font-heading text-3xl font-black tracking-wider text-[#f6ebd4] sm:text-4xl uppercase">
                President. Ernesto Alvarez
              </h2>
              <div className="mt-4 h-1 w-12 bg-[#e38622]" />
              <p className="mt-6 text-base leading-relaxed text-white/90 font-sans">
                A strategist with a vision for nautical innovation. He leads the expansion of All On Deck and ensures that every project combines cutting-edge materials with the highest standards of safety and comfort at sea.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── ROSELENA BIO SECTION ───────────────────────────────── */}
      <div
        id="bio-roselena"
        className="scroll-mt-24 bg-[#044155] py-20 relative overflow-hidden border-t border-[#066175]/30"
      >
        <div className="absolute inset-0 opacity-10">
          <img src="/assets/svg/recurso olas, 2 olas.svg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="grid gap-12 grid-cols-1 md:grid-cols-2 items-center">
            <div className="md:order-last overflow-hidden rounded-3xl shadow-xl border border-[#066175]/30 aspect-square max-w-sm mx-auto w-full">
              <img
                src="/assets/images/6.jpeg"
                alt="Roselena Oropesa"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#f6ebd4]/70">
                Meet our team
              </span>
              <h2 className="mt-2 font-heading text-3xl font-black tracking-wider text-[#f6ebd4] sm:text-4xl uppercase">
                Vice President. Roselena Oropesa
              </h2>
              <div className="mt-4 h-1 w-12 bg-[#e38622]" />
              <p className="mt-6 text-base leading-relaxed text-white/90 font-sans">
                Responsible for process optimization and technical precision. She oversees digital measurement and computer aided design, ensuring efficient workflows that result in millimeter-precise, high-end finishes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── CRAFTED WITH PRECISION BANNER ──────────────────────── */}
      <div className="bg-[#052631] border-t border-[#066175]/35 py-16 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img src="/assets/svg/recurso olas, 1 ola.svg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
          <h2 className="font-heading text-2xl font-black tracking-wider sm:text-4xl text-[#f6ebd4]">
            CRAFTED WITH PRECISION
          </h2>
          <p className="mt-4 text-sm md:text-base text-[#76abbf] leading-relaxed font-sans">
            All On Deck sets the standard in marine deck fabrication, combining state of the art CAD modeling with hands-on nautical engineering expertise in Florida.
          </p>
          <div className="mt-8">
            <Link
              to="/services"
              className="inline-block rounded-full bg-[#e38622] hover:bg-orange-600 px-8 py-3 text-xs font-bold uppercase tracking-wider text-white transition-transform hover:scale-105 shadow-md"
            >
              See Our Work
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

