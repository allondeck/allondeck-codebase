import React from "react";
import { Wave } from "../ui/Wave";
import { Button } from "../ui/Button";

/**
 * ServiceCard.tsx
 *
 * Reusable card component for service previews across the website.
 * Supports both link navigation (`linkTo`) and scroll-to-section action callbacks (`onActionClick`).
 */

interface ServiceCardProps {
  /** Service title (can include React nodes like <br />) */
  title: React.ReactNode;
  /** Short text description (optional) */
  description?: string;
  /** Image source path */
  imageSrc: string;
  /** Target section ID for page scrolling (optional) */
  targetId?: string;
  /** Route path for page navigation (optional) */
  linkTo?: string;
  /** Text on the button / CTA link (defaults to "SEE MORE") */
  buttonText?: string;
  /** Callback when action button is clicked */
  onActionClick?: (targetId: string) => void;
  /** Aspect ratio class for image container (defaults to "aspect-[3/4]") */
  aspectRatio?: string;
  /** Custom min-height classes for the card container */
  cardMinHeight?: string;
  /** Additional custom container classes */
  className?: string;
  /** Additional custom image container classes */
  imageClassName?: string;
  /** Additional custom title classes */
  titleClassName?: string;
  /** Additional custom button classes */
  buttonClassName?: string;
}

export function ServiceCard({
  title,
  imageSrc,
  targetId,
  linkTo,
  buttonText = "SEE MORE",
  onActionClick,
  aspectRatio = "aspect-[3/4]",
  cardMinHeight = "min-h-[460px] sm:min-h-[500px] lg:min-h-[480px] xl:min-h-[540px]",
  className = "",
  imageClassName = "",
  titleClassName = "",
  buttonClassName = "",
}: ServiceCardProps) {
  const destination = linkTo || `#${targetId}`;

  const renderButton = () => {
    if (linkTo) {
      return (
        <Button to={destination} variant="primary" size="md" className={buttonClassName}>
          {buttonText}
        </Button>
      );
    }
    return (
      <Button
        type="button"
        onClick={() => targetId && onActionClick?.(targetId)}
        variant="primary"
        size="md"
        className={buttonClassName}
      >
        {buttonText}
      </Button>
    );
  };

  return (
    <div className={`group relative flex flex-col justify-between overflow-visible rounded-[2.5rem] bg-brand-medium p-5 pt-5 pb-16 ${cardMinHeight} border border-white/10 shadow-2xl transition-all hover:-translate-y-1 ${className}`.trim()}>
      {/* Top Image Container */}
      <div className={`overflow-hidden rounded-[2rem] ${aspectRatio} w-full shadow-md ${imageClassName}`.trim()}>
        <img
          src={imageSrc}
          alt={typeof title === "string" ? title : "Service"}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      {/* Title */}
      <div className="my-auto pt-3 pb-2 sm:pt-4 sm:pb-3 text-center px-3">
        <h3 className={`font-heading text-2xl sm:text-3xl lg:text-xl xl:text-3xl font-black tracking-wider text-white uppercase leading-snug ${titleClassName}`.trim()}>
          {title}
        </h3>
      </div>

      {/* Waves & Bottom Right Corner Button */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none overflow-visible">
        {/* Top Wave (Behind button, z-0) */}
        <div className="absolute bottom-6 sm:bottom-7 -left-2 sm:-left-3 lg:-left-4 right-0 sm:right-1 z-0 text-brand-light opacity-95 pointer-events-none scale-y-[0.65] sm:scale-y-70 lg:scale-y-90 origin-bottom">
          <Wave />
        </div>

        {/* SEE MORE Button in Bottom Right Corner (z-10) */}
        <div className="absolute bottom-2.5 right-3 z-10 pointer-events-auto">
          {renderButton()}
        </div>

        {/* Bottom Wave (In front of lower part of button, z-20) */}
        <div className="absolute -bottom-1 sm:bottom-0 -left-2 sm:-left-3 lg:-left-4 right-0 sm:right-1 z-20 text-brand-light opacity-95 pointer-events-none scale-y-[0.65] sm:scale-y-70 lg:scale-y-90 origin-bottom">
          <Wave />
        </div>
      </div>
    </div>
  );
}
