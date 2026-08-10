import React, { useState, createContext, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SplashParticle {
  id: number;
  x: number;
  y: number;
  label?: string;
}

interface CastAndReelContextType {
  triggerSplash: (e: React.MouseEvent, label?: string) => void;
}

const CastAndReelContext = createContext<CastAndReelContextType>({
  triggerSplash: () => {},
});

export const useCastAndReel = () => useContext(CastAndReelContext);

export function CastAndReelProvider({ children }: { children: React.ReactNode }) {
  const [splashes, setSplashes] = useState<SplashParticle[]>([]);

  const triggerSplash = useCallback((e: React.MouseEvent, label?: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX || rect.left + rect.width / 2;
    const y = e.clientY || rect.top + rect.height / 2;

    const newId = Date.now() + Math.random();
    setSplashes((prev) => [...prev.slice(-5), { id: newId, x, y, label }]);

    setTimeout(() => {
      setSplashes((prev) => prev.filter((s) => s.id !== newId));
    }, 1200);
  }, []);

  return (
    <CastAndReelContext.Provider value={{ triggerSplash }}>
      {children}
      <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
        <AnimatePresence>
          {splashes.map((splash) => (
            <React.Fragment key={splash.id}>
              {/* Animated Fishing Line Curve (Cast) */}
              <svg className="absolute inset-0 h-full w-full">
                <motion.path
                  d={`M ${splash.x} ${splash.y} Q ${splash.x + 40} ${splash.y - 120}, ${window.innerWidth - 60} 30`}
                  fill="none"
                  stroke="#f97316"
                  strokeWidth="2"
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0, opacity: 0.9 }}
                  animate={{ pathLength: 1, opacity: [0.9, 1, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                />
              </svg>

              {/* Water Splash Bubbles */}
              {Array.from({ length: 6 }).map((_, i) => {
                const angle = (i * 60 * Math.PI) / 180;
                const distance = 25 + Math.random() * 20;
                const bubbleX = Math.cos(angle) * distance;
                const bubbleY = Math.sin(angle) * distance;

                return (
                  <motion.div
                    key={`${splash.id}-b-${i}`}
                    className="absolute h-3 w-3 rounded-full border border-cyan-300 bg-cyan-400/40 backdrop-blur-xs"
                    style={{ left: splash.x, top: splash.y }}
                    initial={{ scale: 0.2, x: 0, y: 0, opacity: 1 }}
                    animate={{
                      scale: [0.2, 1, 0.4],
                      x: bubbleX,
                      y: bubbleY - 15,
                      opacity: [1, 0.8, 0],
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                );
              })}

              {/* Label Toast / Reel Catch */}
              {splash.label && (
                <motion.div
                  className="absolute font-heading text-xs font-black tracking-widest text-brand-orange uppercase drop-shadow-md bg-brand-dark/90 px-2.5 py-1 rounded-full border border-brand-orange/40"
                  style={{ left: splash.x - 40, top: splash.y - 45 }}
                  initial={{ y: 0, opacity: 0, scale: 0.6 }}
                  animate={{ y: -20, opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  🎣 {splash.label}
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </AnimatePresence>
      </div>
    </CastAndReelContext.Provider>
  );
}
