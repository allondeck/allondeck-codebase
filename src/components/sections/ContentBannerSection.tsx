import { Link } from "react-router-dom";
import { FormattedContent } from "../ui/FormattedContent";

export type ContentBannerSectionProps = {
  title: string;
  subtitle?: string | null;
  content?: string | null;
  ctaText?: string | null;
  ctaLink?: string | null;
  id?: string;
};

/**
 * Dark gradient banner with title, optional subtitle/content, and optional CTA.
 * Used for Home hero and About content_banner.
 */
export function ContentBannerSection({
  title,
  subtitle,
  content,
  ctaText,
  ctaLink,
  id,
}: ContentBannerSectionProps) {
  return (
    <section
      id={id}
      className="rounded-xl bg-gradient-to-r from-gray-900 to-gray-700 px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8"
    >
      <h1 className="min-w-0 break-words text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
        {title}
      </h1>
      {subtitle && (
        <div className="mt-4 max-w-2xl text-base text-gray-300 min-w-0 break-words sm:text-lg [&_p]:mt-2 [&_p:first-child]:mt-0">
          <FormattedContent content={subtitle} />
        </div>
      )}
      {content && (
        <div className="mt-4 max-w-2xl text-base text-gray-300 min-w-0 break-words sm:text-lg [&_p]:mt-2 [&_p:first-child]:mt-0">
          <FormattedContent content={content} />
        </div>
      )}
      {ctaText && ctaLink && (
        <Link
          to={ctaLink}
          className="mt-6 inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg bg-white px-6 py-3 font-medium text-gray-900 hover:bg-gray-100"
        >
          {ctaText}
        </Link>
      )}
    </section>
  );
}
