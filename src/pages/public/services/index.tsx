import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SEO } from "../../../components/ui/SEO";
import { ServicesHeroSection } from "./partials/ServicesHeroSection";
import { CustomDeckDesignsSection } from "./partials/CustomDeckDesignsSection";
import { FloorManufacturingSection } from "./partials/FloorManufacturingSection";
import { CuttingInstallationSection } from "./partials/CuttingInstallationSection";
import { ServicesGalleryBannerSection } from "./partials/ServicesGalleryBannerSection";

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

      <ServicesGalleryBannerSection />
    </div>
  );
}
