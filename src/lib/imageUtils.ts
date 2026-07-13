/**
 * Build a Supabase Storage image transform URL for smaller, WebP-delivered images.
 * Uses /storage/v1/render/image/public/ so Supabase can resize and serve WebP when supported.
 * If the URL is not from our Supabase storage, returns the original URL unchanged.
 */
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "";

export function getSupabaseImageTransformUrl(
  url: string | null | undefined,
  options: { width: number; height: number; bucket: string }
): string {
  if (!url?.trim() || !SUPABASE_URL) return url ?? "";
  const prefix = `${SUPABASE_URL}/storage/v1/object/public/${options.bucket}/`;
  if (!url.startsWith(prefix)) return url;
  const path = url.slice(prefix.length);
  const base = `${SUPABASE_URL}/storage/v1/render/image/public/${options.bucket}/${path}`;
  const params = new URLSearchParams({
    width: String(options.width),
    height: String(options.height),
  });
  return `${base}?${params.toString()}`;
}
