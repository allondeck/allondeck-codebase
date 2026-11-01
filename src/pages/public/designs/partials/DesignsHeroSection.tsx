import { motion } from "framer-motion";
import { ServiceCard } from "../../../../components/features/ServiceCard";
import {
  staggerContainerVariants,
  staggerCardVariants,
} from "../../../../components/ui/AnimatedSection";

interface DesignsHeroSectionProps {
  onActionClick: (id: string) => void;
}

export function DesignsHeroSection({ onActionClick }: DesignsHeroSectionProps) {
  return (
    <div className="relative overflow-hidden pt-16 pb-24">
      <div className="relative mx-auto max-w-content px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: "easeOut" }}
        >
          <h1 className="font-heading text-4xl md:text-6xl font-black tracking-widest text-brand-cream uppercase">
            DESIGNS
          </h1>
          <div className="mx-auto mt-2.5 sm:mt-3 h-1 w-16 bg-brand-orange rounded-full" />
        </motion.div>

        {/* 3-Card Grid */}
        <motion.div
          variants={staggerContainerVariants}
          initial="hidden"
          animate="visible"
          className="mt-8 sm:mt-10 md:mt-14 grid gap-8 md:gap-12 lg:gap-8 xl:gap-6 grid-cols-1 lg:grid-cols-3 max-w-md sm:max-w-lg lg:max-w-[960px] xl:max-w-[1140px] mx-auto text-left"
        >
          {/* Card 1: Colors */}
          <motion.div variants={staggerCardVariants} className="h-full">
            <ServiceCard
              title="COLORS"
              imageSrc="/assets/images/5.2.jpg"
              targetId="colors"
              onActionClick={onActionClick}
              aspectRatio="aspect-[3/4]"
            />
          </motion.div>

          {/* Card 2: Patterns */}
          <motion.div variants={staggerCardVariants} className="h-full">
            <ServiceCard
              title="PATTERNS"
              imageSrc="/assets/images/1.jpg"
              targetId="gallery"
              onActionClick={onActionClick}
              aspectRatio="aspect-[3/4]"
            />
          </motion.div>

          {/* Card 3: Materials */}
          <motion.div variants={staggerCardVariants} className="h-full">
            <ServiceCard
              title="MATERIALS"
              imageSrc="/assets/images/9.jpg"
              targetId="materials"
              onActionClick={onActionClick}
              aspectRatio="aspect-[3/4]"
            />
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
