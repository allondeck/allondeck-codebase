import { Button } from "../../../../components/ui/Button";

export function FloorManufacturingSection() {
  return (
    <div
      id="service-2"
      className="scroll-mt-20 bg-brand-medium text-white py-20 relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-10">
        <img
          src="/assets/svg/recurso olas, 2 olas.svg"
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid gap-12 grid-cols-1 md:grid-cols-2 items-center">
          <div className="md:order-last overflow-hidden rounded-3xl shadow-xl border border-brand-dark/40">
            <img
              src="/assets/images/2.jpg"
              alt="Floor Manufacturing"
              className="h-64 md:h-96 w-full object-cover"
            />
          </div>
          <div>
            <h2 className="mt-2 font-heading text-2xl font-black tracking-wider text-brand-cream sm:text-3xl">
              Floor Manufacturing
            </h2>
            <p className="mt-6 text-sm md:text-base leading-relaxed text-white font-sans">
              We manufacture using MarineMat, the leading closed-cell EVA/PE
              foam material. Resilient to UV rays, salt water, and chemical
              stains, our materials provide superior non-skid traction even
              when wet, outstanding noise reduction, and excellent shock
              absorption.
            </p>
            <p className="mt-4 text-xs md:text-sm leading-relaxed text-brand-light italic font-sans">
              Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
              diam nonummy nibh euismod tincidunt ut laoreet dolore magna
              aliquam erat volutpat. Ut wisi enim ad minim veniam, quis
              nostrud exerci tation ullamcorper suscipit.
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
