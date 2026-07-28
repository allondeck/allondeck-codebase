import { SEO } from "../../../components/ui/SEO";
import { EstimateHeroSection } from "./partials/EstimateHeroSection";
import { EstimateFormSection } from "./partials/EstimateFormSection";

export default function Estimate() {
  return (
    <div className="bg-brand-dark text-white font-sans py-12 md:py-16 min-h-screen">
      <SEO
        title="Get a Free Estimate | All On Deck"
        description="Request a free quote for custom marine deck flooring. Tell us about your boat model, length, and design vision and our crew will reach out."
      />
      <EstimateHeroSection />
      <EstimateFormSection />
    </div>
  );
}
