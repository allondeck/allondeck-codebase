import { useRef, useState } from "react";
import { Wave } from "../../../../components/ui/Wave";
import { Button } from "../../../../components/ui/Button";

export function HeroSection() {
  const heroCardRef = useRef<HTMLDivElement>(null);

  // Ripple state
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);
  const rippleCount = useRef(0);

  const handleSectionMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (Math.random() > 0.4) {
      const newRipple = { id: rippleCount.current++, x, y };
      setRipples((prev) => [...prev.slice(-15), newRipple]);

      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 1000);
    }
  };

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroCardRef.current) return;
    const rect = heroCardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (-5 to 5 degrees)
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;

    heroCardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(0)`;
    heroCardRef.current.style.transition = "transform 0.1s ease-out";
  };

  const handleCardMouseLeave = () => {
    if (!heroCardRef.current) return;
    heroCardRef.current.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    heroCardRef.current.style.transition = "transform 0.5s ease-out";
  };

  return (
    <section
      className="relative flex flex-col items-center justify-center px-4 py-16 sm:py-20 md:py-24 lg:py-32 min-h-[75vh] md:min-h-[80vh] overflow-hidden bg-brand-dark cursor-crosshair"
      onMouseMove={handleSectionMouseMove}
    >
      {/* Background Image (Rotated 90deg CCW and scaled to cover parent completely without black bars) */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="w-[220vh] h-[220vw] min-w-[1200px] min-h-[1200px] -rotate-90 flex items-center justify-center">
          <img
            src="/assets/images/1.jpg"
            alt="All On Deck Hero Marine Decking"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover opacity-80"
          />
        </div>
      </div>

      {/* Ripples */}
      {ripples.map((r) => (
        <div
          key={r.id}
          className="absolute rounded-full border-2 border-brand-light/30 pointer-events-none mix-blend-screen"
          style={{
            left: r.x - 20,
            top: r.y - 20,
            width: 40,
            height: 40,
            animation: "ripple-fade 1s ease-out forwards",
          }}
        />
      ))}

      <div
        ref={heroCardRef}
        onMouseMove={handleCardMouseMove}
        onMouseLeave={handleCardMouseLeave}
        className="relative z-10 mx-auto max-w-4xl flex flex-col items-center text-center bg-brand-dark/85 backdrop-blur-md rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-16 pb-14 sm:pb-16 md:pb-20 shadow-2xl border border-white/10 mt-4 sm:mt-8 transition-transform duration-500 ease-out cursor-default"
        style={{ transformStyle: "preserve-3d" }}
      >
        <h2 className="font-heading text-4xl sm:text-6xl md:text-8xl font-black tracking-widest text-brand-orange uppercase drop-shadow-md text-center">
          WELCOME
        </h2>
        <h3 className="mt-2 sm:mt-4 font-heading text-xl sm:text-3xl md:text-5xl font-bold tracking-widest text-white drop-shadow-md text-center">
          TO ALL ON DECK,
        </h3>
        <p className="mt-4 sm:mt-8 max-w-3xl font-sans text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed text-white drop-shadow-md font-medium! tracking-wide text-center">
          your trusted partner in marine deck flooring solutions. With years
          of experience and an unwavering commitment to quality, we offer
          products that combine durability, comfort, and style to enhance your
          on-water experience.
        </p>

        <p className="mt-6 sm:mt-10 font-heading text-sm sm:text-lg md:text-xl font-bold uppercase tracking-[0.15em] sm:tracking-[0.2em] text-brand-cream text-center">
          Take your boat to the next level
        </p>

        {/* Floating Action Button with Layered Waves */}
        <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 translate-y-1/4 flex items-center justify-center w-full z-20 pointer-events-none">
          {/* Top Wave (Behind button, official design asset) */}
          <div className="absolute top-1/2 -translate-y-3.5 left-1/2 -translate-x-1/2 w-[18rem] sm:w-[22rem] md:w-[26rem] z-0 text-brand-light pointer-events-none opacity-95">
            <Wave />
          </div>

          <Button
            to="/services"
            variant="primary"
            size="lg"
            className="relative z-10 pointer-events-auto"
          >
            SERVICES
          </Button>

          {/* Bottom Wave (In front of button, official design asset) */}
          <div className="absolute top-1/2 translate-y-3.5 left-1/2 -translate-x-1/2 w-[18rem] sm:w-[22rem] md:w-[26rem] z-20 text-brand-light pointer-events-none opacity-95">
            <Wave />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ripple-fade {
          0% { transform: scale(0.5); opacity: 1; }
          100% { transform: scale(3.5); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
