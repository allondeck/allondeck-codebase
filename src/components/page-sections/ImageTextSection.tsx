import { FormattedContent } from "../FormattedContent";
import { SectionImageSlot } from "./SectionImageSlot";

export type ImageTextSectionProps = {
  title?: string | null;
  content?: string | null;
  imageUrl?: string | null;
  id?: string;
};

/**
 * Image on one side, title + content on the other. Used on About.
 */
export function ImageTextSection({
  title,
  content,
  imageUrl = null,
  id,
}: ImageTextSectionProps) {
  return (
    <section
      id={id}
      className="overflow-hidden rounded-xl border border-gray-200 bg-white"
    >
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 md:gap-8">
        <div className="min-h-[200px] md:min-h-[280px]">
          <SectionImageSlot
            imageUrl={imageUrl}
            alt={title ?? "Section"}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="flex min-w-0 flex-col justify-center p-4 sm:p-8">
          {title && (
            <h2 className="break-words text-xl font-semibold text-gray-900 sm:text-2xl">
              {title}
            </h2>
          )}
          {content && (
            <div className="mt-4 min-w-0 break-words text-gray-600 overflow-y-auto max-h-[40vh] sm:max-h-none [&_p]:mt-2 [&_p:first-child]:mt-0">
              <FormattedContent content={content} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
