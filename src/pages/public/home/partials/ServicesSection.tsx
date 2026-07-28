import { ServiceCard } from "../../../../components/features/ServiceCard";

export function ServicesSection() {
  return (
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

        <div className="mt-12 text-center">
          <a
            href="/gallery"
            className="inline-flex items-center gap-2 rounded-full border border-brand-orange/60 bg-brand-orange/15 px-8 py-3.5 text-sm font-bold tracking-wider text-brand-orange uppercase hover:bg-brand-orange hover:text-white transition-all transform hover:scale-105 shadow-lg"
          >
            Explore Full Project Gallery →
          </a>
        </div>
      </div>
    </section>
  );
}
