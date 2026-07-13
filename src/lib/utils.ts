/** User-facing label for order status. Use everywhere so "delivered" always shows as "Completed". */
export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  processing: "In progress",
  shipped: "Shipped",
  delivered: "Completed",
  completed: "Completed", // alias if ever stored
  cancelled: "Cancelled",
  refunded: "Refunded",
};

export function orderStatusLabel(status: string): string {
  return ORDER_STATUS_LABELS[status] ?? status;
}

/** Parse price from Supabase (PostgreSQL DECIMAL returns as string) */
export function parsePrice(value: number | string | null | undefined): number {
  if (value == null) return 0;
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : 0;
  }
  const parsed = parseFloat(String(value));
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function formatPrice(price: number | string | null | undefined): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(parsePrice(price));
}

/** Generate URL-friendly slug from string */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const FEATURED_PER_CATEGORY_LIMIT = 6;

/** Limit featured products to 6 per category. Products must be ordered featured first. */
export function limitFeaturedPerCategory<
  T extends { id: string; is_featured: boolean }
>(products: T[], getCategoryIds: (p: T) => string[]): T[] {
  const featuredByCategory = new Map<string, T[]>();
  const nonFeatured: T[] = [];
  const seen = new Set<string>();

  for (const p of products) {
    if (!p.is_featured) {
      nonFeatured.push(p);
      continue;
    }
    const catIds = getCategoryIds(p);
    const firstCatId = catIds[0] ?? "uncategorized";
    const list = featuredByCategory.get(firstCatId) ?? [];
    if (list.length < FEATURED_PER_CATEGORY_LIMIT) {
      list.push(p);
      featuredByCategory.set(firstCatId, list);
      if (!seen.has(p.id)) {
        seen.add(p.id);
      }
    }
  }

  const featured = Array.from(featuredByCategory.values()).flat();
  return [...featured, ...nonFeatured];
}

/** When viewing a single category: take first 6 featured, then all non-featured. */
export function limitFeaturedSingleCategory<T extends { is_featured: boolean }>(
  products: T[]
): T[] {
  const featured: T[] = [];
  const nonFeatured: T[] = [];
  for (const p of products) {
    if (p.is_featured) {
      if (featured.length < FEATURED_PER_CATEGORY_LIMIT) featured.push(p);
    } else {
      nonFeatured.push(p);
    }
  }
  return [...featured, ...nonFeatured];
}
