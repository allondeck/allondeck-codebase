import { FormattedContent } from "../ui/FormattedContent";

export type TextSectionProps = {
  title?: string | null;
  content: string;
  id?: string;
};

/**
 * Simple text block with optional title. Used on About.
 */
export function TextSection({ title, content, id }: TextSectionProps) {
  return (
    <section
      id={id}
      className="min-w-0 rounded-xl border border-gray-200 bg-white p-4 sm:p-8"
    >
      {title && (
        <h2 className="break-words text-xl font-semibold text-gray-900 sm:text-2xl">
          {title}
        </h2>
      )}
      {content && (
        <div className="mt-4 min-w-0 break-words text-gray-600 overflow-y-auto max-h-[50vh] sm:max-h-none [&_p]:mt-2 [&_p:first-child]:mt-0">
          <FormattedContent content={content} />
        </div>
      )}
    </section>
  );
}
