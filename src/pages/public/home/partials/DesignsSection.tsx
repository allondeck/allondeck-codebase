import { ServiceCard } from "../../../../components/features/ServiceCard";

export function DesignsSection() {
  return (
    <section className="bg-brand-dark scroll-mt-16 pt-8 sm:pt-10 lg:pt-12 pb-8 sm:pb-10 lg:pb-12 text-white relative overflow-hidden">
      <div className="relative mx-auto max-w-content px-6 lg:px-12 text-center">
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-widest text-brand-cream text-center uppercase drop-shadow-md">
          DESIGNS
        </h2>

        {/* 3-Card Grid */}
        <div className="mt-4 sm:mt-5 lg:mt-6 grid gap-5 sm:gap-6 lg:gap-6 xl:gap-7 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-[420px] sm:max-w-[500px] md:max-w-[800px] lg:max-w-[1060px] xl:max-w-[1160px] 2xl:max-w-[1200px] mx-auto text-left">
          {/* Card 1: Colors */}
          <ServiceCard
            title="COLORS"
            imageSrc="/assets/images/5.2.jpg"
            linkTo="/designs#colors"
            buttonText="SEE MORE"
          />

          {/* Card 2: Patterns */}
          <ServiceCard
            title="PATTERNS"
            imageSrc="/assets/images/1.jpg"
            linkTo="/designs#gallery"
            buttonText="SEE MORE"
          />

          {/* Card 3: Materials */}
          <ServiceCard
            title="MATERIALS"
            imageSrc="/assets/images/9.jpg"
            linkTo="/designs#materials"
            buttonText="SEE MORE"
          />
        </div>
      </div>
    </section>
  );
}
