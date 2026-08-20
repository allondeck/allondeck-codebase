import { Link } from "react-router-dom";

export interface ServicesGalleryBannerSectionProps {
  variant?: "dark" | "medium";
  className?: string;
  badge?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

export function ServicesGalleryBannerSection({
  variant = "dark",
  className = "",
  badge = "Get Started Today",
  title = "Ready to upgrade your boat's deck?",
  description = "Get a personalized, no-obligation estimate tailored to your vessel. From custom CAD templating and MarineMat® foam manufacturing to precision CNC installation, our team is ready to bring your vision to life.",
  buttonText = "Get Free Estimate →",
  buttonLink = "/estimate",
}: ServicesGalleryBannerSectionProps) {
  const bgClasses =
    variant === "medium"
      ? "bg-gradient-to-r from-[#054b5c] via-brand-medium to-[#054b5c] border-brand-light/30"
      : "bg-gradient-to-r from-brand-dark-alt via-brand-dark to-brand-dark-alt border-brand-medium/40";

  return (
    <div className={`mx-auto max-w-content px-6 lg:px-12 mt-16 sm:mt-20 ${className}`}>
      <div
        className={`relative overflow-hidden rounded-3xl border ${bgClasses} p-8 sm:p-12 text-center shadow-2xl`}
      >
        {/* Subtle wave texture */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <img
            src="/assets/svg/recurso olas, 1 ola.svg"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <span className="inline-block rounded-full bg-brand-orange/20 border border-brand-orange/40 px-4 py-1 text-xs font-bold uppercase tracking-wider text-brand-orange">
            {badge}
          </span>
          <h3 className="font-heading text-3xl sm:text-4xl font-bold uppercase tracking-wider text-brand-cream">
            {title}
          </h3>
          <p className="text-sm sm:text-base text-brand-light leading-relaxed">
            {description}
          </p>
          <div className="pt-2">
            <Link
              to={buttonLink}
              className="inline-flex items-center gap-2 rounded-full bg-brand-orange px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg hover:bg-orange-600 transition-all transform hover:scale-105"
            >
              {buttonText}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
