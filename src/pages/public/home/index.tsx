import { SEO } from "../../../components/ui/SEO";
import { HeroSection } from "./partials/HeroSection";
import { ServicesSection } from "./partials/ServicesSection";
import { DesignsSection } from "./partials/DesignsSection";
import { EstimateBannerSection } from "./partials/EstimateBannerSection";
import { GallerySection } from "./partials/GallerySection";
import { ShopSection } from "./partials/ShopSection";
import { PromoBannerSection } from "./partials/PromoBannerSection";
import { TeamSection } from "./partials/TeamSection";

export default function Home() {
  return (
    <div className="relative overflow-hidden bg-brand-dark text-white font-sans">
      <SEO
        title="All On Deck | Marine Deck Flooring Solutions"
        description="Your trusted partner in Marine deck flooring solutions. High-durability EVA/PE foam decks, custom CAD designs, and precision CNC cutting in Florida."
      />
      <HeroSection />
      <ServicesSection />
      <EstimateBannerSection />
      <DesignsSection />
      <GallerySection />
      <ShopSection />
      <PromoBannerSection />
      <TeamSection />
    </div>
  );
}
