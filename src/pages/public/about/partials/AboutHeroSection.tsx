import { motion } from "framer-motion";
import { TeamTeaserCard } from "../../../../components/features/TeamTeaserCard";
import {
  staggerContainerVariants,
  staggerCardVariants,
} from "../../../../components/ui/AnimatedSection";

interface AboutHeroSectionProps {
  onViewBioClick: (id: string) => void;
  activeBioId?: string | null;
}

export function AboutHeroSection({
  onViewBioClick,
  activeBioId,
}: AboutHeroSectionProps) {
  return (
    <div className="mx-auto max-w-[1000px] px-6 lg:px-12 pt-16 pb-20 text-center">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: "easeOut" }}
      >
        <h1 className="font-heading text-4xl md:text-6xl font-black tracking-widest text-brand-cream uppercase">
          MEET OUR TEAM
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base md:text-lg italic leading-relaxed text-brand-light font-sans text-balance">
          A dedicated team with one shared goal: perfection in every detail.{" "}
          <br className="hidden md:inline" />
          Discover the crew that makes it all happen.
        </p>
        <div className="mx-auto mt-3 h-1 w-12 bg-brand-orange" />
      </motion.div>

      {/* Hero Teaser Cards Grid */}
      <motion.div
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
        className="mt-16 flex flex-col sm:flex-row justify-center items-center gap-12 sm:gap-10 max-w-[800px] mx-auto"
      >
        {/* Teaser 1: Ernesto Alvarez */}
        <motion.div variants={staggerCardVariants} className="w-full flex justify-center">
          <TeamTeaserCard
            name="ERNESTO ALVAREZ"
            role="PRESIDENT."
            imageSrc="/assets/images/8.jpeg"
            bioSectionId="ernesto-bio"
            whatsappUrl="https://wa.me/18005550199"
            email="ernesto@allondeck.com"
            wavePosition="left"
            isActive={activeBioId === "ernesto-bio"}
            onViewBioClick={onViewBioClick}
          />
        </motion.div>

        {/* Teaser 2: Roselena Oropesa */}
        <motion.div variants={staggerCardVariants} className="w-full flex justify-center">
          <TeamTeaserCard
            name="MNG. ROSELENA OROPESA"
            role="VICE PRESIDENT."
            imageSrc="/assets/images/6.jpeg"
            bioSectionId="roselena-bio"
            whatsappUrl="https://wa.me/18005550198"
            email="roselena@allondeck.com"
            wavePosition="right"
            isActive={activeBioId === "roselena-bio"}
            onViewBioClick={onViewBioClick}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
