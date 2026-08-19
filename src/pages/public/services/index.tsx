import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../../../lib/supabase";
import { ServiceRow } from "../../../types/database";
import { SEO } from "../../../components/ui/SEO";
import { Button } from "../../../components/ui/Button";
import { ServicesHeroSection } from "./partials/ServicesHeroSection";
import { ServicesGalleryBannerSection } from "./partials/ServicesGalleryBannerSection";

const DEFAULT_SERVICES: ServiceRow[] = [
  {
    id: "default-1",
    title: "Custom DECK Designs",
    card_title: "Custom\nDeck Designs",
    description:
      "Each vessel is unique. Our CAD team designs custom marine deck templates tailored to your boat's specific layouts and configuration. We offer custom logo engraving, unique patterns, and stylized borders that fit your style perfectly.",
    secondary_description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit.",
    image_url: "/assets/images/1.jpg",
    cta_text: "View Gallery",
    cta_link: "/gallery?category=custom_deck_designs",
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "default-2",
    title: "Floor Manufacturing",
    card_title: "Floor\nManufacturing",
    description:
      "We manufacture using MarineMat, the leading closed-cell EVA/PE foam material. Resilient to UV rays, salt water, and chemical stains, our materials provide superior non-skid traction even when wet, outstanding noise reduction, and excellent shock absorption.",
    secondary_description:
      "Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit.",
    image_url: "/assets/images/2.jpg",
    cta_text: "View Gallery",
    cta_link: "/gallery?category=floor_manufacturing",
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "default-3",
    title: "Cutting and Installation",
    card_title: "Cutting and\nInstallation",
    description:
      "With over two years of experience and outstanding results in Florida, we elevate your boat’s standard through high-precision CNC cutting. Our specialized team, using CAD and CAM software, ensures the millimeter-perfect fabrication of each MarineMat piece, followed by a professional and meticulous installation that guarantees a flawless fit, impeccable aesthetics, and maximum durability at sea.",
    secondary_description: null,
    image_url: "/assets/images/3.jpg",
    cta_text: "View Gallery",
    cta_link: "/gallery?category=cutting_installation",
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Services() {
  const location = useLocation();
  const [services, setServices] = useState<ServiceRow[]>(DEFAULT_SERVICES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: true });

        if (error) {
          console.warn("Using default services (could not fetch from DB):", error);
          setServices(DEFAULT_SERVICES);
        } else if (data && data.length > 0) {
          setServices(data);
        } else {
          setServices(DEFAULT_SERVICES);
        }
      } catch (err) {
        console.error("Error loading services:", err);
        setServices(DEFAULT_SERVICES);
      } finally {
        setLoading(false);
      }
    }

    fetchServices();
  }, []);

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
      <ServicesHeroSection services={services} onActionClick={scrollToSection} />

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

                <div className="relative mx-auto max-w-content px-6 lg:px-12">
                  <div className="grid gap-12 grid-cols-1 md:grid-cols-2 items-center">
                    {/* Image on Right */}
                    <div className="md:order-last overflow-hidden rounded-3xl shadow-xl border border-brand-dark/40">
                      <img
                        src={service.image_url}
                        alt={service.title}
                        className="h-64 md:h-96 w-full object-cover"
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
                      <div className="mt-8">
                        <Button
                          to={service.cta_link || "/gallery"}
                          variant="primary"
                          size="md"
                        >
                          {service.cta_text || "View Gallery"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          // Style 1: Dark background, image on left, subtle border or single wave overlay
          return (
            <div
              key={service.id || sectionId}
              id={sectionId}
              className={`scroll-mt-20 bg-brand-dark py-20 relative overflow-hidden ${
                index > 0 ? "border-t border-brand-medium/35" : "border-t border-brand-medium/30"
              }`}
            >
              {index > 0 && (
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <img
                    src="/assets/svg/recurso olas, 1 ola.svg"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="relative mx-auto max-w-content px-6 lg:px-12">
                <div className="grid gap-12 grid-cols-1 md:grid-cols-2 items-center">
                  {/* Image on Left */}
                  <div className="overflow-hidden rounded-3xl shadow-xl border border-brand-medium/30">
                    <img
                      src={service.image_url}
                      alt={service.title}
                      className="h-64 md:h-96 w-full object-cover"
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
                    <div className="mt-8">
                      <Button
                        to={service.cta_link || "/gallery"}
                        variant="primary"
                        size="md"
                      >
                        {service.cta_text || "View Gallery"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <ServicesGalleryBannerSection />
    </div>
  );
}

