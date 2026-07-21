import React from "react";
import { Link } from "react-router-dom";

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
  /** Card variant styling: 'hero-card' with wave overlay or 'preview-card' for grid lists */
  variant?: "hero-card" | "preview-card";
}

export function ServiceCard({
  title,
  description,
  imageSrc,
  targetId,
  linkTo,
  buttonText = "SEE MORE",
  onActionClick,
  variant = "hero-card",
}: ServiceCardProps) {
  // Variant 1: Hero Card with wave overlay & button
  if (variant === "hero-card") {
    return (
      <div className="relative rounded-3xl border border-brand-medium bg-brand-dark-alt p-5 pb-20 overflow-hidden flex flex-col h-full shadow-lg">
        <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl">
          <img
            src={imageSrc}
            alt={typeof title === "string" ? title : "Service"}
            className="h-full w-full object-cover"
          />
        </div>
        <h3 className="mt-6 text-center font-heading text-xl font-bold tracking-wider text-brand-cream uppercase leading-snug">
          {title}
        </h3>

        {/* Wave & Button overlay */}
        <div className="absolute bottom-0 left-0 right-0 flex flex-col items-center justify-end pb-4 h-24">
          {/* Wave decor */}
          <div className="absolute bottom-6 left-0 right-0 opacity-40 px-2 pointer-events-none">
            <img
              src="/assets/svg/recurso olas, 2 olas.svg"
              alt=""
              className="w-full h-8 object-cover"
            />
          </div>
          {linkTo ? (
            <Link
              to={linkTo}
              className="relative z-10 rounded-lg bg-brand-orange hover:bg-orange-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-transform hover:scale-105 shadow-md"
            >
              {buttonText}
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => targetId && onActionClick?.(targetId)}
              className="relative z-10 rounded-lg bg-brand-orange hover:bg-orange-600 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-transform hover:scale-105"
            >
              {buttonText}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Variant 2: Preview Link Card (used in Home.tsx)
  return (
    <Link
      to={linkTo || `#${targetId}`}
      className="group block relative overflow-hidden rounded-3xl bg-brand-dark p-6 md:p-8 shadow-md border border-brand-light/10 transition-all hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="mb-6 overflow-hidden rounded-2xl">
        <img
          src={imageSrc}
          alt={typeof title === "string" ? title : "Service"}
          className="h-48 w-full object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <h3 className="font-heading text-lg font-bold tracking-wider text-brand-cream">
        {title}
      </h3>
      {description && (
        <p className="mt-3 text-sm text-brand-cream/80 leading-relaxed font-sans">
          {description}
        </p>
      )}
      <span className="mt-6 inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-brand-orange group-hover:underline">
        {buttonText} →
      </span>
    </Link>
  );
}
