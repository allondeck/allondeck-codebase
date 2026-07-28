import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";
import { DesignsHeroSection } from "./partials/DesignsHeroSection";
import { DesignsPatternsSection, type DesignPattern } from "./partials/DesignsPatternsSection";
import { DesignsColorsSection, type DesignColor } from "./partials/DesignsColorsSection";
import { DesignsMaterialsSection } from "./partials/DesignsMaterialsSection";
import { DesignsCustomBannerSection } from "./partials/DesignsCustomBannerSection";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export type { DesignColor, DesignPattern };

export default function Designs() {
  const [colors, setColors] = useState<DesignColor[]>([]);
  const [patterns, setPatterns] = useState<DesignPattern[]>([]);

  useEffect(() => {
    async function loadData() {
      const [colorsRes, patternsRes] = await Promise.all([
        supabase.from("design_colors").select("*").order("created_at"),
        supabase.from("design_patterns").select("*").order("created_at"),
      ]);
      if (colorsRes.data) setColors(colorsRes.data);
      if (patternsRes.data) setPatterns(patternsRes.data);
    }
    loadData();
  }, []);

  return (
    <div className="bg-brand-dark text-white font-sans">
      <DesignsHeroSection onActionClick={scrollToSection} />
      <DesignsPatternsSection patterns={patterns} />
      <DesignsColorsSection colors={colors} />
      <DesignsMaterialsSection />
      <DesignsCustomBannerSection />
    </div>
  );
}
