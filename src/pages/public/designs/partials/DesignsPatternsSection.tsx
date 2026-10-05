import { useState } from "react";
import { WaveButton } from "../../../../components/ui/WaveButton";

export type PatternType =
  | "stepped"
  | "diamonds"
  | "chevron"
  | "crosshatch"
  | "octagons"
  | "hexagons";

export type DesignPattern = {
  id: string;
  name: string;
  image_url: string | null;
  pattern_type?: PatternType;
};

interface DesignsPatternsSectionProps {
  patterns: DesignPattern[];
}

const DEFAULT_PATTERNS: (DesignPattern & { pattern_type: PatternType })[] = [
  {
    id: "p1",
    name: "Interlocking Brick",
    image_url: "/assets/images/2.jpg",
    pattern_type: "stepped",
  },
  {
    id: "p2",
    name: "Geometric Diamond",
    image_url: "/assets/images/3.jpg",
    pattern_type: "diamonds",
  },
  {
    id: "p3",
    name: "Chevron Wave",
    image_url: "/assets/images/4.jpg",
    pattern_type: "chevron",
  },
  {
    id: "p4",
    name: "Diamond Lattice",
    image_url: "/assets/images/5.jpg",
    pattern_type: "crosshatch",
  },
  {
    id: "p5",
    name: "Octagon Mosaic",
    image_url: "/assets/images/10.jpg",
    pattern_type: "octagons",
  },
  {
    id: "p6",
    name: "Hexagon Key",
    image_url: "/assets/images/11.jpg",
    pattern_type: "hexagons",
  },
];

