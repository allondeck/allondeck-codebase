import { motion } from "framer-motion";
import { Wave } from "./Wave";

interface AnimatedWaveDividerProps {
  className?: string;
  flip?: boolean;
}

export function AnimatedWaveDivider({ className = "", flip = false }: AnimatedWaveDividerProps) {
  return (
    <div
      className={`relative w-full overflow-hidden leading-none select-none pointer-events-none ${
        flip ? "rotate-180" : ""
      } ${className}`}
    >
      <motion.div
        className="w-[200%] flex text-brand-light opacity-90"
        animate={{
          x: ["0%", "-50%"],
        }}
        transition={{
          repeat: Infinity,
          duration: 18,
          ease: "linear",
        }}
        style={{ willChange: "transform" }}
      >
        <Wave className="w-1/2 h-10 sm:h-14 md:h-16 shrink-0" />
        <Wave className="w-1/2 h-10 sm:h-14 md:h-16 shrink-0" />
      </motion.div>
    </div>
  );
}
