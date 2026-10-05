import { TeamTeaserCard } from "../../../../components/features/TeamTeaserCard";

export function TeamSection() {
  return (
    <section className="scroll-mt-16 pt-16 sm:pt-20 lg:pt-20 pb-10 sm:pb-12 lg:pb-14 bg-brand-dark text-white">
      <div className="mx-auto max-w-content px-6 lg:px-12">
        <div className="text-center">
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-widest text-brand-cream uppercase">
            MEET OUR TEAM
          </h2>
          <p className="mx-auto mt-2 sm:mt-2.5 max-w-xl text-xs sm:text-sm md:text-base italic leading-relaxed text-brand-light font-sans text-balance">
            A dedicated team with one shared goal: perfection in every detail.{" "}
            <br className="hidden md:inline" />
            Discover the crew that makes it all happen.
          </p>
          <div className="mx-auto mt-2 sm:mt-2.5 h-1 w-12 bg-brand-orange" />
        </div>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-10 md:gap-12 max-w-[680px] mx-auto">
          {/* Team Member 1: Ernesto Alvarez */}
          <TeamTeaserCard
            name="ERNESTO ALVAREZ"
            role="PRESIDENT."
            imageSrc="/assets/images/8.jpeg"
            to="/about#ernesto-bio"
            whatsappUrl="https://wa.me/18005550199"
            email="ernesto@allondeck.com"
            wavePosition="left"
          />

          {/* Team Member 2: Roselena Oropesa */}
          <TeamTeaserCard
            name="MNG. ROSELENA OROPESA"
            role="VICE PRESIDENT."
            imageSrc="/assets/images/6.jpeg"
            to="/about#roselena-bio"
            whatsappUrl="https://wa.me/18005550198"
            email="roselena@allondeck.com"
            wavePosition="right"
          />
        </div>
      </div>
    </section>
  );
}
