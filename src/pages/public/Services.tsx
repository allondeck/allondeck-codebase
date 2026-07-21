import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ServiceCard } from "../../components/features/ServiceCard";

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
      {/* ── HERO SECTION ────────────────── */}
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12 pt-16 pb-20 text-center">
        <h1 className="font-heading text-5xl font-black tracking-widest text-brand-orange uppercase sm:text-6xl lg:text-7xl">
          SERVICES
        </h1>

        {/* 3-Card Grid */}
        <div className="mt-16 grid gap-8 grid-cols-1 md:grid-cols-3 max-w-6xl mx-auto text-left">
          {/* Card 1: Custom Deck Designs */}
          <ServiceCard
            title={
              <>
                Custom<br />Deck Designs
              </>
            }
            imageSrc="/assets/images/1.jpg"
            targetId="service-1"
            onActionClick={scrollToSection}
            variant="hero-card"
          />

          {/* Card 2: Floor Manufacturing */}
          <ServiceCard
            title={
              <>
                Floor<br />Manufacturing
              </>
            }
            imageSrc="/assets/images/2.jpg"
            targetId="service-2"
            onActionClick={scrollToSection}
            variant="hero-card"
          />

          {/* Card 3: Cutting and Installation */}
          <ServiceCard
            title={
              <>
                Cutting and<br />Installation
              </>
            }
            imageSrc="/assets/images/3.jpg"
            targetId="service-3"
            onActionClick={scrollToSection}
            variant="hero-card"
          />
        </div>
      </div>

      {/* SERVICES DETAILS */}
      <div className="space-y-0">
        {/* Service 1: Custom DECK Designs */}
        <div id="service-1" className="scroll-mt-20 bg-brand-dark py-20 border-t border-brand-medium/30">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <div className="grid gap-12 grid-cols-1 md:grid-cols-2 items-center">
              <div className="overflow-hidden rounded-3xl shadow-xl border border-brand-medium/30">
                <img src="/assets/images/1.jpg" alt="Custom DECK Designs" className="h-64 md:h-96 w-full object-cover" />
              </div>
              <div>
                <h2 className="mt-2 font-heading text-2xl font-black tracking-wider text-brand-cream sm:text-3xl">
                  Custom DECK Designs
                </h2>
                <p className="mt-6 text-sm md:text-base leading-relaxed text-white font-sans">
                  Each vessel is unique. Our CAD team designs custom marine deck templates tailored to your boat's specific layouts and configuration. We offer custom logo engraving, unique patterns, and stylized borders that fit your style perfectly.
                </p>
                <p className="mt-4 text-xs md:text-sm leading-relaxed text-brand-light italic font-sans">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit.
                </p>
                <div className="mt-8">
                  <Link
                    to="/estimate"
                    className="inline-block rounded-full bg-brand-orange hover:bg-orange-600 px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-105 shadow-md shadow-brand-orange/20"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service 2: Floor Manufacturing */}
        <div id="service-2" className="scroll-mt-20 bg-brand-medium text-white py-20 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <img src="/assets/svg/recurso olas, 2 olas.svg" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
            <div className="grid gap-12 grid-cols-1 md:grid-cols-2 items-center">
              <div className="md:order-last overflow-hidden rounded-3xl shadow-xl border border-brand-dark/40">
                <img src="/assets/images/2.jpg" alt="Floor Manufacturing" className="h-64 md:h-96 w-full object-cover" />
              </div>
              <div>
                <h2 className="mt-2 font-heading text-2xl font-black tracking-wider text-brand-cream sm:text-3xl">
                  Floor Manufacturing
                </h2>
                <p className="mt-6 text-sm md:text-base leading-relaxed text-white font-sans">
                  We manufacture using MarineMat, the leading closed-cell EVA/PE foam material. Resilient to UV rays, salt water, and chemical stains, our materials provide superior non-skid traction even when wet, outstanding noise reduction, and excellent shock absorption.
                </p>
                <p className="mt-4 text-xs md:text-sm leading-relaxed text-brand-light italic font-sans">
                  Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit.
                </p>
                <div className="mt-8">
                  <Link
                    to="/estimate"
                    className="inline-block rounded-full bg-brand-orange hover:bg-orange-600 px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-105 shadow-md shadow-brand-orange/30"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Service 3: Cutting and Installation */}
        <div id="service-3" className="scroll-mt-20 bg-brand-dark text-white py-20 relative overflow-hidden border-t border-brand-medium/35">
          <div className="absolute inset-0 opacity-10">
            <img src="/assets/svg/recurso olas, 1 ola.svg" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
            <div className="grid gap-12 grid-cols-1 md:grid-cols-2 items-center">
              <div className="overflow-hidden rounded-3xl shadow-xl border border-brand-medium/30">
                <img src="/assets/images/3.jpg" alt="Cutting & Installation" className="h-64 md:h-96 w-full object-cover" />
              </div>
              <div>
                <h2 className="mt-2 font-heading text-2xl font-black tracking-wider text-brand-cream sm:text-3xl">
                  Cutting and Installation
                </h2>
                <p className="mt-6 text-sm md:text-base leading-relaxed text-white font-sans">
                  With over two years of experience and outstanding results in Florida, we elevate your boat’s standard through high-precision CNC cutting. Our specialized team, using CAD and CAM software, ensures the millimeter-perfect fabrication of each MarineMat piece, followed by a professional and meticulous installation that guarantees a flawless fit, impeccable aesthetics, and maximum durability at sea.
                </p>
                <div className="mt-8">
                  <Link
                    to="/estimate"
                    className="inline-block rounded-full bg-brand-orange hover:bg-orange-600 px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-105 shadow-md shadow-brand-orange/30"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
