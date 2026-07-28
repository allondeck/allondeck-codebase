import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SEO } from "../../../components/ui/SEO";
import { AboutHeroSection } from "./partials/AboutHeroSection";
import { AboutBioSection } from "./partials/AboutBioSection";
import { AboutPrecisionBannerSection } from "./partials/AboutPrecisionBannerSection";

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
      <AboutHeroSection onViewBioClick={scrollToSection} />
      <AboutBioSection />
      <AboutPrecisionBannerSection />
    </div>
  );
}
