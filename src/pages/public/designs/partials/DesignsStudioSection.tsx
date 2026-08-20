import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sparkles,
  Sun,
  Moon,
  Droplets,
  Ruler,
  ShieldCheck,
  ArrowRight,
  RotateCcw,
  Check,
  SlidersHorizontal,
  Compass,
} from "lucide-react";
import type { DesignColor, DesignPattern } from "../index";

interface DesignsStudioSectionProps {
  colors: DesignColor[];
  patterns: DesignPattern[];
}

type HullType = "center-console" | "bowrider" | "pontoon" | "swim-platform";
type DeckZone = "all" | "bow" | "cockpit" | "helm" | "platform";
type PatternType = "teak" | "hexagon" | "diamond" | "scales" | "brushed";
type EnvMode = "sun" | "night" | "wet";

interface ZoneStyle {
  topColorHex: string;
  topColorName: string;
  accentColorHex: string;
  accentColorName: string;
  pattern: PatternType;
}

const DEFAULT_TOP_COLORS = [
  { name: "Classic Teak", hex: "#c19a6b" },
  { name: "Slate Grey", hex: "#5a6475" },
  { name: "Carbon Black", hex: "#1e2229" },
  { name: "Desert Sand", hex: "#c2a06e" },
  { name: "Sea Foam", hex: "#4a9e8b" },
  { name: "Ocean Navy", hex: "#1b3a6b" },
  { name: "Arctic White", hex: "#f0f2f5" },
  { name: "Coral Drift", hex: "#d4704a" },
  { name: "Driftwood", hex: "#8b7355" },
];

const DEFAULT_ACCENT_COLORS = [
  { name: "Midnight Black", hex: "#0f1115" },
  { name: "Safety Orange", hex: "#e98e2e" },
  { name: "Storm White", hex: "#f8fafc" },
  { name: "Ice Blue", hex: "#529ab0" },
  { name: "Electric Blue", hex: "#0284c7" },
  { name: "Teak Tan", hex: "#c19a6b" },
];

const PRESETS = [
  {
    id: "yachtsman",
    name: "Classic Yachtsman",
    desc: "Timeless teak timber styling with midnight black routed lines.",
    topColor: { name: "Classic Teak", hex: "#c19a6b" },
    accentColor: { name: "Midnight Black", hex: "#0f1115" },
    pattern: "teak" as PatternType,
    hull: "center-console" as HullType,
  },
  {
    id: "offshore",
    name: "Offshore Angler",
    desc: "Aggressive modern slate grey with high-contrast safety orange.",
    topColor: { name: "Slate Grey", hex: "#5a6475" },
    accentColor: { name: "Safety Orange", hex: "#e98e2e" },
    pattern: "hexagon" as PatternType,
    hull: "center-console" as HullType,
    ruler: true,
  },
  {
    id: "stealth",
    name: "Midnight Stealth",
    desc: "Sleek carbon black with ice blue luxury diamond quilting.",
    topColor: { name: "Carbon Black", hex: "#1e2229" },
    accentColor: { name: "Ice Blue", hex: "#529ab0" },
    pattern: "diamond" as PatternType,
    hull: "bowrider" as HullType,
  },
  {
    id: "florida",
    name: "Florida Keys Breeze",
    desc: "Cool seafoam green with crisp storm white wave scales.",
    topColor: { name: "Sea Foam", hex: "#4a9e8b" },
    accentColor: { name: "Storm White", hex: "#f8fafc" },
    pattern: "scales" as PatternType,
    hull: "pontoon" as HullType,
  },
];

