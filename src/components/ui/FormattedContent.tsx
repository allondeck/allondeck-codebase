/**
 * Renders plain-text content with paragraph and line-break formatting:
 * - Double newline (blank line) → new paragraph
 * - Single newline → line break
 * Text is escaped so HTML is not executed (safe for user content).
 */
function escapeHtml(text: string): string {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

export function FormattedContent({
  content,
  className = "",
  as: Tag = "div",
}: {
  content: string;
  className?: string;
  as?: "div" | "span";
}) {
  if (!content.trim()) return null;

  const paragraphs = content.split(/\n\n+/).filter((p) => p.trim());
  if (paragraphs.length === 0) return null;

  return (
    <Tag className={className}>
      {paragraphs.map((para, i) => {
        const escaped = escapeHtml(para.trim());
        const withBreaks = escaped.replace(/\n/g, "<br />");
        return (
          <p
            key={i}
            className={i > 0 ? "mt-4" : ""}
            dangerouslySetInnerHTML={{ __html: withBreaks }}
          />
        );
      })}
    </Tag>
  );
}
