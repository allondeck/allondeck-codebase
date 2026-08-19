import { ServiceCard } from "../../../../components/features/ServiceCard";

interface DesignsHeroSectionProps {
  onActionClick: (id: string) => void;
}

export function DesignsHeroSection({ onActionClick }: DesignsHeroSectionProps) {
  return (
    <div className="relative overflow-hidden pt-16 pb-24">
      <div className="relative mx-auto max-w-content px-6 lg:px-12 text-center">
        <h1 className="font-heading text-5xl font-black tracking-widest text-brand-cream uppercase sm:text-6xl lg:text-7xl">
          DESIGNS
        </h1>

        {/* 3-Card Grid */}
        <div className="mt-8 sm:mt-10 md:mt-14 grid gap-8 md:gap-12 lg:gap-8 xl:gap-6 grid-cols-1 lg:grid-cols-3 max-w-md sm:max-w-lg lg:max-w-[960px] xl:max-w-[1140px] mx-auto text-left">
          {/* Card 1: Colors */}
          <ServiceCard
            title="COLORS"
            imageSrc="/assets/images/5.2.jpg"
            targetId="colors"
            onActionClick={onActionClick}
            aspectRatio="aspect-square"
            cardMinHeight="min-h-0"
          />

          {/* Card 2: Patterns */}
          <ServiceCard
            title="PATTERNS"
            imageSrc="/assets/images/1.jpg"
            targetId="gallery"
            onActionClick={onActionClick}
            aspectRatio="aspect-square"
            cardMinHeight="min-h-0"
          />

          {/* Card 3: Materials */}
          <ServiceCard
            title="MATERIALS"
            imageSrc="/assets/images/9.jpg"
            targetId="materials"
            onActionClick={onActionClick}
            aspectRatio="aspect-square"
            cardMinHeight="min-h-0"
          />
        </div>
      </div>
    </div>
  );
}
