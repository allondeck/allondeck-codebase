import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Wave } from "../../../../components/ui/Wave";
import { Button } from "../../../../components/ui/Button";

export function HeroSection() {
  const cardRef = useRef<HTMLDivElement>(null);

  // Framer Motion spring physics for buttery smooth 3D tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 180, damping: 22 });
  const springY = useSpring(y, { stiffness: 180, damping: 22 });

  // 3D rotation transforms (-6 to 6 degrees)
  const rotateX = useTransform(springY, [-0.5, 0.5], [6, -6]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-6, 6]);

  // Dynamic light reflection sheen
  const sheenLeft = useTransform(springX, [-0.5, 0.5], ["-10%", "110%"]);
  const sheenTop = useTransform(springY, [-0.5, 0.5], ["-10%", "110%"]);

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const xPos = (e.clientX - rect.left) / rect.width - 0.5;
    const yPos = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPos);
    y.set(yPos);
  };

  const handleCardMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="relative flex flex-col items-center justify-center px-4 py-16 sm:py-20 md:py-24 lg:py-32 min-h-[75vh] md:min-h-[80vh] overflow-hidden bg-brand-dark">
      {/* Background Image - Full boat showcase */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <img
          src="/assets/images/hero-boat-landscape.jpg"
          alt="All On Deck Hero Marine Decking"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-full object-cover object-center opacity-90"
        />
        {/* Subtle dark vignette overlay so content remains readable while vibrant boat colors pop */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/25 to-brand-dark/50" />
      </div>

      {/* Main 3D Card Container */}
      <div className="relative z-10 mx-auto max-w-4xl w-full perspective-[1200px] mt-4 sm:mt-8">
        <motion.div
          ref={cardRef}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative flex flex-col items-center text-center bg-brand-dark/85 backdrop-blur-md rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-16 pb-14 sm:pb-16 md:pb-20 shadow-2xl border border-white/10 cursor-default"
        >
          {/* Dynamic Light Sheen overlay moving across the card (contained in inner rounded overflow mask) */}
          <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none">
            <motion.div
              style={{
                left: sheenLeft,
                top: sheenTop,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] rounded-full bg-gradient-to-r from-brand-light/15 via-white/10 to-transparent blur-3xl pointer-events-none mix-blend-screen"
            />
          </div>

          {/* Typography with 3D Z-Depth Layering */}
          <div
            style={{ transform: "translateZ(25px)" }}
            className="relative flex flex-col items-center"
          >
            <h1 className="font-heading text-4xl md:text-6xl font-black tracking-widest text-brand-orange uppercase drop-shadow-md text-center">
              WELCOME
              <span className="block mt-2 sm:mt-4 font-heading text-xl sm:text-2xl md:text-4xl font-bold tracking-widest text-white drop-shadow-md text-center">
                TO ALL ON DECK,
              </span>
            </h1>
            <p className="mt-4 sm:mt-8 max-w-3xl font-sans text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-white drop-shadow-md font-medium tracking-wide text-center">
              your trusted partner in marine deck flooring solutions. With years
              of experience and an unwavering commitment to quality, we offer
              products that combine durability, comfort, and style to enhance
              your on-water experience.
            </p>

            <p className="mt-6 sm:mt-10 font-heading text-sm sm:text-lg font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-brand-cream text-center">
              Take your boat to the next level
            </p>
          </div>

          {/* Floating Action Button with Layered Waves (Exact original centering & positioning) */}
          <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 translate-y-1/4 flex items-center justify-center w-full z-20 pointer-events-none">
            {/* Top Wave (Behind button, official design asset) */}
            <div className="absolute top-1/2 -translate-y-3.5 left-1/2 -translate-x-1/2 w-[18rem] sm:w-[22rem] md:w-[26rem] z-0 text-brand-light pointer-events-none opacity-95">
              <Wave />
            </div>

            <Button
              to="/services"
              variant="primary"
              size="lg"
              className="relative z-10 pointer-events-auto shadow-2xl transition-transform hover:scale-105"
            >
              SERVICES
            </Button>

            {/* Bottom Wave (In front of button, official design asset) */}
            <div className="absolute top-1/2 translate-y-3.5 left-1/2 -translate-x-1/2 w-[18rem] sm:w-[22rem] md:w-[26rem] z-20 text-brand-light pointer-events-none opacity-95">
              <Wave />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
