import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { TeamTeaserCard } from "../../components/features/TeamTeaserCard";
import { TeamBioCard } from "../../components/features/TeamBioCard";
import { SEO } from "../../components/ui/SEO";

/**
 * About Page
 * Displays team overview, hero teasers, and detailed bio cards for key leadership.
 */
export default function About() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
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

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="bg-brand-dark text-white font-sans">
      <SEO
        title="Meet Our Team & Leadership | All On Deck"
        description="Discover the team behind All On Deck. Led by Ernesto Alvarez and Roselena Oropesa, we bring precision nautical engineering and CAD design to marine flooring."
      />
      {/* ── HERO SECTION ────────────────────────────────────────── */}
      <div className="mx-auto max-w-[1000px] px-6 lg:px-12 pt-16 pb-20 text-center">
        <h1 className="font-heading text-5xl font-black tracking-widest text-brand-cream uppercase sm:text-6xl lg:text-7xl">
          MEET OUR TEAM
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base italic leading-relaxed text-brand-light">
          A dedicated team with one shared goal: perfection in every detail.
          Discover the crew that makes it all happen.
        </p>

        {/* Hero Teaser Cards Grid */}
        <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-16 sm:gap-10 max-w-[800px] mx-auto">
          {/* Teaser 1: Ernesto Alvarez */}
          <TeamTeaserCard
            name="Ernesto Alvarez"
            role="PRESIDENT."
            imageSrc="/assets/images/8.jpeg"
            bioSectionId="ernesto-bio"
            whatsappUrl="https://wa.me/18005550199"
            email="ernesto@allondeck.com"
            wavePosition="left"
            buttonClassName="bg-brand-cream text-[#05586d] hover:bg-white"
            onViewBioClick={scrollToSection}
          />

          {/* Teaser 2: Roselena Oropesa */}
          <TeamTeaserCard
            name="Mng. Roselena Oropesa"
            role="VICE PRESIDENT."
            imageSrc="/assets/images/6.jpeg"
            bioSectionId="roselena-bio"
            whatsappUrl="https://wa.me/18005550198"
            email="roselena@allondeck.com"
            wavePosition="right"
            buttonClassName="bg-brand-orange text-brand-cream hover:bg-orange-600"
            onViewBioClick={scrollToSection}
          />
        </div>
      </div>

      {/* ── TEAM CARDS SECTION ────────────────── */}
      <div className="mx-auto max-w-[900px] px-6 lg:px-12 pb-24">
        <div className="flex flex-col gap-36 md:gap-32">
          {/* Card 1: Ernesto Alvarez */}
          <TeamBioCard
            id="ernesto-bio"
            name="Ernesto Alvarez"
            role="PRESIDENT."
            imageSrc="/assets/images/8.jpeg"
            bioText="A strategist with a vision for nautical innovation. He leads the expansion of All On Deck and ensures that every project combines cutting-edge materials with the highest standards of safety and comfort at sea."
            whatsappUrl="https://wa.me/18005550199"
            email="ernesto@allondeck.com"
          />

          {/* Card 2: Roselena Oropesa */}
          <TeamBioCard
            id="roselena-bio"
            name="Roselena Oropesa"
            role="VICE PRESIDENT."
            imageSrc="/assets/images/6.jpeg"
            bioText="Responsible for process optimization and technical precision. She oversees digital measurement and computer aided design, ensuring efficient workflows that result in millimeter-precise, high-end finishes."
            whatsappUrl="https://wa.me/18005550198"
            email="roselena@allondeck.com"
          />
        </div>
      </div>

      {/* ── CRAFTED WITH PRECISION BANNER ──────────────────────── */}
      <div className="bg-brand-dark-alt border-t border-brand-medium/35 py-16 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/assets/svg/recurso olas, 1 ola.svg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
          <h2 className="font-heading text-2xl font-black tracking-wider sm:text-4xl text-brand-cream">
            CRAFTED WITH PRECISION
          </h2>
          <p className="mt-4 text-sm md:text-base text-brand-light leading-relaxed font-sans">
            All On Deck sets the standard in marine deck fabrication, combining
            state of the art CAD modeling with hands-on nautical engineering
            expertise in Florida.
          </p>
          <div className="mt-8">
            <Link
              to="/services"
              className="inline-block rounded-full bg-brand-orange hover:bg-orange-600 px-8 py-3 text-xs font-bold uppercase tracking-wider text-white transition-transform hover:scale-105 shadow-md"
            >
              See Our Work
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
