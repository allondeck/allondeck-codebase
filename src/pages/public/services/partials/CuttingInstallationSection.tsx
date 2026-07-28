import { Button } from "../../../../components/ui/Button";

export function CuttingInstallationSection() {
  return (
    <div
      id="service-3"
      className="scroll-mt-20 bg-brand-dark text-white py-20 relative overflow-hidden border-t border-brand-medium/35"
    >
      <div className="absolute inset-0 opacity-10">
        <img
          src="/assets/svg/recurso olas, 1 ola.svg"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid gap-12 grid-cols-1 md:grid-cols-2 items-center">
          <div className="overflow-hidden rounded-3xl shadow-xl border border-brand-medium/30">
            <img
              src="/assets/images/3.jpg"
              alt="Cutting & Installation"
              className="h-64 md:h-96 w-full object-cover"
            />
          </div>
          <div>
            <h2 className="mt-2 font-heading text-2xl font-black tracking-wider text-brand-cream sm:text-3xl">
              Cutting and Installation
            </h2>
            <p className="mt-6 text-sm md:text-base leading-relaxed text-white font-sans">
              With over two years of experience and outstanding results in
              Florida, we elevate your boat’s standard through
              high-precision CNC cutting. Our specialized team, using CAD
              and CAM software, ensures the millimeter-perfect fabrication
              of each MarineMat piece, followed by a professional and
              meticulous installation that guarantees a flawless fit,
              impeccable aesthetics, and maximum durability at sea.
            </p>
            <div className="mt-8">
              <Button to="/estimate" variant="primary" size="md">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
