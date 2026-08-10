import { TeamTeaserCard } from "../../../../components/features/TeamTeaserCard";

export function TeamSection() {
  return (
    <section className="pt-16 pb-24 bg-brand-dark text-white">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <div className="text-center">
          <h2 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-widest text-brand-cream uppercase">
            MEET OUR TEAM
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm md:text-base italic leading-relaxed text-brand-light font-sans">
            A dedicated team with one shared goal: perfection in every detail.
            Discover the crew that makes it all happen.
          </p>
          <div className="mx-auto mt-4 h-1 w-12 bg-brand-orange" />
        </div>

        <div className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-14 sm:gap-16 max-w-[840px] mx-auto">
          {/* Team Member 1: Ernesto Alvarez */}
          <TeamTeaserCard
            name="ERNESTO ALVAREZ"
            role="PRESIDENT."
            imageSrc="/assets/images/8.jpeg"
            to="/about#bio-ernesto"
            whatsappUrl="https://wa.me/18005550199"
            email="ernesto@allondeck.com"
            wavePosition="left"
          />

          {/* Team Member 2: Roselena Oropesa */}
          <TeamTeaserCard
            name="MNG. ROSELENA OROPESA"
            role="VICE PRESIDENT."
            imageSrc="/assets/images/6.jpeg"
            to="/about#bio-roselena"
            whatsappUrl="https://wa.me/18005550198"
            email="roselena@allondeck.com"
            wavePosition="right"
          />
        </div>
      </div>
    </section>
  );
}
