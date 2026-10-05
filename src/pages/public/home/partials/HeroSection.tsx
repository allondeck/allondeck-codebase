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
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Main 3D Card Container - Scaled down wrapper box while keeping rich content presence */}
      <div className="relative z-10 mx-auto max-w-[360px] sm:max-w-[560px] md:max-w-[620px] w-full perspective-[1200px] mt-6 sm:mt-8 px-3 sm:px-0">
        <motion.div
          ref={cardRef}
          onMouseMove={handleCardMouseMove}
          onMouseLeave={handleCardMouseLeave}
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative flex flex-col items-center text-center bg-brand-dark/85 backdrop-blur-md rounded-[2.25rem] sm:rounded-[2.75rem] px-4 sm:px-8 md:px-10 pt-7 sm:pt-9 pb-14 sm:pb-16 shadow-2xl border border-white/10 cursor-default"
        >
          {/* Dynamic Light Sheen overlay moving across the card (contained in inner rounded overflow mask) */}
          <div className="absolute inset-0 rounded-[inherit] overflow-hidden pointer-events-none">
            <motion.div
              style={{
                left: sheenLeft,
                top: sheenTop,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 w-[28rem] h-[28rem] rounded-full bg-gradient-to-r from-brand-light/15 via-white/10 to-transparent blur-3xl pointer-events-none mix-blend-screen"
            />
          </div>

          {/* Typography with 3D Z-Depth Layering */}
          <div
            style={{ transform: "translateZ(25px)" }}
            className="relative flex flex-col items-center w-full"
          >
            {/* WELCOME heading overlaps top card edge with tight line wrapping */}
            <h1 className="relative -mt-9 sm:-mt-12 md:-mt-14 font-heading tracking-widest uppercase drop-shadow-lg text-center select-none flex flex-col items-center leading-none">
              <span className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black text-brand-orange leading-none">
                WELCOME
              </span>
              <span className="mt-1 sm:mt-1.5 text-base sm:text-xl md:text-2xl lg:text-[1.75rem] font-bold text-white drop-shadow-md tracking-wider sm:tracking-widest leading-none">
                TO ALL ON DECK,
              </span>
            </h1>

            <p className="mt-4 sm:mt-6 max-w-md sm:max-w-lg font-sans text-xs sm:text-base md:text-lg leading-relaxed text-white drop-shadow-md font-medium tracking-wide text-center px-1 sm:px-2">
              your trusted partner in Marine deck flooring solutions. With years
              of experience and an unwavering commitment to quality, we offer
              products that combine durability, comfort, and style to enhance
              your on-water experience.
            </p>

            <p className="mt-4 sm:mt-6 font-heading text-[11px] sm:text-sm md:text-base font-bold uppercase tracking-wider sm:tracking-[0.2em] text-white/95 drop-shadow-md text-center">
              Take your boat to the next level
            </p>
          </div>

          {/* Action Button with Layered Waves - Balanced subtle overlap on bottom border */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/4 flex items-center justify-center w-full z-20 pointer-events-none">
            {/* Top Wave (Behind button, official design asset) */}
            <div className="absolute top-1/2 -translate-y-3 left-1/2 -translate-x-1/2 w-[15rem] sm:w-[18rem] md:w-[21rem] z-0 text-brand-light pointer-events-none opacity-90">
              <Wave />
            </div>

            <Button
              to="/services"
              variant="primary"
              size="lg"
              className="relative z-10 pointer-events-auto shadow-2xl transition-transform hover:scale-105 px-7 sm:px-8 py-3 text-xs sm:text-sm font-bold tracking-wider"
            >
              SERVICES
            </Button>

            {/* Bottom Wave (In front of button, official design asset) */}
            <div className="absolute top-1/2 translate-y-2.5 left-1/2 -translate-x-1/2 w-[15rem] sm:w-[18rem] md:w-[21rem] z-20 text-brand-light pointer-events-none opacity-90">
              <Wave />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
