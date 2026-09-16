import { Button, ButtonProps } from "./Button";
import { Wave } from "./Wave";

export type WaveButtonProps = ButtonProps & {
  /** Custom wave width class (defaults to responsive width appropriate for button size) */
  waveWidth?: string;
  /** Custom wave color class (defaults to text-brand-light) */
  waveColor?: string;
  /** Wrapper container class */
  containerClassName?: string;
};

/**
 * WaveButton Component
 *
 * Renders an action button wrapped between layered brand waves (one behind, one in front),
 * matching the signature nautical button aesthetic seen on the Welcome screen (Home Hero),
 * Service cards, and Promo banners.
 */
export function WaveButton({
  size = "md",
  waveWidth,
  waveColor = "text-brand-light",
  containerClassName = "",
  className = "",
  children,
  ...props
}: WaveButtonProps) {
  const defaultWaveWidth =
    waveWidth ||
    (size === "lg"
      ? "w-[18rem] sm:w-[21rem] md:w-[24rem]"
      : "w-[15rem] sm:w-[17rem] md:w-[19rem]");

  const topWaveTranslate = size === "lg" ? "-translate-y-3.5" : "-translate-y-3";
  const bottomWaveTranslate = size === "lg" ? "translate-y-3.5" : "translate-y-3";

  return (
    <div
      className={`relative inline-flex items-center justify-center pointer-events-none ${containerClassName}`.trim()}
    >
      {/* Top Wave (Behind button, z-0) */}
      <div
        className={`absolute top-1/2 ${topWaveTranslate} left-1/2 -translate-x-1/2 z-0 pointer-events-none opacity-95 ${defaultWaveWidth} ${waveColor}`}
      >
        <Wave />
      </div>

      <Button
        size={size}
        className={`relative z-10 pointer-events-auto shadow-2xl transition-transform hover:scale-105 ${className}`.trim()}
        {...props}
      >
        {children}
      </Button>

      {/* Bottom Wave (In front of button, z-20) */}
      <div
        className={`absolute top-1/2 ${bottomWaveTranslate} left-1/2 -translate-x-1/2 z-20 pointer-events-none opacity-95 ${defaultWaveWidth} ${waveColor}`}
      >
        <Wave />
      </div>
    </div>
  );
}
