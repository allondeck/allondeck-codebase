import { ServiceCard } from "../../../../components/features/ServiceCard";

export function DesignsSection() {
  return (
    <section className="bg-brand-dark pt-10 sm:pt-12 md:pt-14 pb-20 md:pb-28 text-white relative overflow-hidden">
      <div className="relative mx-auto max-w-content px-6 lg:px-12 text-center">
        <h2 className="font-heading text-5xl sm:text-7xl md:text-8xl font-black tracking-widest text-brand-cream text-center uppercase drop-shadow-md">
          DESIGNS
        </h2>

        {/* 3-Card Grid */}
        <div className="mt-8 sm:mt-10 md:mt-14 grid gap-8 md:gap-12 lg:gap-8 xl:gap-6 grid-cols-1 lg:grid-cols-3 max-w-md sm:max-w-lg lg:max-w-[960px] xl:max-w-[1140px] mx-auto text-left">
          {/* Card 1: Colors */}
          <ServiceCard
            title="COLORS"
            imageSrc="/assets/images/5.2.jpg"
            linkTo="/designs#colors"
            buttonText="SEE MORE"
            aspectRatio="aspect-square"
            cardMinHeight="min-h-0"
          />

          {/* Card 2: Patterns */}
          <ServiceCard
            title="PATTERNS"
            imageSrc="/assets/images/1.jpg"
            linkTo="/designs#gallery"
            buttonText="SEE MORE"
            aspectRatio="aspect-square"
            cardMinHeight="min-h-0"
          />

          {/* Card 3: Materials */}
          <ServiceCard
            title="MATERIALS"
            imageSrc="/assets/images/9.jpg"
            linkTo="/designs#materials"
            buttonText="SEE MORE"
            aspectRatio="aspect-square"
            cardMinHeight="min-h-0"
          />
        </div>
      </div>
    </section>
  );
}
