import React from "react";
import { ServiceCard } from "../../../../components/features/ServiceCard";
import { ServiceRow } from "../../../../types/database";

interface ServicesHeroSectionProps {
  services: ServiceRow[];
  onActionClick: (id: string) => void;
}

export function ServicesHeroSection({ services, onActionClick }: ServicesHeroSectionProps) {
  const formatCardTitle = (title: string, cardTitle: string | null | undefined) => {
    const raw = cardTitle || title;
    if (raw.includes("\n")) {
      const parts = raw.split("\n");
      return (
        <>
          {parts.map((part, index) => (
            <React.Fragment key={index}>
              {part}
              {index < parts.length - 1 && <br />}
            </React.Fragment>
          ))}
        </>
      );
    }
    return raw;
  };

  return (
    <div className="mx-auto max-w-content px-6 lg:px-12 pt-10 sm:pt-12 md:pt-14 pb-20 text-center">
      <h1 className="font-heading text-4xl md:text-6xl font-black tracking-widest text-brand-orange uppercase">
        SERVICES
      </h1>

      {/* Services Grid */}
      <div className="mt-8 sm:mt-10 md:mt-12 grid gap-8 md:gap-10 lg:gap-8 xl:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-[480px] sm:max-w-[550px] md:max-w-[820px] lg:max-w-[1030px] xl:max-w-[1220px] 2xl:max-w-[1260px] mx-auto text-left">
        {services.map((service, idx) => (
          <ServiceCard
            key={service.id || `srv-${idx}`}
            title={formatCardTitle(service.title, service.card_title)}
            imageSrc={service.image_url}
            targetId={`service-${idx + 1}`}
            onActionClick={onActionClick}
          />
        ))}
      </div>
    </div>
  );
}

