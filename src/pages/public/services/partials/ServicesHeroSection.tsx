import { ServiceCard } from "../../../../components/features/ServiceCard";

interface ServicesHeroSectionProps {
  onActionClick: (id: string) => void;
}

export function ServicesHeroSection({ onActionClick }: ServicesHeroSectionProps) {
  return (
    <div className="mx-auto max-w-content px-6 lg:px-12 pt-10 sm:pt-12 md:pt-14 pb-20 text-center">
      <h1 className="font-heading text-5xl font-black tracking-widest text-brand-orange uppercase sm:text-6xl lg:text-7xl">
        SERVICES
      </h1>

      {/* 3-Card Grid */}
      <div className="mt-8 sm:mt-10 md:mt-12 grid gap-8 md:gap-12 lg:gap-8 xl:gap-6 grid-cols-1 lg:grid-cols-3 max-w-md sm:max-w-lg lg:max-w-[960px] xl:max-w-[1140px] mx-auto text-left">
        {/* Card 1: Custom Deck Designs */}
        <ServiceCard
          title={
            <>
              Custom
              <br />
              Deck Designs
            </>
          }
          imageSrc="/assets/images/1.jpg"
          targetId="service-1"
          onActionClick={onActionClick}
        />

        {/* Card 2: Floor Manufacturing */}
        <ServiceCard
          title={
            <>
              Floor
              <br />
              Manufacturing
            </>
          }
          imageSrc="/assets/images/2.jpg"
          targetId="service-2"
          onActionClick={onActionClick}
        />

        {/* Card 3: Cutting and Installation */}
        <ServiceCard
          title={
            <>
              Cutting and
              <br />
              Installation
            </>
          }
          imageSrc="/assets/images/3.jpg"
          targetId="service-3"
          onActionClick={onActionClick}
        />
      </div>
    </div>
  );
}
