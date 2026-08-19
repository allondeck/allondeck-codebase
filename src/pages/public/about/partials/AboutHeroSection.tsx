import { TeamTeaserCard } from "../../../../components/features/TeamTeaserCard";

interface AboutHeroSectionProps {
  onViewBioClick: (id: string) => void;
}

export function AboutHeroSection({ onViewBioClick }: AboutHeroSectionProps) {
  return (
    <div className="mx-auto max-w-[1000px] px-6 lg:px-12 pt-16 pb-20 text-center">
      <h1 className="font-heading text-5xl font-black tracking-widest text-brand-cream uppercase sm:text-6xl lg:text-7xl">
        MEET OUR TEAM
      </h1>
      <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base italic leading-relaxed text-brand-light">
        A dedicated team with one shared goal: perfection in every detail.
        Discover the crew that makes it all happen.
      </p>

      {/* Hero Teaser Cards Grid */}
      <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-12 sm:gap-10 max-w-[800px] mx-auto">
        {/* Teaser 1: Ernesto Alvarez */}
        <TeamTeaserCard
          name="ERNESTO ALVAREZ"
          role="PRESIDENT."
          imageSrc="/assets/images/8.jpeg"
          bioSectionId="ernesto-bio"
          whatsappUrl="https://wa.me/18005550199"
          email="ernesto@allondeck.com"
          wavePosition="left"
          buttonClassName="bg-brand-cream text-brand-orange hover:bg-white"
          onViewBioClick={onViewBioClick}
        />

        {/* Teaser 2: Roselena Oropesa */}
        <TeamTeaserCard
          name="MNG. ROSELENA OROPESA"
          role="VICE PRESIDENT."
          imageSrc="/assets/images/6.jpeg"
          bioSectionId="roselena-bio"
          whatsappUrl="https://wa.me/18005550198"
          email="roselena@allondeck.com"
          wavePosition="right"
          buttonClassName="bg-brand-orange text-white hover:bg-brand-orange/90"
          onViewBioClick={onViewBioClick}
        />
      </div>
    </div>
  );
}
