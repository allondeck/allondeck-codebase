import { Link } from "react-router-dom";
import { FormattedContent } from "../FormattedContent";

export type CtaSectionProps = {
  title?: string | null;
  subtitle?: string | null;
  ctaText: string;
  ctaLink: string;
  id?: string;
};

/**
 * Light, centered CTA block with title, subtitle, and button. Used on About.
 */
export function CtaSection({
  title,
  subtitle,
  ctaText,
  ctaLink,
  id,
}: CtaSectionProps) {
  return (
    <section
      id={id}
      className="min-w-0 rounded-xl border border-gray-200 bg-gray-50 p-4 text-center sm:p-8"
    >
      {title && (
        <h2 className="break-words text-xl font-semibold text-gray-900 sm:text-2xl">
          {title}
        </h2>
      )}
      {subtitle && (
        <div className="mt-2 min-w-0 break-words text-gray-600 [&_p]:mt-2 [&_p:first-child]:mt-0">
          <FormattedContent content={subtitle} />
        </div>
      )}
      <Link
        to={ctaLink}
        aria-label={`${ctaText} (section CTA)`}
        className="mt-6 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-gray-900 px-6 py-3 font-medium text-white hover:bg-gray-800"
      >
        {ctaText}
      </Link>
    </section>
  );
}
