import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { useServices } from "../../../hooks/useServices";
import { SEO } from "../../../components/ui/SEO";
import { getSupabaseImageTransformUrl } from "../../../lib/imageUtils";
import { WaveButton } from "../../../components/ui/WaveButton";
import { ServicesHeroSection } from "./partials/ServicesHeroSection";
import { ServicesGalleryBannerSection } from "./partials/ServicesGalleryBannerSection";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Services() {
  const location = useLocation();
  const { services, loading } = useServices();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        scrollToSection(id);
      }, 150);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location, loading]);

  return (
    <div className="bg-brand-dark text-white font-sans pb-16">
      <SEO
        title="Services & Custom CAD Deck Fabrication | All On Deck"
        description="Custom deck designs, MarineMat EVA/PE foam floor manufacturing, high-precision CNC cutting, and expert installation services for boats across Florida."
      />
      <ServicesHeroSection
        services={services}
        onActionClick={scrollToSection}
      />

      {/* Alternating Services Sections */}
      <div className="space-y-0">
        {services.map((service, index) => {
          const isOddSection = index % 2 === 1;
          const sectionId = `service-${index + 1}`;

          if (isOddSection) {
            // Style 2: Medium background, image on right, wave background overlay
            return (
              <div
                key={service.id || sectionId}
                id={sectionId}
                className="scroll-mt-20 bg-brand-medium text-white py-20 relative overflow-hidden"
              >
                {/* Wave decoration */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <img
                    src="/assets/svg/recurso olas, 2 olas.svg"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 35 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.65, ease: "easeOut" }}
                  className="relative mx-auto max-w-content px-6 lg:px-12"
                >
                  <div className="grid gap-12 grid-cols-1 md:grid-cols-2 items-center">
                    {/* Image on Right */}
                    <div className="md:order-last overflow-hidden rounded-3xl shadow-xl border border-brand-dark/40 aspect-[4/3] w-full bg-brand-dark">
                      <img
                        src={getSupabaseImageTransformUrl(service.image_url, {
                          width: 800,
                          height: 600,
                          bucket: "store",
                        })}
                        alt={service.title}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Text content on Left */}
                    <div>
                      <h2 className="mt-2 font-heading text-2xl font-black tracking-wider text-brand-cream sm:text-3xl">
                        {service.title}
                      </h2>
                      <p className="mt-6 text-sm md:text-base leading-relaxed text-white font-sans whitespace-pre-line">
                        {service.description}
                      </p>
                      {service.secondary_description && (
                        <p className="mt-4 text-xs md:text-sm leading-relaxed text-brand-light italic font-sans whitespace-pre-line">
                          {service.secondary_description}
                        </p>
                      )}
                      <div className="mt-10 flex justify-start">
                        <WaveButton
                          to={service.cta_link || "/gallery"}
                          variant="primary"
                          size="md"
                        >
                          {service.cta_text || "View Gallery"}
                        </WaveButton>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          }

          // Style 1: Dark background, image on left, subtle border or single wave overlay
          return (
            <div
              key={service.id || sectionId}
              id={sectionId}
              className={`scroll-mt-20 bg-brand-dark py-20 relative overflow-hidden ${
                index > 0
                  ? "border-t border-brand-medium/35"
                  : "border-t border-brand-medium/30"
              }`}
            >
              {/* Wave decoration */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <img
                  src="/assets/svg/recurso olas, 1 ola.svg"
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.65, ease: "easeOut" }}
                className="relative mx-auto max-w-content px-6 lg:px-12"
              >
                <div className="grid gap-12 grid-cols-1 md:grid-cols-2 items-center">
                  {/* Image on Left */}
                  <div className="overflow-hidden rounded-3xl shadow-xl border border-brand-medium/30 aspect-[4/3] w-full bg-brand-dark">
                    <img
                      src={getSupabaseImageTransformUrl(service.image_url, {
                        width: 800,
                        height: 600,
                        bucket: "store",
                      })}
                      alt={service.title}
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchPriority={index === 0 ? "high" : "auto"}
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Text content on Right */}
                  <div>
                    <h2 className="mt-2 font-heading text-2xl font-black tracking-wider text-brand-cream sm:text-3xl">
                      {service.title}
                    </h2>
                    <p className="mt-6 text-sm md:text-base leading-relaxed text-white font-sans whitespace-pre-line">
                      {service.description}
                    </p>
                    {service.secondary_description && (
                      <p className="mt-4 text-xs md:text-sm leading-relaxed text-brand-light italic font-sans whitespace-pre-line">
                        {service.secondary_description}
                      </p>
                    )}
                    <div className="mt-10 flex justify-start">
                      <WaveButton
                        to={service.cta_link || "/gallery"}
                        variant="primary"
                        size="md"
                      >
                        {service.cta_text || "View Gallery"}
                      </WaveButton>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      <ServicesGalleryBannerSection />
    </div>
  );
}