export function DesignsStudioSection({ colors }: DesignsStudioSectionProps) {
  const navigate = useNavigate();

  // Combine database colors with fallback defaults
  const availableTopColors = useMemo(() => {
    if (colors && colors.length > 0) {
      return colors.map((c) => ({
        name: c.name,
        hex: c.hex_color || "#c19a6b",
      }));
    }
    return DEFAULT_TOP_COLORS;
  }, [colors]);

  // Studio State
  const [hull, setHull] = useState<HullType>("center-console");
  const [selectedZone, setSelectedZone] = useState<DeckZone>("all");
  const [envMode, setEnvMode] = useState<EnvMode>("sun");
  const [thickness, setThickness] = useState<"6mm" | "9mm">("6mm");
  const [vesselName, setVesselName] = useState("ALL ON DECK");
  const [showRuler, setShowRuler] = useState(true);

  // Global / active color & pattern selections
  const [currentTopColor, setCurrentTopColor] = useState(availableTopColors[0] || DEFAULT_TOP_COLORS[0]);
  const [currentAccentColor, setCurrentAccentColor] = useState(DEFAULT_ACCENT_COLORS[0]);
  const [currentPattern, setCurrentPattern] = useState<PatternType>("teak");

  // Zone overrides map
  const [zoneOverrides, setZoneOverrides] = useState<Partial<Record<DeckZone, ZoneStyle>>>({});

  // Get effective style for a zone
  const getZoneStyle = (zone: DeckZone): ZoneStyle => {
    if (zoneOverrides[zone]) {
      return zoneOverrides[zone]!;
    }
    return {
      topColorHex: currentTopColor.hex,
      topColorName: currentTopColor.name,
      accentColorHex: currentAccentColor.hex,
      accentColorName: currentAccentColor.name,
      pattern: currentPattern,
    };
  };

  // Update style for selected zone or all
  const handleTopColorChange = (color: { name: string; hex: string }) => {
    setCurrentTopColor(color);
    if (selectedZone === "all") {
      setZoneOverrides({});
    } else {
      setZoneOverrides((prev) => ({
        ...prev,
        [selectedZone]: {
          ...getZoneStyle(selectedZone),
          topColorHex: color.hex,
          topColorName: color.name,
        },
      }));
    }
  };

  const handleAccentColorChange = (color: { name: string; hex: string }) => {
    setCurrentAccentColor(color);
    if (selectedZone === "all") {
      setZoneOverrides({});
    } else {
      setZoneOverrides((prev) => ({
        ...prev,
        [selectedZone]: {
          ...getZoneStyle(selectedZone),
          accentColorHex: color.hex,
          accentColorName: color.name,
        },
      }));
    }
  };

  const handlePatternChange = (pat: PatternType) => {
    setCurrentPattern(pat);
    if (selectedZone === "all") {
      setZoneOverrides({});
    } else {
      setZoneOverrides((prev) => ({
        ...prev,
        [selectedZone]: {
          ...getZoneStyle(selectedZone),
          pattern: pat,
        },
      }));
    }
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    setHull(preset.hull);
    setSelectedZone("all");
    setZoneOverrides({});
    setCurrentTopColor(preset.topColor);
    setCurrentAccentColor(preset.accentColor);
    setCurrentPattern(preset.pattern);
    if (preset.ruler !== undefined) setShowRuler(preset.ruler);
  };

  const handleReset = () => {
    setZoneOverrides({});
    setCurrentTopColor(availableTopColors[0] || DEFAULT_TOP_COLORS[0]);
    setCurrentAccentColor(DEFAULT_ACCENT_COLORS[0]);
    setCurrentPattern("teak");
    setSelectedZone("all");
  };

  // Navigate to Estimate pre-filling data
  const handleRequestEstimate = () => {
    const activeStyle = getZoneStyle("all");
    const summaryNotes = [
      `Design Studio Build:`,
      `- Vessel Silhouette: ${hull.toUpperCase()}`,
      `- Primary Foam: ${activeStyle.topColorName} (${activeStyle.topColorHex})`,
      `- Accent Underlayer: ${activeStyle.accentColorName} (${activeStyle.accentColorHex})`,
      `- Routing Pattern: ${activeStyle.pattern.toUpperCase()}`,
      `- Thickness: ${thickness}`,
      vesselName ? `- Custom Engraved Name: "${vesselName}"` : "",
      showRuler ? `- 36" Laser Fish Ruler Inlay: Yes` : "",
    ]
      .filter(Boolean)
      .join("\n");

    navigate("/estimate", {
      state: {
        boatModel: `${hull.replace("-", " ").toUpperCase()} (Custom Deck)`,
        message: summaryNotes,
      },
    });
  };

  // SVG Pattern definitions based on active colors
  const activeStyle = getZoneStyle(selectedZone === "all" ? "cockpit" : selectedZone);

  return (
    <section
      id="studio"
      className="relative bg-brand-dark py-16 sm:py-20 md:py-24 text-white border-t border-brand-medium/30 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-brand-medium/20 blur-[140px] rounded-full pointer-events-none" />

      <div className="relative mx-auto max-w-content px-4 sm:px-6 lg:px-12">
        {/* Studio Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-orange/40 bg-brand-orange/10 px-4 py-1.5 text-xs font-mono font-bold tracking-widest text-brand-orange uppercase mb-3 shadow-inner">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE DECK BUILDER STUDIO</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black tracking-widest text-brand-cream uppercase drop-shadow-md">
            DESIGN YOUR DECK
          </h2>
          <p className="mt-3 text-sm sm:text-base md:text-lg text-brand-light italic font-sans">
            Choose your hull, select dual-layer marine foam colors, and test CNC routing patterns live on your boat.
          </p>
          <div className="mx-auto mt-4 h-1.5 w-20 bg-brand-orange rounded-full" />
        </div>

        {/* ========================================================================= */}
        {/* CURATED PRESET QUICK PACKS */}
        {/* ========================================================================= */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-brand-cream font-bold flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-brand-orange" />
              POPULAR DESIGN PACKS
            </span>
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-brand-light/80 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset)}
                className="group relative rounded-2xl border border-brand-light/20 bg-brand-dark-alt/80 p-3.5 sm:p-4 text-left transition-all hover:border-brand-orange/60 hover:bg-brand-dark-alt shadow-lg hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-4 h-4 rounded-full border border-white/30 shadow-inner"
                      style={{ backgroundColor: preset.topColor.hex }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-white/30 shadow-inner -ml-2"
                      style={{ backgroundColor: preset.accentColor.hex }}
                    />
                  </div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-brand-light/70 bg-white/5 px-2 py-0.5 rounded">
                    {preset.pattern}
                  </span>
                </div>
                <div className="font-heading text-xs sm:text-sm font-bold text-brand-cream group-hover:text-brand-orange transition-colors truncate">
                  {preset.name}
                </div>
                <div className="text-[11px] text-white/60 line-clamp-1 mt-0.5">
                  {preset.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN STUDIO INTERFACE: (Left: Live Boat Canvas / Right: Studio Controls) */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ----------------------------------------------------------------------- */}
          {/* LEFT: LIVE BOAT CANVAS & ENVIRONMENT SIMULATOR (7 Cols) */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Hull Silhouette Selector Tabs */}
            <div className="flex items-center justify-between bg-brand-dark-alt/90 backdrop-blur-md p-1.5 rounded-2xl border border-brand-light/20 gap-1 overflow-x-auto">
              {[
                { id: "center-console", label: "Center Console", icon: "🚤" },
                { id: "bowrider", label: "Bowrider / Dual", icon: "⛵" },
                { id: "pontoon", label: "Pontoon Deck", icon: "🛥️" },
                { id: "swim-platform", label: "Swim Platform", icon: "🏊" },
              ].map((h) => (
                <button
                  key={h.id}
                  type="button"
                  onClick={() => setHull(h.id as HullType)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex-1 justify-center ${
                    hull === h.id
                      ? "bg-brand-orange text-white shadow-lg"
                      : "text-brand-cream/70 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span>{h.icon}</span>
                  <span className="hidden sm:inline">{h.label}</span>
                </button>
              ))}
            </div>

            {/* Main Interactive Boat Render Card */}
            <div
              className={`relative w-full rounded-[2.5rem] border border-brand-light/25 shadow-2xl overflow-hidden transition-all duration-700 ${
                envMode === "sun"
                  ? "bg-gradient-to-b from-[#075369] via-[#053d4e] to-brand-dark"
                  : envMode === "night"
                  ? "bg-gradient-to-b from-[#021017] via-[#031c26] to-[#01080d]"
                  : "bg-gradient-to-b from-[#064e63] via-[#043e4f] to-brand-dark"
              }`}
            >
              {/* Dynamic Water & Lighting Effect */}
              {envMode === "sun" && (
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-200/15 via-transparent to-transparent pointer-events-none" />
              )}
              {envMode === "night" && (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/20 via-blue-600/10 to-transparent pointer-events-none animate-pulse" />
              )}
              {envMode === "wet" && (
                <div className="absolute inset-0 bg-[radial-gradient(#76abbf_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-40 pointer-events-none" />
              )}

              {/* Top Canvas Bar (Zone indicator & Environment switch) */}
              <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 p-4 sm:p-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-brand-orange animate-ping inline-block" />
                  <span className="text-xs font-mono font-bold tracking-wider text-brand-cream uppercase">
                    ACTIVE ZONE:{" "}
                    <span className="text-brand-orange">{selectedZone.toUpperCase()}</span>
                  </span>
                </div>

                {/* Environment Mode Switcher */}
                <div className="flex items-center bg-black/40 backdrop-blur-md rounded-xl p-1 border border-white/10 text-xs">
                  <button
                    type="button"
                    onClick={() => setEnvMode("sun")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all ${
                      envMode === "sun"
                        ? "bg-brand-orange text-white shadow"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    <Sun className="w-3.5 h-3.5 text-amber-300" />
                    <span>Sun</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnvMode("night")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all ${
                      envMode === "night"
                        ? "bg-cyan-500 text-black shadow font-black"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    <Moon className="w-3.5 h-3.5" />
                    <span>RGB</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEnvMode("wet")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-bold transition-all ${
                      envMode === "wet"
                        ? "bg-brand-light text-brand-dark shadow font-black"
                        : "text-white/60 hover:text-white"
                    }`}
                  >
                    <Droplets className="w-3.5 h-3.5 text-blue-200" />
                    <span>Wet</span>
                  </button>
                </div>
              </div>

              {/* ----------------------------------------------------------------- */}
              {/* SVG 2D BOAT HULL & DECK CANVAS */}
              {/* ----------------------------------------------------------------- */}
              <div className="relative z-10 w-full min-h-[380px] sm:min-h-[460px] flex items-center justify-center p-4 sm:p-8">
                <svg
                  className="w-full max-w-[340px] sm:max-w-[400px] h-[380px] sm:h-[450px] drop-shadow-[0_20px_35px_rgba(0,0,0,0.6)] select-none transition-all duration-500"
                  viewBox="0 0 300 500"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Pattern Definitions */}
                  <defs>
                    {/* Teak Planks Pattern */}
                    <pattern
                      id="pat-teak"
                      width="10"
                      height="20"
                      patternUnits="userSpaceOnUse"
                    >
                      <rect width="10" height="20" fill={getZoneStyle("cockpit").topColorHex} />
                      <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="20"
                        stroke={getZoneStyle("cockpit").accentColorHex}
                        strokeWidth="1.2"
                      />
                    </pattern>

                    {/* Hexagon Pattern */}
                    <pattern
                      id="pat-hexagon"
                      width="16"
                      height="16"
                      patternUnits="userSpaceOnUse"
                    >
                      <rect width="16" height="16" fill={getZoneStyle("cockpit").topColorHex} />
                      <path
                        d="M8 0 L16 4 L16 12 L8 16 L0 12 L0 4 Z"
                        fill="none"
                        stroke={getZoneStyle("cockpit").accentColorHex}
                        strokeWidth="1.2"
                      />
                    </pattern>

                    {/* Diamond Pattern */}
                    <pattern
                      id="pat-diamond"
                      width="14"
                      height="14"
                      patternUnits="userSpaceOnUse"
                    >
                      <rect width="14" height="14" fill={getZoneStyle("cockpit").topColorHex} />
                      <path
                        d="M7 0 L14 7 L7 14 L0 7 Z"
                        fill="none"
                        stroke={getZoneStyle("cockpit").accentColorHex}
                        strokeWidth="1.2"
                      />
                    </pattern>

                    {/* Scales Pattern */}
                    <pattern
                      id="pat-scales"
                      width="16"
                      height="12"
                      patternUnits="userSpaceOnUse"
                    >
                      <rect width="16" height="12" fill={getZoneStyle("cockpit").topColorHex} />
                      <path
                        d="M0 12 Q8 0 16 12"
                        fill="none"
                        stroke={getZoneStyle("cockpit").accentColorHex}
                        strokeWidth="1.2"
                      />
                    </pattern>

                    {/* Night RGB Glow Filter */}
                    <filter id="rgbGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Outer Boat Fiberglass Hull Silhouette */}
                  <path
                    d="M 150 20 C 70 80, 40 180, 40 380 C 40 430, 70 470, 150 475 C 230 470, 260 430, 260 380 C 260 180, 230 80, 150 20 Z"
                    fill="#0f2631"
                    stroke={envMode === "night" ? "#06b6d4" : "#ffffff"}
                    strokeWidth={envMode === "night" ? "3" : "2"}
                    strokeOpacity={envMode === "night" ? "0.9" : "0.4"}
                    filter={envMode === "night" ? "url(#rgbGlow)" : undefined}
                  />

                  {/* Gunwales / Outer Rub Rail */}
                  <path
                    d="M 150 32 C 85 88, 55 180, 55 375 C 55 420, 80 455, 150 460 C 220 455, 245 420, 245 375 C 245 180, 215 88, 150 32 Z"
                    fill="none"
                    stroke="#ffffff"
                    strokeWidth="1"
                    strokeOpacity="0.2"
                  />

                  {/* ------------------------------------------------------------- */}
                  {/* ZONE 1: BOW CASTING DECK (Top) */}
                  {/* ------------------------------------------------------------- */}
                  <g
                    className="cursor-pointer transition-transform hover:opacity-95"
                    onClick={() => setSelectedZone("bow")}
                  >
                    <path
                      d="M 150 45 C 105 90, 75 160, 75 200 L 225 200 C 225 160, 195 90, 150 45 Z"
                      fill={`url(#pat-${getZoneStyle("bow").pattern})`}
                      stroke={selectedZone === "bow" ? "#e98e2e" : "#000000"}
                      strokeWidth={selectedZone === "bow" ? "3" : "1"}
                    />
                    <text
                      x="150"
                      y="140"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                      className="pointer-events-none select-none drop-shadow"
                    >
                      BOW DECK
                    </text>
                  </g>

                  {/* ------------------------------------------------------------- */}
                  {/* ZONE 2: COCKPIT MAIN FLOOR (Middle) */}
                  {/* ------------------------------------------------------------- */}
                  <g
                    className="cursor-pointer transition-transform hover:opacity-95"
                    onClick={() => setSelectedZone("cockpit")}
                  >
                    <path
                      d="M 75 210 L 70 360 C 70 380, 90 395, 150 395 C 210 395, 230 380, 230 360 L 225 210 Z"
                      fill={`url(#pat-${getZoneStyle("cockpit").pattern})`}
                      stroke={selectedZone === "cockpit" ? "#e98e2e" : "#000000"}
                      strokeWidth={selectedZone === "cockpit" ? "3" : "1"}
                    />
                    <text
                      x="150"
                      y="310"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                      className="pointer-events-none select-none drop-shadow"
                    >
                      COCKPIT FLOOR
                    </text>
                  </g>

                  {/* ------------------------------------------------------------- */}
                  {/* ZONE 3: HELM STATION ANTI-FATIGUE PAD (Center Console) */}
                  {/* ------------------------------------------------------------- */}
                  <g
                    className="cursor-pointer transition-transform hover:opacity-95"
                    onClick={() => setSelectedZone("helm")}
                  >
                    <rect
                      x="110"
                      y="235"
                      width="80"
                      height="48"
                      rx="6"
                      fill={getZoneStyle("helm").topColorHex}
                      stroke={selectedZone === "helm" ? "#e98e2e" : getZoneStyle("helm").accentColorHex}
                      strokeWidth={selectedZone === "helm" ? "2.5" : "1.5"}
                    />
                    <text
                      x="150"
                      y="255"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="7"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                      className="pointer-events-none drop-shadow"
                    >
                      HELM PAD
                    </text>

                    {/* Custom Engraved Boat Name */}
                    {vesselName && (
                      <text
                        x="150"
                        y="270"
                        textAnchor="middle"
                        fill={getZoneStyle("helm").accentColorHex}
                        fontSize="7"
                        fontWeight="900"
                        fontFamily="monospace"
                        letterSpacing="1"
                        className="pointer-events-none select-none drop-shadow-sm"
                      >
                        {vesselName.toUpperCase()}
                      </text>
                    )}
                  </g>

                  {/* ------------------------------------------------------------- */}
                  {/* ZONE 4: SWIM PLATFORM & TRANSOM STEPS (Bottom) */}
                  {/* ------------------------------------------------------------- */}
                  <g
                    className="cursor-pointer transition-transform hover:opacity-95"
                    onClick={() => setSelectedZone("platform")}
                  >
                    <path
                      d="M 65 410 C 65 440, 95 462, 150 462 C 205 462, 235 440, 235 410 L 225 402 C 190 410, 110 410, 75 402 Z"
                      fill={`url(#pat-${getZoneStyle("platform").pattern})`}
                      stroke={selectedZone === "platform" ? "#e98e2e" : "#000000"}
                      strokeWidth={selectedZone === "platform" ? "3" : "1"}
                    />
                    <text
                      x="150"
                      y="440"
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="8"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                      className="pointer-events-none select-none drop-shadow"
                    >
                      SWIM PLATFORM
                    </text>

                    {/* Optional Integrated 36" Fish Ruler Inlay */}
                    {showRuler && (
                      <g className="pointer-events-none">
                        <rect
                          x="95"
                          y="420"
                          width="110"
                          height="8"
                          rx="2"
                          fill={getZoneStyle("platform").accentColorHex}
                          opacity="0.9"
                        />
                        <text
                          x="150"
                          y="426.5"
                          textAnchor="middle"
                          fill="#ffffff"
                          fontSize="5.5"
                          fontWeight="bold"
                          fontFamily="monospace"
                        >
                          |-- 12" --|-- 24" --|-- 36" --|
                        </text>
                      </g>
                    )}
                  </g>
                </svg>
              </div>

              {/* Bottom Canvas Telemetry Badge */}
              <div className="relative z-10 p-4 bg-black/40 backdrop-blur-md border-t border-white/10 flex items-center justify-between text-xs font-mono text-brand-light">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>3M™ MARINE ADHESIVE BOND</span>
                </div>
                <div>
                  <span className="text-white font-bold">{thickness}</span> DUAL-DENSITY EVA
                </div>
              </div>
            </div>

            {/* Zone Selector Pill Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono uppercase text-brand-cream/80 font-bold mr-1">
                Customize Zone:
              </span>
              {[
                { id: "all", label: "Whole Boat" },
                { id: "bow", label: "Bow Deck" },
                { id: "cockpit", label: "Cockpit Floor" },
                { id: "helm", label: "Helm Pad" },
                { id: "platform", label: "Swim Platform" },
              ].map((z) => (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => setSelectedZone(z.id as DeckZone)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedZone === z.id
                      ? "bg-brand-orange text-white shadow-md scale-105"
                      : "bg-brand-dark-alt border border-brand-light/20 text-brand-cream/80 hover:text-white"
                  }`}
                >
                  {z.label}
                </button>
              ))}
            </div>
          </div>

          {/* ----------------------------------------------------------------------- */}
          {/* RIGHT: STUDIO CONTROLS & CUSTOMIZATION TOOLS (5 Cols) */}
          {/* ----------------------------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Control Panel Card */}
            <div className="rounded-[2.5rem] bg-brand-dark-alt/90 backdrop-blur-xl p-6 sm:p-8 border border-brand-light/25 shadow-2xl space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2 font-heading text-lg font-bold text-brand-cream uppercase">
                  <SlidersHorizontal className="w-5 h-5 text-brand-orange" />
                  <span>STUDIO CONTROLS</span>
                </div>
                <span className="text-xs font-mono text-brand-orange bg-brand-orange/10 px-2.5 py-1 rounded-full font-bold">
                  {thickness} EVA
                </span>
              </div>

              {/* 1. TOP FOAM BASE COLOR */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-cream font-bold mb-3 flex items-center justify-between">
                  <span>1. Top Foam Base Color</span>
                  <span className="text-brand-orange font-sans font-semibold text-xs">
                    {activeStyle.topColorName}
                  </span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2.5">
                  {availableTopColors.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => handleTopColorChange(color)}
                      className={`group relative flex flex-col items-center p-1.5 rounded-xl border transition-all ${
                        activeStyle.topColorHex === color.hex
                          ? "border-brand-orange ring-2 ring-brand-orange/40 bg-white/10 scale-105"
                          : "border-white/10 bg-black/20 hover:border-white/40"
                      }`}
                    >
                      <span
                        className="w-7 h-7 rounded-lg shadow-inner border border-white/20 flex items-center justify-center"
                        style={{ backgroundColor: color.hex }}
                      >
                        {activeStyle.topColorHex === color.hex && (
                          <Check className="w-3.5 h-3.5 text-white drop-shadow" />
                        )}
                      </span>
                      <span className="mt-1 text-[9px] font-sans font-medium text-white/80 truncate w-full text-center">
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. CNC ACCENT REVEAL COLOR (Underlayer) */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-cream font-bold mb-3 flex items-center justify-between">
                  <span>2. CNC Accent Reveal (Grooves)</span>
                  <span className="text-brand-orange font-sans font-semibold text-xs">
                    {activeStyle.accentColorName}
                  </span>
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {DEFAULT_ACCENT_COLORS.map((color) => (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => handleAccentColorChange(color)}
                      className={`flex flex-col items-center p-1.5 rounded-xl border transition-all ${
                        activeStyle.accentColorHex === color.hex
                          ? "border-brand-orange ring-2 ring-brand-orange/40 bg-white/10 scale-105"
                          : "border-white/10 bg-black/20 hover:border-white/40"
                      }`}
                    >
                      <span
                        className="w-6 h-6 rounded-lg shadow-inner border border-white/20 flex items-center justify-center"
                        style={{ backgroundColor: color.hex }}
                      >
                        {activeStyle.accentColorHex === color.hex && (
                          <Check className="w-3 h-3 text-white drop-shadow" />
                        )}
                      </span>
                      <span className="mt-1 text-[8px] font-sans font-medium text-white/70 truncate w-full text-center">
                        {color.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. CNC ROUTING PATTERNS */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-cream font-bold mb-3">
                  3. CNC Routing Pattern
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: "teak", label: "Classic Teak" },
                    { id: "hexagon", label: "Hex Mesh" },
                    { id: "diamond", label: "Diamond Quilt" },
                    { id: "scales", label: "Fish Scales" },
                  ].map((pat) => (
                    <button
                      key={pat.id}
                      type="button"
                      onClick={() => handlePatternChange(pat.id as PatternType)}
                      className={`p-2.5 rounded-xl border text-xs font-bold text-center transition-all ${
                        activeStyle.pattern === pat.id
                          ? "border-brand-orange bg-brand-orange text-white shadow-lg"
                          : "border-white/10 bg-black/20 text-brand-cream/80 hover:bg-white/5"
                      }`}
                    >
                      {pat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. CUSTOM PERSONALIZATION (Boat Name & Ruler) */}
              <div className="border-t border-white/10 pt-4 space-y-3">
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-cream font-bold">
                  4. Custom Laser Engraving & Inlays
                </label>
                <div>
                  <input
                    type="text"
                    maxLength={18}
                    value={vesselName}
                    onChange={(e) => setVesselName(e.target.value)}
                    placeholder="Enter Boat Name (e.g. SEA DOG)"
                    className="w-full rounded-xl border border-brand-light/30 bg-black/40 px-3.5 py-2.5 text-xs text-white uppercase font-mono tracking-wider focus:border-brand-orange focus:outline-none"
                  />
                  <span className="text-[10px] text-brand-light/70 mt-1 block">
                    Rendered in laser-routed typography on Helm Pad.
                  </span>
                </div>

                <div className="flex items-center justify-between bg-black/30 p-3 rounded-xl border border-white/10">
                  <div className="flex items-center gap-2 text-xs font-semibold text-brand-cream">
                    <Ruler className="w-4 h-4 text-brand-orange" />
                    <span>36" Integrated Fish Ruler Inlay</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showRuler}
                    onChange={(e) => setShowRuler(e.target.checked)}
                    className="w-4 h-4 rounded accent-brand-orange cursor-pointer"
                  />
                </div>
              </div>

              {/* 5. THICKNESS SELECTOR */}
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-xs font-mono uppercase text-brand-cream font-bold">
                  Thickness:
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setThickness("6mm")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      thickness === "6mm"
                        ? "bg-brand-orange text-white"
                        : "bg-black/30 text-white/60 hover:text-white border border-white/10"
                    }`}
                  >
                    6mm Standard
                  </button>
                  <button
                    type="button"
                    onClick={() => setThickness("9mm")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      thickness === "9mm"
                        ? "bg-brand-orange text-white"
                        : "bg-black/30 text-white/60 hover:text-white border border-white/10"
                    }`}
                  >
                    9mm Heavy Duty
                  </button>
                </div>
              </div>

              {/* CTA: SEND TO ESTIMATE */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleRequestEstimate}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-brand-orange hover:bg-orange-500 py-4 px-6 text-sm font-bold uppercase tracking-wider text-white shadow-2xl transition-all transform hover:scale-[1.02]"
                >
                  <span>Lock In Free Quote With This Build</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-center text-[11px] text-brand-light/70 font-sans mt-2">
                  Free on-site measuring, digital CAD scan & quote in Florida.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
