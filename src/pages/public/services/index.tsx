import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SEO } from "../../../components/ui/SEO";
import { ServicesHeroSection } from "./partials/ServicesHeroSection";
import { CustomDeckDesignsSection } from "./partials/CustomDeckDesignsSection";
import { FloorManufacturingSection } from "./partials/FloorManufacturingSection";
import { CuttingInstallationSection } from "./partials/CuttingInstallationSection";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Services() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        scrollToSection(id);
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="bg-brand-dark text-white font-sans pb-16">
      <SEO
        title="Services & Custom CAD Deck Fabrication | All On Deck"
        description="Custom deck designs, MarineMat EVA/PE foam floor manufacturing, high-precision CNC cutting, and expert installation services for boats across Florida."
      />
      <ServicesHeroSection onActionClick={scrollToSection} />
      <div className="space-y-0">
        <CustomDeckDesignsSection />
        <FloorManufacturingSection />
        <CuttingInstallationSection />
      </div>

      {/* Gallery Showcase Banner */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 mt-16">
        <div className="relative overflow-hidden rounded-3xl border border-brand-medium/40 bg-gradient-to-r from-brand-dark-alt via-brand-dark to-brand-dark-alt p-8 sm:p-12 text-center shadow-2xl">
          <div className="relative z-10 max-w-3xl mx-auto space-y-4">
            <span className="inline-block rounded-full bg-brand-orange/20 border border-brand-orange/40 px-4 py-1 text-xs font-bold uppercase tracking-wider text-brand-orange">
              See Our Work In Action
            </span>
            <h3 className="font-heading text-3xl sm:text-4xl font-bold uppercase tracking-wider text-brand-cream">
              Want to see real boat decking projects?
            </h3>
            <p className="text-sm sm:text-base text-brand-light">
              Browse our complete portfolio featuring custom CAD deck designs, floor manufacturing, and professional boat installations.
            </p>
            <div className="pt-2">
              <a
                href="/gallery"
                className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-brand-orange/80 transition-all transform hover:scale-105"
              >
                Explore Full Gallery →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
