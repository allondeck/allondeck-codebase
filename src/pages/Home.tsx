import { Link } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";

export default function Home() {
  const { products, loading } = useProducts({ limit: 4 });

  return (
    <div className="relative overflow-hidden bg-brand-dark text-white font-sans">
      {/* 1. HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center px-4 py-32 text-center md:py-48 min-h-[90vh] overflow-hidden bg-black">
        {/* Background Image (Rotated 90deg CCW and scaled to cover) */}
        <div className="absolute top-1/2 left-1/2 w-[150vw] h-[150vw] md:w-[120vw] md:h-[120vw] -translate-x-1/2 -translate-y-1/2 -rotate-90">
          <img src="/assets/images/1.jpg" alt="All On Deck Hero" className="w-full h-full object-cover" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl flex flex-col items-center bg-[#044155]/85 backdrop-blur-md rounded-[3rem] p-8 md:p-16 shadow-2xl border border-white/10 mt-12">
          <h2 className="font-heading text-6xl md:text-8xl font-black tracking-widest text-[#e38622] uppercase drop-shadow-md">
            WELCOME
          </h2>
          <h3 className="mt-4 text-3xl md:text-5xl font-bold tracking-widest text-white drop-shadow-md">
            TO ALL ON DECK,
          </h3>
          <p className="mt-8 max-w-3xl text-lg md:text-2xl leading-relaxed text-white drop-shadow-md font-medium tracking-wide">
            your trusted partner in Marine deck flooring solutions. 
            With years of experience and an unwavering commitment to quality, we offer products 
            that combine durability, comfort, and style to enhance your on-water experience.
          </p>
          
          <p className="mt-10 text-lg md:text-xl font-bold uppercase tracking-[0.2em] text-[#f6ebd4]">
            Take your boat to the next level
          </p>
          
          <div className="mt-8 flex justify-center w-full relative">
            <Link
              to="/services"
              className="relative z-10 rounded-2xl bg-[#e38622] px-12 py-4 text-sm font-bold uppercase tracking-widest text-white transition-transform hover:scale-105 shadow-xl shadow-[#e38622]/40 text-center"
            >
              SERVICES
            </Link>
            
            {/* Wavy lines decoration underneath button */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-2 mt-4 text-[#76abbf] w-48 pointer-events-none opacity-80">
              <svg viewBox="0 0 100 24" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M-5,10 Q5,-2 15,10 T35,10 T55,10 T75,10 T95,10 T115,10" />
                <path d="M-5,22 Q5,10 15,22 T35,22 T55,22 T75,22 T95,22 T115,22" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SERVICES SECTION (Medium Teal Bg) */}
      <section className="bg-brand-medium py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <img src="/assets/svg/recurso olas, 2 olas.svg" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold tracking-widest text-brand-cream sm:text-4xl">
              SERVICES
            </h2>
            <div className="mx-auto mt-3 h-1 w-12 bg-brand-orange" />
          </div>

          <div className="mt-16 grid gap-8 grid-cols-1 md:grid-cols-3">
            {/* Card 1 */}
            <div className="group relative overflow-hidden rounded-3xl bg-brand-dark p-6 md:p-8 shadow-md border border-brand-light/10 transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-6 overflow-hidden rounded-2xl">
                <img src="/assets/images/1.jpg" alt="Custom DECK Designs" className="h-48 w-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <h3 className="font-heading text-lg font-bold tracking-wider text-brand-cream">Custom DECK Designs</h3>
              <p className="mt-3 text-sm text-brand-cream/80 leading-relaxed font-sans">
                Tailored marine flooring layouts styled perfectly to suit your boat. We create beautiful bespoke visual drafts.
              </p>
              <Link to="/services#service-1" className="mt-6 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-orange hover:underline">
                See More →
              </Link>
            </div>

            {/* Card 2 */}
            <div className="group relative overflow-hidden rounded-3xl bg-brand-dark p-6 md:p-8 shadow-md border border-brand-light/10 transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-6 overflow-hidden rounded-2xl">
                <img src="/assets/images/2.jpg" alt="Floor Manufacturing" className="h-48 w-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <h3 className="font-heading text-lg font-bold tracking-wider text-brand-cream">Floor Manufacturing</h3>
              <p className="mt-3 text-sm text-brand-cream/80 leading-relaxed font-sans">
                High-quality fabrication using state of the art materials engineered to withstand the harshest ocean environments.
              </p>
              <Link to="/services#service-2" className="mt-6 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-orange hover:underline">
                See More →
              </Link>
            </div>

            {/* Card 3 */}
            <div className="group relative overflow-hidden rounded-3xl bg-brand-dark p-6 md:p-8 shadow-md border border-brand-light/10 transition-all hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-6 overflow-hidden rounded-2xl">
                <img src="/assets/images/3.jpg" alt="Cutting & Installation" className="h-48 w-full object-cover transition-transform group-hover:scale-105" />
              </div>
              <h3 className="font-heading text-lg font-bold tracking-wider text-brand-cream">Cutting and Installation</h3>
              <p className="mt-3 text-sm text-brand-cream/80 leading-relaxed font-sans">
                Millimeter-precise CAD/CAM CNC cutting and clean expert installation for the ultimate seamless look and longevity.
              </p>
              <Link to="/services#service-3" className="mt-6 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-orange hover:underline">
                See More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FREE ESTIMATE HERO BANNER (Light Teal Bg) */}
      <section className="relative overflow-hidden bg-brand-light py-20 text-brand-dark">
        <div className="absolute inset-0 opacity-10">
          <img src="/assets/svg/recurso olas, 2 olas.svg" alt="" className="h-full w-full object-cover filter invert" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12 text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-dark/80">Free Estimate</span>
          <h2 className="mt-4 font-heading text-2xl md:text-5xl font-black tracking-wider leading-tight text-brand-dark">
            Renewing your boat's deck has never been EASIER!
          </h2>
          <p className="mt-4 text-base md:text-lg text-brand-dark/80">Take your boat to the next level today.</p>
          <div className="mt-8">
            <Link
              to="/estimate"
              className="inline-block rounded-full bg-brand-orange px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-105 shadow-lg shadow-brand-orange/30"
            >
              Get an estimate
            </Link>
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
              A dedicated team with one shared goal: perfection in every detail. Discover the crew that makes it all happen.
            </p>
            <div className="mx-auto mt-3 h-1 w-12 bg-brand-orange" />
          </div>

          <div className="mt-16 grid gap-12 grid-cols-1 md:grid-cols-2 md:mx-auto md:max-w-4xl">
            {/* Team Member 1 */}
            <div className="flex flex-col items-center text-center bg-brand-medium p-8 rounded-3xl border border-brand-light/10 shadow-lg">
              <div className="h-48 w-48 md:h-64 md:w-64 overflow-hidden rounded-full border-4 border-brand-cream shadow-md">
                <img src="/assets/images/8.jpeg" alt="Ernesto Alvarez" className="h-full w-full object-cover" />
              </div>
              <h3 className="mt-6 font-heading text-xl font-bold tracking-wide text-brand-cream">Ernesto alvarez</h3>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">President</span>
              <p className="mt-3 max-w-xs text-sm text-brand-cream/80 leading-relaxed font-sans">
                A strategist with a vision for nautical innovation. He leads All On Deck's premium service lines.
              </p>
              <Link to="/about#bio-ernesto" className="mt-4 text-xs font-bold uppercase tracking-wider text-brand-cream/60 hover:text-brand-orange">
                View Bio →
              </Link>
            </div>

            {/* Team Member 2 */}
            <div className="flex flex-col items-center text-center bg-brand-medium p-8 rounded-3xl border border-brand-light/10 shadow-lg">
              <div className="h-48 w-48 md:h-64 md:w-64 overflow-hidden rounded-full border-4 border-brand-cream shadow-md">
                <img src="/assets/images/6.jpeg" alt="Roselena Oropesa" className="h-full w-full object-cover" />
              </div>
              <h3 className="mt-6 font-heading text-xl font-bold tracking-wide text-brand-cream">Roselena oropesa</h3>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">Vice President</span>
              <p className="mt-3 max-w-xs text-sm text-brand-cream/80 leading-relaxed font-sans">
                Process optimizer and digital layout specialist. Ensures millimeter-precise product fabrication.
              </p>
              <Link to="/about#bio-roselena" className="mt-4 text-xs font-bold uppercase tracking-wider text-brand-cream/60 hover:text-brand-orange">
                View Bio →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GALLERY HIGHLIGHT SECTION (Medium Teal Bg) */}
      <section className="relative overflow-hidden bg-brand-medium py-20 text-white">
        <div className="absolute inset-0 opacity-20">
          <img src="/assets/images/9.jpg" alt="Boat Gallery" className="h-full w-full object-cover" />
        </div>
        <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12 text-center font-sans">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-cream">Get View</span>
          <h2 className="mt-4 font-heading text-2xl md:text-5xl font-black tracking-wider leading-tight text-brand-cream">
            CHECK OUR GALLERY
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm md:text-base text-brand-cream/90 leading-relaxed">
            Your boat could be the next star of our gallery.
          </p>
          <div className="mt-8">
            <Link
              to="/products"
              className="inline-block rounded-full bg-brand-orange px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-transform hover:scale-105 shadow-lg shadow-brand-orange/30"
            >
              See More
            </Link>
          </div>
        </div>
      </section>

      {/* 6. OUR SHOP SECTION (Dark Teal Bg) */}
      <section className="py-20 bg-[#044155] text-white overflow-hidden">
        <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
          <div className="text-center flex flex-col items-center">
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <svg className="h-10 w-10 text-[#e38622]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 6h-3.5a5.5 5.5 0 00-11 0H1v16h18V6zm-8-3.5c1.93 0 3.5 1.57 3.5 3.5h-7c0-1.93 1.57-3.5 3.5-3.5zM3 20V8h12v12H3z" />
                <path d="M7.5 6a3.5 3.5 0 017 0H16a5.5 5.5 0 00-11 0h2.5z" />
              </svg>
              <h2 className="font-heading text-4xl md:text-6xl font-normal tracking-widest text-[#f6ebd4]">
                OUR SHOP
              </h2>
            </div>
            <p className="mt-4 max-w-xl text-sm md:text-base text-[#76abbf] italic tracking-wide">
              Join the community and carry our spirit on every journey. We'll see you out on the water!
            </p>
          </div>

          <div className="mt-12 relative group">
            <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {loading ? (
                [1, 2, 3, 4].map((n) => (
                  <div key={n} className="snap-start shrink-0 w-72 h-96 animate-pulse rounded-[2rem] bg-brand-medium/50 shadow-md" />
                ))
              ) : (
                products.map((product) => (
                  <Link key={product.id} to={`/products/${product.slug}`} className="snap-start shrink-0 w-[280px] flex flex-col bg-[#066175] rounded-[2rem] p-4 border border-transparent hover:border-[#e38622]/50 transition-all shadow-lg">
                    <div className="relative bg-white aspect-[4/5] rounded-3xl overflow-hidden shadow-inner">
                      {product.image_url ? (
                        <img src={`https://rckxskncdxobolhctnfw.supabase.co/storage/v1/object/public/products/${product.image_url}`} alt={product.name} className="w-full h-full object-contain p-8 hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" /></svg>
                        </div>
                      )}
                      <div className="absolute bottom-2 right-2 bg-[#e38622] rounded-full w-9 h-9 flex items-center justify-center text-white text-xl font-black shadow-md transition-colors hover:bg-orange-600">
                        +
                      </div>
                    </div>
                    <div className="mt-5 px-2 pb-1">
                      <h3 className="font-heading font-medium text-white tracking-widest text-lg uppercase truncate">{product.name}</h3>
                      <p className="text-white text-sm mt-1 font-bold tracking-wider">${Number(product.price).toFixed(2)}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
            
            {/* Scroll hint arrow */}
            <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-white/40 backdrop-blur-sm rounded-full items-center justify-center text-white shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
            </div>
          </div>
          
          <div className="mt-4 text-center">
             <Link to="/products" className="inline-block rounded-full border-2 border-[#e38622] text-[#e38622] hover:bg-[#e38622] hover:text-white px-10 py-3 text-sm font-bold uppercase tracking-wider transition-colors shadow-md">
               View All Products
             </Link>
          </div>
        </div>
      </section>

      {/* 7. PROMO BANNER (Cream background) */}
      <section className="bg-brand-dark pb-12">
        <div className="w-full bg-[#f6ebd4] relative overflow-hidden py-16 text-center shadow-inner">
          {/* Faint wave background pattern */}
          <div className="absolute inset-0 opacity-20 pointer-events-none flex items-center justify-center">
            <img src="/assets/svg/recurso olas, 2 olas.svg" alt="" className="w-full min-w-[150%] object-cover opacity-30" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <span className="text-sm md:text-base font-bold uppercase tracking-[0.3em] text-[#76abbf]">
              FINAL SALE
            </span>
            <h2 className="mt-2 font-heading text-5xl md:text-7xl lg:text-8xl font-black tracking-wider text-[#044155]">
              GET 30% OFF
            </h2>

            <div className="mt-10 relative flex flex-col items-center justify-center">
              {/* Blue waves graphic underneath */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-5 text-[#76abbf] w-64 pointer-events-none">
                <svg viewBox="0 0 100 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M-5,10 Q5,-2 15,10 T35,10 T55,10 T75,10 T95,10 T115,10" />
                  <path d="M-5,22 Q5,10 15,22 T35,22 T55,22 T75,22 T95,22 T115,22" />
                </svg>
              </div>

              <Link
                to="/products"
                className="relative z-10 rounded-xl bg-[#e38622] hover:bg-orange-600 px-12 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-md transition-transform hover:scale-105"
              >
                GET IT
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
