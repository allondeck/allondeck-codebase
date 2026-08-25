import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, Variants } from "framer-motion";
import { supabase } from "../../../../lib/supabase";
import { ServiceRow } from "../../../../types/database";
import { ServiceCard } from "../../../../components/features/ServiceCard";
import { AnimatedWaveDivider } from "../../../../components/ui/AnimatedWaveDivider";

const DEFAULT_SERVICES: ServiceRow[] = [
  {
    id: "default-1",
    title: "Custom DECK Designs",
    card_title: "Custom DECK Designs",
    description: "",
    secondary_description: null,
    image_url: "/assets/images/1.jpg",
    cta_text: "See More",
    cta_link: "/services#service-1",
    display_order: 1,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "default-2",
    title: "Floor Manufacturing",
    card_title: "Floor Manufacturing",
    description: "",
    secondary_description: null,
    image_url: "/assets/images/2.jpg",
    cta_text: "See More",
    cta_link: "/services#service-2",
    display_order: 2,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "default-3",
    title: "Cutting and Installation",
    card_title: "Cutting and Installation",
    description: "",
    secondary_description: null,
    image_url: "/assets/images/3.jpg",
    cta_text: "See More",
    cta_link: "/services#service-3",
    display_order: 3,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.1,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 35, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 140,
      damping: 18,
    },
  },
};

export function ServicesSection() {
  const [services, setServices] = useState<ServiceRow[]>(DEFAULT_SERVICES);

  useEffect(() => {
    async function loadServices() {
      try {
        const { data, error } = await supabase
          .from("services")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: true });

        if (!error && data && data.length > 0) {
          setServices(data);
        }
      } catch (err) {
        console.error("Error loading home services:", err);
      }
    }
    loadServices();
  }, []);

  return (
    <section className="bg-brand-dark pt-4 sm:pt-6 md:pt-8 pb-20 md:pb-28 text-white relative overflow-hidden">
      <AnimatedWaveDivider className="-mt-8 mb-6 opacity-75" />

      <div className="relative mx-auto max-w-content px-6 lg:px-12">
        {/* Animated Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center"
        >
          <h2 className="font-heading text-5xl sm:text-7xl md:text-8xl font-black tracking-widest text-brand-cream text-center uppercase drop-shadow-md">
            SERVICES
          </h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mx-auto mt-4 h-1.5 w-20 bg-brand-orange rounded-full origin-center"
          />
        </motion.div>

        {/* 3-Card Grid with Staggered Scroll Entrance */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-8 sm:mt-10 md:mt-12 grid gap-8 md:gap-12 lg:gap-8 xl:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 max-w-md sm:max-w-lg md:max-w-3xl lg:max-w-[960px] xl:max-w-[1140px] mx-auto"
        >
          {services.map((service, idx) => (
            <motion.div
              key={service.id || `srv-${idx}`}
              variants={cardVariants}
              className="h-full"
            >
              <ServiceCard
                title={service.card_title || service.title}
                imageSrc={service.image_url}
                linkTo={`/services#service-${idx + 1}`}
                buttonText="See More"
                buttonClassName="!py-4 lg:!py-4"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA with Spring Hover Animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link
            to="/gallery"
            className="inline-flex items-center gap-2 rounded-full border border-brand-orange/60 bg-brand-orange/15 px-8 py-3.5 text-sm font-bold tracking-wider text-brand-orange uppercase hover:bg-brand-orange hover:text-white transition-all shadow-lg hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-orange min-h-[44px]"
          >
            Explore Full Project Gallery →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
