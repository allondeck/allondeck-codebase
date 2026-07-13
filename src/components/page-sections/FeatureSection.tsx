import { Link } from "react-router-dom";
import { FormattedContent } from "../FormattedContent";
import { SectionImageSlot } from "./SectionImageSlot";

export type FeatureSectionButton = {
  label: string;
  href: string;
};

export type FeatureSectionProps = {
  title?: string | null;
  subtitle?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  imageLeft?: boolean;
  /** Optional CTA buttons at the end of the content (max 2). */
  buttons?: FeatureSectionButton[];
  id?: string;
};

/**
 * Shared feature section: image (left or right) + title, optional subtitle, optional description, optional CTA buttons.
 * Used on both Home and About.
 */
export function FeatureSection({
  title,
  subtitle,
  description,
  imageUrl = null,
  imageLeft = true,
  buttons,
  id,
}: FeatureSectionProps) {
  const displayButtons = (buttons ?? [])
    .slice(0, 2)
    .filter((b) => b.label?.trim() && b.href?.trim());

  return (
    <section
      id={id}
      className="overflow-hidden rounded-xl border border-gray-200 bg-white px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8"
    >
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-12">
        <div
          className={`min-h-[200px] md:min-h-[280px] ${
            imageLeft ? "md:order-first" : "md:order-last"
          }`}
        >
          <SectionImageSlot
            imageUrl={imageUrl}
            alt={title ?? "Feature"}
            width={600}
            height={400}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-col justify-center">
          {title && (
            <h2 className="break-words text-xl font-semibold text-gray-900 sm:text-2xl">
              {title}
            </h2>
          )}
          {subtitle && (
            <div className="mt-2 text-base text-gray-600 break-words sm:text-lg [&_p]:mt-2 [&_p:first-child]:mt-0">
              <FormattedContent content={subtitle} />
            </div>
          )}
          {description && (
            <div className="mt-4 min-w-0 break-words text-gray-600 overflow-y-auto max-h-[40vh] sm:max-h-none [&_p]:mt-2 [&_p:first-child]:mt-0">
              <FormattedContent content={description} />
            </div>
          )}
          {displayButtons.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3">
              {displayButtons.map((btn, i) => {
                const isExternal =
                  btn.href.startsWith("http://") ||
                  btn.href.startsWith("https://");
                const className =
                  "inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg px-5 py-2.5 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 " +
                  (i === 0
                    ? "bg-gray-900 text-white hover:bg-gray-800"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50");
                if (isExternal) {
                  return (
                    <a
                      key={i}
                      href={btn.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={className}
                    >
                      {btn.label}
                    </a>
                  );
                }
                return (
                  <Link key={i} to={btn.href} className={className}>
                    {btn.label}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
