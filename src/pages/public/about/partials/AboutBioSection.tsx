import { TeamBioCard } from "../../../../components/features/TeamBioCard";
import { AnimatedSection } from "../../../../components/ui/AnimatedSection";

export function AboutBioSection() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 lg:px-12 pb-24">
      <div className="flex flex-col md:gap-32">
        {/* Card 1: Ernesto Alvarez */}
        <AnimatedSection>
          <TeamBioCard
            id="ernesto-bio"
            name="Ernesto Alvarez"
            role="PRESIDENT."
            imageSrc="/assets/images/8.jpeg"
            bioText="A strategist with a vision for nautical innovation. He leads the expansion of All On Deck and ensures that every project combines cutting-edge materials with the highest standards of safety and comfort at sea."
            whatsappUrl="https://wa.me/18005550199"
            email="ernesto@allondeck.com"
          />
        </AnimatedSection>

        {/* Card 2: Roselena Oropesa */}
        <AnimatedSection>
          <TeamBioCard
            id="roselena-bio"
            name="Roselena Oropesa"
            role="VICE PRESIDENT."
            imageSrc="/assets/images/6.jpeg"
            bioText="Responsible for process optimization and technical precision. She oversees digital measurement and computer aided design, ensuring efficient workflows that result in millimeter-precise, high-end finishes."
            whatsappUrl="https://wa.me/18005550198"
            email="roselena@allondeck.com"
          />
        </AnimatedSection>
      </div>
    </div>
  );
}
