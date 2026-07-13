import { supabase } from "./supabase";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? "";

/** Max file size for product images (bytes). */
export const MAX_IMAGE_SIZE_PRODUCTS = 5 * 1024 * 1024; // 5MB
/** Max file size for store assets: logo, banner images (bytes). */
export const MAX_IMAGE_SIZE_STORE = 2 * 1024 * 1024; // 2MB

export function getMaxImageSizeLabel(maxBytes: number): string {
  if (maxBytes >= 1024 * 1024) return `${maxBytes / (1024 * 1024)}MB`;
  return `${Math.round(maxBytes / 1024)}KB`;
}

export function isImageSizeWithinLimit(file: File, maxBytes: number): boolean {
  return file.size <= maxBytes;
}

/**
 * Extract storage path from a Supabase storage public URL.
 * Returns null if URL is not from our Supabase storage.
 */
export function getStoragePathFromUrl(
  url: string,
  bucket: string
): string | null {
  if (!url || !SUPABASE_URL) return null;
  const prefix = `${SUPABASE_URL}/storage/v1/object/public/${bucket}/`;
  if (!url.startsWith(prefix)) return null;
  return url.slice(prefix.length);
}

/**
 * Delete a file from storage if the URL points to our bucket.
 * Silently no-ops if URL is external or invalid.
 */
export async function deleteStorageFileIfOurs(
  bucket: string,
  url: string | null
): Promise<void> {
  const path = url ? getStoragePathFromUrl(url, bucket) : null;
  if (!path) return;
  await supabase.storage.from(bucket).remove([path]);
}

/**
 * List all file paths in a bucket (flat, non-recursive for root).
 * For products bucket we store at root.
 */
export async function listStoragePaths(
  bucket: string,
  folder = ""
): Promise<string[]> {
  const { data, error } = await supabase.storage.from(bucket).list(folder);
  if (error) return [];
  const paths: string[] = [];
  for (const item of data ?? []) {
    const fullPath = folder ? `${folder}/${item.name}` : item.name;
    if (item.id == null) {
      paths.push(...(await listStoragePaths(bucket, fullPath)));
    } else {
      paths.push(fullPath);
    }
  }
  return paths;
}

/**
 * Get paths referenced by products (from image_url).
 */
function getProductImagePaths(urls: (string | null)[]): Set<string> {
  const paths = new Set<string>();
  for (const url of urls) {
    const p = url ? getStoragePathFromUrl(url, "products") : null;
    if (p) paths.add(p);
  }
  return paths;
}

/**
 * Get paths referenced by store assets (logo_url from store_settings).
 */
function getStoreAssetPaths(urls: (string | null)[]): Set<string> {
  const paths = new Set<string>();
  for (const url of urls) {
    const p = url ? getStoragePathFromUrl(url, "store") : null;
    if (p) paths.add(p);
  }
  return paths;
}

/**
 * Clean up orphaned product images (files in storage not linked to any product).
 */
export async function cleanupOrphanedProductImages(): Promise<{
  deleted: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let deleted = 0;

  const [allPaths, { data: products }] = await Promise.all([
    listStoragePaths("products"),
    supabase.from("products").select("image_url"),
  ]);

  const referenced = getProductImagePaths(
    (products ?? []).map((p) => (p as { image_url: string | null }).image_url)
  );

  const toDelete = allPaths.filter((p) => !referenced.has(p));
  if (toDelete.length === 0) return { deleted: 0, errors: [] };

  const { error } = await supabase.storage.from("products").remove(toDelete);
  if (error) {
    errors.push(error.message);
  } else {
    deleted = toDelete.length;
  }
  return { deleted, errors };
}

async function getAllReferencedStorePaths(): Promise<Set<string>> {
  const urls: (string | null)[] = [];

  const [
    { data: logoRow },
    { data: homepageSections },
    { data: aboutSections },
  ] = await Promise.all([
    supabase
      .from("store_settings")
      .select("value")
      .eq("key", "logo_url")
      .maybeSingle(),
    supabase.from("homepage_sections").select("config"),
    supabase.from("about_sections").select("image_url, config"),
  ]);

  const logoVal = (logoRow as { value?: unknown } | null)?.value;
  const logoUrl =
    logoVal != null ? String(logoVal).replace(/^"|"$/g, "").trim() : "";
  if (logoUrl) urls.push(logoUrl);

  for (const s of homepageSections ?? []) {
    const config = (s as { config?: Record<string, unknown> }).config;
    const img = config?.image_url;
    if (typeof img === "string" && img) urls.push(img);
  }

  for (const s of aboutSections ?? []) {
    const row = s as {
      image_url?: string | null;
      config?: { items?: Array<{ image_url?: string }> };
    };
    if (row.image_url) urls.push(row.image_url);
    const items = row.config?.items;
    if (Array.isArray(items)) {
      for (const item of items) {
        if (typeof item.image_url === "string" && item.image_url)
          urls.push(item.image_url);
      }
    }
  }

  return getStoreAssetPaths(urls);
}

/**
 * Clean up orphaned store assets: delete every file in the store bucket that is not
 * referenced anywhere in the database (logo, homepage sections, about sections).
 */
export async function cleanupOrphanedStoreAssets(): Promise<{
  deleted: number;
  errors: string[];
}> {
  const errors: string[] = [];
  let deleted = 0;

  const [allPaths, referenced] = await Promise.all([
    listStoragePaths("store"),
    getAllReferencedStorePaths(),
  ]);

  const toDelete = allPaths.filter((p) => !referenced.has(p));
  if (toDelete.length === 0) return { deleted: 0, errors: [] };

  const { error } = await supabase.storage.from("store").remove(toDelete);
  if (error) {
    errors.push(error.message);
  } else {
    deleted = toDelete.length;
  }
  return { deleted, errors };
}

/**
 * Clean up all orphaned storage (products + store) in one pass. Minimizes API/DB hits.
 */
export async function cleanupAllOrphanedStorage(): Promise<{
  productsDeleted: number;
  storeDeleted: number;
  errors: string[];
}> {
  const [productsResult, storeResult] = await Promise.all([
    cleanupOrphanedProductImages(),
    cleanupOrphanedStoreAssets(),
  ]);
  return {
    productsDeleted: productsResult.deleted,
    storeDeleted: storeResult.deleted,
    errors: [...productsResult.errors, ...storeResult.errors],
  };
}
