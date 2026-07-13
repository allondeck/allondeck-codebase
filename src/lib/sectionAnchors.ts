/**
 * Generate a URL-safe anchor id from a section title for deep-linking.
 * Uses kebab-case from the title; falls back to section-{id} when title is empty.
 */
export function sectionTitleToAnchor(
  title: string | null,
  fallbackId: string
): string {
  const kebab = (title ?? "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return kebab || `section-${fallbackId}`;
}
