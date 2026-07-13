/** Filter IDs that can be enabled/disabled by the owner on the Products page. */
export type ProductFilterId =
  | "price"
  | "sale"
  | "in_stock"
  | "featured"
  | "new_arrivals"
  | "low_stock"
  | "deals";

export const PRODUCT_FILTER_IDS: ProductFilterId[] = [
  "price",
  "sale",
  "in_stock",
  "featured",
  "new_arrivals",
  "low_stock",
  "deals",
];

/** Default filters when store has not configured: price and sale. In-stock is only relevant when out-of-stock items are shown. */
export const DEFAULT_PRODUCT_FILTERS: ProductFilterId[] = ["price", "sale"];

export const PRODUCT_FILTER_LABELS: Record<ProductFilterId, string> = {
  price: "Price range",
  sale: "On sale",
  in_stock: "In stock only",
  featured: "Featured only",
  new_arrivals: "New arrivals",
  low_stock: "Low stock",
  deals: "Deals",
};

export const DEFAULT_NEW_ARRIVALS_DAYS = 30;

function parseBoolean(v: unknown): boolean {
  if (v == null) return false;
  if (typeof v === "boolean") return v;
  if (typeof v === "string") return v.toLowerCase() === "true" || v === "1";
  return false;
}

function parseStringArray(v: unknown): string[] {
  if (v == null) return [];
  if (Array.isArray(v))
    return v.filter((x): x is string => typeof x === "string");
  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v) as unknown;
      return Array.isArray(parsed)
        ? parsed.filter((x): x is string => typeof x === "string")
        : [];
    } catch {
      return [];
    }
  }
  return [];
}

const VALID_IDS = new Set<ProductFilterId>(PRODUCT_FILTER_IDS);

/** Parse product_filters from store_settings value. Returns only valid ids. */
export function parseProductFilters(value: unknown): ProductFilterId[] {
  const raw = parseStringArray(value);
  const filtered = raw.filter((id): id is ProductFilterId =>
    VALID_IDS.has(id as ProductFilterId)
  );
  return filtered.length > 0 ? filtered : DEFAULT_PRODUCT_FILTERS;
}

/** Parse show_out_of_stock from store_settings value. Default false = only in-stock items shown. */
export function parseShowOutOfStock(value: unknown): boolean {
  return parseBoolean(value);
}

function parseNumber(v: unknown, fallback: number): number {
  if (v == null) return fallback;
  if (typeof v === "number" && !Number.isNaN(v))
    return Math.max(1, Math.floor(v));
  if (typeof v === "string") {
    const n = parseInt(v, 10);
    if (!Number.isNaN(n)) return Math.max(1, Math.floor(n));
  }
  return fallback;
}

/** Parse new_arrivals_days from store_settings. Default DEFAULT_NEW_ARRIVALS_DAYS. */
export function parseNewArrivalsDays(value: unknown): number {
  return parseNumber(value, DEFAULT_NEW_ARRIVALS_DAYS);
}

/** Parse deal_product_ids from store_settings. Array of product UUIDs. */
export function parseDealProductIds(value: unknown): string[] {
  return parseStringArray(value);
}
