import { FormattedContent } from "../FormattedContent";
import { SectionImageSlot } from "./SectionImageSlot";

export type ValuesItem = {
  title?: string;
  description?: string;
  image_url?: string;
};

export type ValuesSectionProps = {
  title?: string | null;
  items: ValuesItem[];
  id?: string;
};

/**
 * Grid of value items (image + title + description). Used on About.
 */
export function ValuesSection({ title, items, id }: ValuesSectionProps) {
  return (
    <section
      id={id}
      className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 sm:p-8"
    >
      {title && (
        <h2 className="mb-6 break-words text-xl font-semibold text-gray-900 sm:mb-8 sm:text-2xl">
          {title}
        </h2>
      )}
      <div className="flex gap-6 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:gap-8 sm:overflow-visible sm:pb-0 lg:grid-cols-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex min-w-[260px] shrink-0 flex-col sm:min-w-0"
          >
            <div className="mb-4 aspect-square max-w-[200px] overflow-hidden rounded-lg">
              <SectionImageSlot
                imageUrl={item.image_url ?? null}
                alt={item.title ?? "Value"}
                width={200}
                height={200}
                className="h-full w-full object-cover"
              />
            </div>
            {item.title && (
              <p className="break-words font-semibold text-gray-900">
                {item.title}
              </p>
            )}
            {item.description && (
              <div className="mt-2 min-w-0 break-words text-sm text-gray-600 [&_p]:mt-1 [&_p:first-child]:mt-0">
                <FormattedContent content={item.description} />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
