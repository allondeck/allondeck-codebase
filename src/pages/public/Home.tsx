import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import { useRef, useState } from "react";
import { ServiceCard } from "../../components/features/ServiceCard";
import { SEO } from "../../components/ui/SEO";
import { Wave } from "../../components/ui/Wave";
import { Button } from "../../components/ui/Button";

export default function Home() {
  const { products, loading } = useProducts({ limit: 4 });
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
    <div className="relative overflow-hidden bg-brand-dark text-white font-sans">
      <SEO
        title="All On Deck | Marine Deck Flooring Solutions"
        description="Your trusted partner in Marine deck flooring solutions. High-durability EVA/PE foam decks, custom CAD designs, and precision CNC cutting in Florida."
      />
      {/* 1. HERO SECTION */}
      <section
        className="relative flex flex-col items-center justify-center px-4 py-16 sm:py-20 md:py-24 lg:py-32 min-h-[75vh] md:min-h-[80vh] overflow-hidden bg-brand-dark cursor-crosshair"
        onMouseMove={handleSectionMouseMove}
      >
        {/* Background Image (Rotated 90deg CCW and scaled to cover parent completely without black bars) */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
          <div className="w-[220vh] h-[220vw] min-w-[1200px] min-h-[1200px] -rotate-90 flex items-center justify-center">
            <img
              src="/assets/images/1.jpg"
              alt="All On Deck Hero"
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

      {/* 2. SERVICES SECTION (Dark Teal Bg) */}
      <section className="bg-brand-dark pt-10 sm:pt-12 md:pt-14 pb-20 md:pb-28 text-white relative overflow-hidden">
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="text-center">
            <h2 className="font-heading text-5xl sm:text-7xl md:text-8xl font-black tracking-widest text-brand-cream text-center uppercase drop-shadow-md">
              SERVICES
            </h2>
            <div className="mx-auto mt-4 h-1.5 w-20 bg-brand-orange rounded-full" />
          </div>

          <div className="mt-8 sm:mt-10 md:mt-12 grid gap-8 md:gap-12 lg:gap-8 xl:gap-6 grid-cols-1 lg:grid-cols-3 max-w-md sm:max-w-lg lg:max-w-[960px] xl:max-w-[1140px] mx-auto">
            <ServiceCard
              title="Custom DECK Designs"
              imageSrc="/assets/images/1.jpg"
              linkTo="/services#service-1"
              buttonText="See More"
            />

            <ServiceCard
              title="Floor Manufacturing"
              imageSrc="/assets/images/2.jpg"
              linkTo="/services#service-2"
              buttonText="See More"
            />

            <ServiceCard
              title="Cutting and Installation"
              imageSrc="/assets/images/3.jpg"
              linkTo="/services#service-3"
              buttonText="See More"
            />
          </div>
        </div>
      </section>

      {/* 3. FREE ESTIMATE HERO BANNER (Light Teal Bg) */}
      <section className="relative overflow-hidden bg-brand-light py-20 text-brand-dark">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/assets/svg/recurso olas, 2 olas.svg"
            alt=""
            className="h-full w-full object-cover filter invert"
          />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-dark/80">
            Free Estimate
          </span>
          <h2 className="mt-4 font-heading text-2xl md:text-5xl font-black tracking-wider leading-tight text-brand-dark">
            Renewing your boat's deck has never been EASIER!
          </h2>
          <p className="mt-4 text-base md:text-lg text-brand-dark/80">
            Take your boat to the next level today.
          </p>
          {/* Action Button with Layered Waves (Exact same as Hero) */}
          <div className="relative flex items-center justify-center w-full z-20 pointer-events-none mt-10 md:mt-12">
            {/* Top Wave (Behind button, official design asset) */}
            <div className="absolute top-1/2 -translate-y-3.5 left-1/2 -translate-x-1/2 w-[18rem] sm:w-[22rem] md:w-[26rem] z-0 text-brand-medium/80 pointer-events-none opacity-95">
              <Wave />
            </div>

            <Button
              to="/estimate"
              variant="primary"
              size="lg"
              className="relative z-10 pointer-events-auto"
            >
              GET AN ESTIMATE
            </Button>

            {/* Bottom Wave (In front of button, official design asset) */}
            <div className="absolute top-1/2 translate-y-3.5 left-1/2 -translate-x-1/2 w-[18rem] sm:w-[22rem] md:w-[26rem] z-20 text-brand-medium/80 pointer-events-none opacity-95">
              <Wave />
            </div>
          </div>
        </div>
      </section>

      {/* 5. GALLERY HIGHLIGHT SECTION */}
      <section className="relative overflow-hidden bg-brand-medium py-20 md:py-28 text-white min-h-[75vh] flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/9.jpg"
            alt="Boat Gallery"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-[1400px] px-6 lg:px-12 text-center w-full">
          {/* Gallery Centerpiece Card */}
          <div className="relative mx-auto max-w-3xl sm:max-w-4xl rounded-[2.5rem] bg-brand-dark/90 backdrop-blur-md p-8 sm:p-12 md:p-14 border border-brand-light/20 shadow-2xl overflow-visible text-center">

            {/* Title - CHECK OUR (Brand Light) / GALLERY (Brand Cream) */}
            <h2 className="relative z-10 font-heading uppercase text-center leading-none">
              <span className="block text-3xl sm:text-5xl md:text-6xl font-black tracking-[0.2em] text-brand-light drop-shadow-md">
                CHECK OUR
              </span>
              <span className="block text-5xl sm:text-7xl md:text-8xl font-black tracking-widest text-brand-cream drop-shadow-lg mt-1 sm:mt-2">
                GALLERY
              </span>
            </h2>

            {/* Subtitle */}
            <p className="relative z-10 mt-6 text-sm sm:text-base md:text-lg text-brand-cream/90 italic font-sans max-w-xl mx-auto mb-6 sm:mb-8">
              Your boat could be the next star of our gallery.
            </p>

            {/* Floating Action Button with Layered Waves (Exact same as Hero) */}
            <div className="absolute bottom-2 sm:bottom-3 left-1/2 -translate-x-1/2 translate-y-1/4 flex items-center justify-center w-full z-20 pointer-events-none">
              {/* Top Wave (Behind button, official design asset) */}
              <div className="absolute top-1/2 -translate-y-3.5 left-1/2 -translate-x-1/2 w-[18rem] sm:w-[22rem] md:w-[26rem] z-0 text-brand-light pointer-events-none opacity-95">
                <Wave />
              </div>

              <Button
                to="/products"
                variant="primary"
                size="lg"
                className="relative z-10 pointer-events-auto"
              >
                GET VIEW
              </Button>

              {/* Bottom Wave (In front of button, official design asset) */}
              <div className="absolute top-1/2 translate-y-3.5 left-1/2 -translate-x-1/2 w-[18rem] sm:w-[22rem] md:w-[26rem] z-20 text-brand-light pointer-events-none opacity-95">
                <Wave />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. OUR SHOP SECTION (Dark Teal Bg) */}
      <section className="py-20 bg-brand-dark text-white overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="text-center flex flex-col items-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <svg
                className="h-10 w-10 text-brand-orange"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 6h-3.5a5.5 5.5 0 00-11 0H1v16h18V6zm-8-3.5c1.93 0 3.5 1.57 3.5 3.5h-7c0-1.93 1.57-3.5 3.5-3.5zM3 20V8h12v12H3z" />
                <path d="M7.5 6a3.5 3.5 0 017 0H16a5.5 5.5 0 00-11 0h2.5z" />
              </svg>
              <h2 className="font-heading text-4xl md:text-6xl font-normal tracking-widest text-brand-cream">
                OUR SHOP
              </h2>
            </div>
            <p className="mt-4 max-w-xl text-sm md:text-base text-brand-light italic tracking-wide">
              Join the community and carry our spirit on every journey. We'll
              see you out on the water!
            </p>
          </div>

          <div className="mt-12 relative group">
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {loading
                ? [1, 2, 3, 4].map((n) => (
                    <div
                      key={n}
                      className="snap-start shrink-0 w-72 h-96 animate-pulse rounded-[2rem] bg-brand-medium/50 shadow-md"
                    />
                  ))
                : products.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.slug}`}
                      className="snap-start shrink-0 w-[280px] flex flex-col bg-brand-medium rounded-[2rem] p-4 border border-transparent hover:border-brand-orange/50 transition-all shadow-lg"
                    >
                      <div className="relative bg-white aspect-[4/5] rounded-3xl overflow-hidden shadow-inner">
                        {product.image_url ? (
                          <img
                            src={`https://rckxskncdxobolhctnfw.supabase.co/storage/v1/object/public/products/${product.image_url}`}
                            alt={product.name}
                            className="w-full h-full object-contain p-8 hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <svg
                              className="w-12 h-12"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"
                              />
                            </svg>
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-brand-orange rounded-full w-9 h-9 flex items-center justify-center text-white text-xl font-black shadow-md transition-colors hover:bg-orange-600">
                          +
                        </div>
                      </div>
                      <div className="mt-5 px-2 pb-1">
                        <h3 className="font-heading font-medium text-white tracking-widest text-lg uppercase truncate">
                          {product.name}
                        </h3>
                        <p className="text-white text-sm mt-1 font-bold tracking-wider">
                          ${Number(product.price).toFixed(2)}
                        </p>
                      </div>
                    </Link>
                  ))}
            </div>

            {/* Scroll hint arrow */}
            <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white/40 backdrop-blur-sm rounded-full items-center justify-center text-white shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Button to="/products" variant="outline" size="md">
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* 7. PROMO BANNER (Cream background) */}
      <section className="bg-brand-dark pb-12">
        <div className="w-full bg-brand-cream relative overflow-hidden py-16 text-center shadow-inner">
          <div className="relative z-10 flex flex-col items-center">
            <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-[0.3em] text-brand-light">
              FINAL SALE
            </span>
            <h2 className="mt-2 font-heading text-5xl md:text-7xl lg:text-8xl font-black tracking-wider text-brand-dark">
              GET 30% OFF
            </h2>

            {/* Action Button with Layered Waves (Exact same as Hero) */}
            <div className="relative flex items-center justify-center w-full z-20 pointer-events-none mt-10 md:mt-12">
              {/* Top Wave (Behind button, official design asset) */}
              <div className="absolute top-1/2 -translate-y-3.5 left-1/2 -translate-x-1/2 w-[18rem] sm:w-[22rem] md:w-[26rem] z-0 text-brand-light pointer-events-none opacity-95">
                <Wave />
              </div>

              <Button
                to="/products"
                variant="primary"
                size="lg"
                className="relative z-10 pointer-events-auto"
              >
                GET IT
              </Button>

              {/* Bottom Wave (In front of button, official design asset) */}
              <div className="absolute top-1/2 translate-y-3.5 left-1/2 -translate-x-1/2 w-[18rem] sm:w-[22rem] md:w-[26rem] z-20 text-brand-light pointer-events-none opacity-95">
                <Wave />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. MEET OUR TEAM SECTION (Dark Teal Bg) */}
      <section className="py-20 bg-brand-dark text-white">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold tracking-widest text-brand-cream sm:text-4xl">
              MEET OUR TEAM
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base text-brand-cream/80 leading-relaxed font-sans">
              A dedicated team with one shared goal: perfection in every detail.
              Discover the crew that makes it all happen.
            </p>
            <div className="mx-auto mt-3 h-1 w-12 bg-brand-orange" />
          </div>

          <div className="mt-16 grid gap-12 grid-cols-1 md:grid-cols-2 md:mx-auto md:max-w-4xl">
            {/* Team Member 1 */}
            <div className="flex flex-col items-center text-center bg-brand-medium p-8 rounded-3xl border border-brand-light/10 shadow-lg">
              <div className="h-48 w-48 md:h-64 md:w-64 overflow-hidden rounded-full border-4 border-brand-cream shadow-md">
                <img
                  src="/assets/images/8.jpeg"
                  alt="Ernesto Alvarez"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-6 font-heading text-xl font-bold tracking-wide text-brand-cream">
                Ernesto alvarez
              </h3>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                President
              </span>
              <p className="mt-3 max-w-xs text-sm text-brand-cream/80 leading-relaxed font-sans">
                A strategist with a vision for nautical innovation. He leads All
                On Deck's premium service lines.
              </p>
              <Link
                to="/about#bio-ernesto"
                className="mt-4 text-xs font-bold uppercase tracking-wider text-brand-cream/60 hover:text-brand-orange"
              >
                View Bio →
              </Link>
            </div>

            {/* Team Member 2 */}
            <div className="flex flex-col items-center text-center bg-brand-medium p-8 rounded-3xl border border-brand-light/10 shadow-lg">
              <div className="h-48 w-48 md:h-64 md:w-64 overflow-hidden rounded-full border-4 border-brand-cream shadow-md">
                <img
                  src="/assets/images/6.jpeg"
                  alt="Roselena Oropesa"
                  className="h-full w-full object-cover"
                />
              </div>
              <h3 className="mt-6 font-heading text-xl font-bold tracking-wide text-brand-cream">
                Roselena oropesa
              </h3>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                Vice President
              </span>
              <p className="mt-3 max-w-xs text-sm text-brand-cream/80 leading-relaxed font-sans">
                Process optimizer and digital layout specialist. Ensures
                millimeter-precise product fabrication.
              </p>
              <Link
                to="/about#bio-roselena"
                className="mt-4 text-xs font-bold uppercase tracking-wider text-brand-cream/60 hover:text-brand-orange"
              >
                View Bio →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