function PatternSVG({ type, id }: { type: PatternType; id: string }) {
  const clipId = `clip-${type}-${id}`;

  return (
    <svg
      viewBox="0 0 100 100"
      className="w-full h-full select-none"
      fill="none"
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="6" y="6" width="88" height="88" rx="8" />
        </clipPath>
      </defs>

      {/* Outer offset rounded border (signature CNC router margin cut) */}
      <rect
        x="6"
        y="6"
        width="88"
        height="88"
        rx="8"
        stroke="#FFFFFF"
        strokeWidth="1.6"
        strokeOpacity="0.95"
      />

      {type === "stepped" && (
        <g
          clipPath={`url(#${clipId})`}
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Left horizontal tracks */}
          <line x1="6" y1="18" x2="36" y2="18" />
          <line x1="6" y1="28" x2="36" y2="28" />
          <line x1="6" y1="38" x2="36" y2="38" />
          <line x1="6" y1="48" x2="36" y2="48" />
          <line x1="6" y1="58" x2="36" y2="58" />
          <line x1="6" y1="68" x2="36" y2="68" />
          <line x1="6" y1="78" x2="36" y2="78" />
          <line x1="6" y1="88" x2="36" y2="88" />

          {/* Diagonal bridge connectors */}
          <line x1="36" y1="18" x2="64" y2="23" />
          <line x1="36" y1="28" x2="64" y2="33" />
          <line x1="36" y1="38" x2="64" y2="43" />
          <line x1="36" y1="48" x2="64" y2="53" />
          <line x1="36" y1="58" x2="64" y2="63" />
          <line x1="36" y1="68" x2="64" y2="73" />
          <line x1="36" y1="78" x2="64" y2="83" />

          {/* Right horizontal tracks */}
          <line x1="64" y1="13" x2="94" y2="13" />
          <line x1="64" y1="23" x2="94" y2="23" />
          <line x1="64" y1="33" x2="94" y2="33" />
          <line x1="64" y1="43" x2="94" y2="43" />
          <line x1="64" y1="53" x2="94" y2="53" />
          <line x1="64" y1="63" x2="94" y2="63" />
          <line x1="64" y1="73" x2="94" y2="73" />
          <line x1="64" y1="83" x2="94" y2="83" />
          <line x1="64" y1="93" x2="94" y2="93" />
        </g>
      )}

      {type === "diamonds" && (
        <g
          clipPath={`url(#${clipId})`}
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Inner diamond */}
          <polygon points="50,38 62,50 50,62 38,50" />
          {/* Middle diamond */}
          <polygon points="50,26 74,50 50,74 26,50" />
          {/* Outer diamond */}
          <polygon points="50,14 86,50 50,86 14,50" />
          {/* Top interlocking diamond */}
          <polygon points="50,2 66,18 50,34 34,18" />
          {/* Radiating corner diagonals */}
          <line x1="6" y1="6" x2="94" y2="94" />
          <line x1="94" y1="6" x2="6" y2="94" />
          <line x1="50" y1="14" x2="94" y2="58" />
          <line x1="50" y1="14" x2="6" y2="58" />
          <line x1="50" y1="86" x2="94" y2="42" />
          <line x1="50" y1="86" x2="6" y2="42" />
        </g>
      )}

      {type === "chevron" && (
        <g
          clipPath={`url(#${clipId})`}
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M 6,19 L 28,1 L 50,19 L 72,1 L 94,19" />
          <path d="M 6,36 L 28,18 L 50,36 L 72,18 L 94,36" />
          <path d="M 6,53 L 28,35 L 50,53 L 72,35 L 94,53" />
          <path d="M 6,70 L 28,52 L 50,70 L 72,52 L 94,70" />
          <path d="M 6,87 L 28,69 L 50,87 L 72,69 L 94,87" />
          <path d="M 6,104 L 28,86 L 50,104 L 72,86 L 94,104" />
        </g>
      )}

      {type === "crosshatch" && (
        <g
          clipPath={`url(#${clipId})`}
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {[-40, -26, -12, 2, 16, 30, 44, 58, 72, 86, 100, 114, 128].map(
            (c) => (
              <line key={`f-${c}`} x1={c} y1="0" x2={c + 100} y2="100" />
            ),
          )}
          {[-28, -14, 0, 14, 28, 42, 56, 70, 84, 98, 112, 126, 140].map((c) => (
            <line key={`b-${c}`} x1={c} y1="100" x2={c + 100} y2="0" />
          ))}
        </g>
      )}

      {type === "octagons" && (
        <g
          clipPath={`url(#${clipId})`}
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {[
            [20, 20],
            [50, 20],
            [80, 20],
            [20, 50],
            [50, 50],
            [80, 50],
            [20, 80],
            [50, 80],
            [80, 80],
            [-10, 20],
            [-10, 50],
            [-10, 80],
            [110, 20],
            [110, 50],
            [110, 80],
            [20, -10],
            [50, -10],
            [80, -10],
            [20, 110],
            [50, 110],
            [80, 110],
          ].map(([cx, cy], i) => (
            <polygon
              key={i}
              points={`
                ${cx - 5},${cy - 12} ${cx + 5},${cy - 12}
                ${cx + 12},${cy - 5} ${cx + 12},${cy + 5}
                ${cx + 5},${cy + 12} ${cx - 5},${cy + 12}
                ${cx - 12},${cy + 5} ${cx - 12},${cy - 5}
              `}
            />
          ))}
        </g>
      )}

      {type === "hexagons" && (
        <g
          clipPath={`url(#${clipId})`}
          stroke="#FFFFFF"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Column 1 (x=22) */}
          <polygon points="22,11 30,16 30,26 22,31 14,26 14,16" />
          <line x1="22" y1="31" x2="22" y2="53" />
          <polygon points="22,53 30,58 30,68 22,73 14,68 14,58" />
          <line x1="22" y1="73" x2="22" y2="95" />
          <polygon points="22,95 30,100 30,110 22,115 14,110 14,100" />

          {/* Column 2 (x=50) Staggered */}
          <polygon points="50,-11 58,-6 58,4 50,9 42,4 42,-6" />
          <line x1="50" y1="9" x2="50" y2="31" />
          <polygon points="50,31 58,36 58,46 50,51 42,46 42,36" />
          <line x1="50" y1="51" x2="50" y2="73" />
          <polygon points="50,73 58,78 58,88 50,93 42,88 42,78" />
          <line x1="50" y1="93" x2="50" y2="115" />

          {/* Column 3 (x=78) */}
          <polygon points="78,11 86,16 86,26 78,31 70,26 70,16" />
          <line x1="78" y1="31" x2="78" y2="53" />
          <polygon points="78,53 86,58 86,68 78,73 70,68 70,58" />
          <line x1="78" y1="73" x2="78" y2="95" />
          <polygon points="78,95 86,100 86,110 78,115 70,110 70,100" />
        </g>
      )}
    </svg>
  );
}

