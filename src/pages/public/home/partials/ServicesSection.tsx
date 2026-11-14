import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useServices } from "../../../../hooks/useServices";
import { ServiceCard } from "../../../../components/features/ServiceCard";
import { AnimatedWaveDivider } from "../../../../components/ui/AnimatedWaveDivider";

export function ServicesSection() {
  const { services } = useServices();

  return (
    <section className="bg-brand-dark pt-6 sm:pt-8 md:pt-4 pb-6 sm:pb-8 lg:pb-8 text-white relative z-10">
      <AnimatedWaveDivider className="hidden md:block relative z-20 -mt-10 md:-mt-12 mb-2 sm:mb-3 opacity-90" />

      <div className="relative mx-auto max-w-content px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-widest text-brand-cream text-center uppercase drop-shadow-md">
            SERVICES
          </h2>
          <div className="mx-auto mt-2.5 sm:mt-3 h-1 w-16 bg-brand-orange rounded-full origin-center" />
        </motion.div>

        {/* 3-Card Grid */}
        <div className="mt-4 sm:mt-5 lg:mt-6 grid gap-5 sm:gap-6 lg:gap-6 xl:gap-7 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-[420px] sm:max-w-[500px] md:max-w-[800px] lg:max-w-[1060px] xl:max-w-[1160px] 2xl:max-w-[1200px] mx-auto">
          {services.map((service, idx) => (
            <div
              key={service.id || `srv-${idx}`}
              className="h-full"
            >
              <ServiceCard
                title={service.card_title || service.title}
                imageSrc={service.image_url}
                linkTo={`/services#service-${idx + 1}`}
                buttonText="See More"
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA with Spring Hover Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-4 sm:mt-5 text-center"
        >
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 rounded-full border border-brand-orange/60 bg-brand-orange/15 px-6 py-2.5 text-xs sm:text-sm font-bold tracking-wider text-brand-orange uppercase hover:bg-brand-orange hover:text-white transition-all shadow-lg hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange min-h-[40px]"
          >
            Explore Full Project Gallery →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
