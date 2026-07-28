import { Button } from "../../../../components/ui/Button";

export function CustomDeckDesignsSection() {
  return (
    <div
      id="service-1"
      className="scroll-mt-20 bg-brand-dark py-20 border-t border-brand-medium/30"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="grid gap-12 grid-cols-1 md:grid-cols-2 items-center">
          <div className="overflow-hidden rounded-3xl shadow-xl border border-brand-medium/30">
            <img
              src="/assets/images/1.jpg"
              alt="Custom DECK Designs"
              className="h-64 md:h-96 w-full object-cover"
            />
          </div>
          <div>
            <h2 className="mt-2 font-heading text-2xl font-black tracking-wider text-brand-cream sm:text-3xl">
              Custom DECK Designs
            </h2>
            <p className="mt-6 text-sm md:text-base leading-relaxed text-white font-sans">
              Each vessel is unique. Our CAD team designs custom marine deck
              templates tailored to your boat's specific layouts and
              configuration. We offer custom logo engraving, unique
              patterns, and stylized borders that fit your style perfectly.
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