export function DesignsPatternsSection({
  patterns,
}: DesignsPatternsSectionProps) {
  // Use DB patterns or fallback to the 6 physical sample patterns from the Illustrator mockup
  const displayPatterns =
    patterns && patterns.length > 0
      ? patterns.map((p, idx) => ({
          ...p,
          image_url:
            p.image_url ||
            DEFAULT_PATTERNS[idx % DEFAULT_PATTERNS.length].image_url,
          pattern_type:
            p.pattern_type ||
            DEFAULT_PATTERNS[idx % DEFAULT_PATTERNS.length].pattern_type,
        }))
      : DEFAULT_PATTERNS;

  const [selectedPatternId, setSelectedPatternId] = useState<string>("p1");

  const activePattern =
    displayPatterns.find((p) => p.id === selectedPatternId) ||
    displayPatterns[0];

  return (
    <div
      id="gallery"
      className="scroll-mt-20 border-t border-brand-medium/30 bg-[#0C5A6D] pt-24 pb-12 md:pb-[104px] relative overflow-visible"
    >
      <div className="mx-auto max-w-content px-6 lg:px-12">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 lg:gap-0">
          {/* Patterns Sample Grid: Uniform Cards with 9/16 Aspect Ratio */}
          <div className="w-full lg:w-[55%] relative z-10">
            <div className="grid grid-cols-3 gap-3.5 sm:gap-5 md:gap-6 items-stretch">
              {displayPatterns.slice(0, 6).map((pattern) => {
                const isSelected = selectedPatternId === pattern.id;
                const patternType = pattern.pattern_type || "stepped";

                return (
                  <button
                    key={pattern.id}
                    type="button"
                    onClick={() => setSelectedPatternId(pattern.id)}
                    className="group flex flex-col items-center focus:outline-none text-left w-full h-full"
                    aria-label={`Select pattern ${pattern.name}`}
                  >
                    {/* Uniform Sample Container (Set 9/16 Aspect Ratio) */}
                    <div
                      className={`relative w-full aspect-[9/16] bg-white rounded-2xl sm:rounded-3xl p-2 sm:p-2.5 shadow-md hover:shadow-2xl transition-all duration-300 flex items-center justify-center cursor-pointer ${
                        isSelected
                          ? "ring-4 ring-brand-orange scale-[1.03] shadow-2xl"
                          : "hover:scale-[1.03] group-hover:shadow-lg"
                      }`}
                    >
                      {/* Inner Marine Tile */}
                      <div className="w-full h-full bg-[#044155] rounded-xl sm:rounded-2xl relative overflow-hidden flex items-center justify-center border border-[#066175]/30 shadow-inner">
                        {pattern.image_url ? (
                          <img
                            src={pattern.image_url}
                            alt={pattern.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover object-center"
                          />
                        ) : (
                          <div className="w-full h-full p-2 flex items-center justify-center">
                            <PatternSVG type={patternType} id={pattern.id} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Pattern Name Label */}
                    <span
                      className={`mt-2.5 text-center text-[11px] sm:text-xs font-bold tracking-wider uppercase font-sans leading-tight transition-colors duration-200 line-clamp-1 min-h-[1.25rem] ${
                        isSelected
                          ? "text-brand-orange"
                          : "text-brand-cream/80 group-hover:text-brand-cream"
                      }`}
                    >
                      {pattern.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Text Content */}
          <div className="w-full lg:w-[40%] text-left relative z-10">
            <h2 className="font-heading text-4xl md:text-6xl font-black tracking-widest text-brand-cream uppercase leading-none">
              PATTERNS
            </h2>
            <p className="mt-8 text-sm md:text-base text-white font-sans leading-relaxed text-justify hyphens-auto tracking-wide">
              Every deck is unique. Browse a selection of our premium pattern
              designs and get inspired for your next build. Our patterns are
              precision routed for a perfect finish that elevates the aesthetics
              of any vessel.
            </p>

            <div className="mt-10 flex justify-start ml-8">
              {/* Mobile */}
              <div className="md:hidden">
                <WaveButton
                  to={`/estimate${activePattern ? `?pattern=${encodeURIComponent(activePattern.name)}` : ""}`}
                  variant="primary"
                  size="md"
                >
                  GET THIS DESIGN
                </WaveButton>
              </div>

              {/* Desktop */}
              <div className="hidden md:block">
                <WaveButton
                  to={`/estimate${activePattern ? `?pattern=${encodeURIComponent(activePattern.name)}` : ""}`}
                  variant="primary"
                  size="lg"
                >
                  GET THIS DESIGN
                </WaveButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
