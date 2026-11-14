import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  limitFeaturedPerCategory,
  limitFeaturedSingleCategory,
} from "../lib/utils";
import type { ProductRow } from "../types/database";

type ProductWithCategories = ProductRow & {
  product_categories?: { categories: { id: string; slug: string } | null }[];
};

export type ProductSortBy =
  | "newest"
  | "price_asc"
  | "price_desc"
  | "stock_asc"
  | "stock_desc";

export interface UseProductsOptions {
  categorySlug?: string;
  featured?: boolean;
  search?: string;
  sortBy?: ProductSortBy;
  limit?: number;
}

// In-memory cache by query key to prevent re-fetching and empty section states on client navigation
const productsCache = new Map<string, ProductRow[]>();
const activeProductPromises = new Map<string, Promise<ProductRow[]>>();

function getCacheKey(options?: UseProductsOptions): string {
  return JSON.stringify({
    categorySlug: options?.categorySlug ?? null,
    featured: options?.featured ?? null,
    search: options?.search ?? null,
    sortBy: options?.sortBy ?? "newest",
    limit: options?.limit ?? null,
  });
}

export function useProducts(options?: UseProductsOptions) {
  const cacheKey = getCacheKey(options);
  const cached = productsCache.get(cacheKey);

  const [products, setProducts] = useState<ProductRow[]>(() => cached ?? []);
  const [loading, setLoading] = useState<boolean>(() => cached === undefined);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    const currentKey = getCacheKey(options);
    const existing = productsCache.get(currentKey);

    if (existing) {
      setProducts(existing);
      setLoading(false);
    } else {
      setLoading(true);
    }

    const selectStr = options?.categorySlug
      ? "*, product_categories!inner(categories!inner(slug, id))"
      : "*, product_categories(categories(id, slug))";

    let query = supabase
      .from("products")
      .select(selectStr)
      .eq("is_published", true)
      .order("is_featured", { ascending: false });

    const sortBy = options?.sortBy ?? "newest";
    if (sortBy === "price_asc")
      query = query.order("price", { ascending: true });
    else if (sortBy === "price_desc")
      query = query.order("price", { ascending: false });
    else if (sortBy === "stock_asc")
      query = query.order("stock_quantity", { ascending: true });
    else if (sortBy === "stock_desc")
      query = query.order("stock_quantity", { ascending: false });
    else query = query.order("created_at", { ascending: false });

    if (options?.featured) {
      query = query.eq("is_featured", true);
    }

    if (options?.categorySlug) {
      query = query.eq(
        "product_categories.categories.slug",
        options.categorySlug,
      );
    }

    if (options?.search) {
      query = query.ilike("name", `%${options.search}%`);
    }

    if (options?.limit != null && options.limit > 0) {
      query = query.limit(options.limit);
    }

    let promise = activeProductPromises.get(currentKey);
    if (!promise) {
      promise = (async () => {
        const { data, error: err } = await query;
        if (err) throw err;
        const raw = (data ?? []) as ProductWithCategories[];
        const limited = options?.categorySlug
          ? limitFeaturedSingleCategory(raw)
          : limitFeaturedPerCategory(
              raw,
              (p) =>
                (p.product_categories ?? [])
                  .map((pc) => pc.categories?.id)
                  .filter(Boolean) as string[],
            );
        productsCache.set(currentKey, limited);
        return limited;
      })().finally(() => {
        activeProductPromises.delete(currentKey);
      });
      activeProductPromises.set(currentKey, promise);
    }

    void promise
      .then((data) => {
        if (isMounted) {
          setProducts(data);
          setError(null);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (isMounted) {
          setError(e instanceof Error ? e : new Error(String(e)));
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [
    options?.categorySlug,
    options?.featured,
    options?.search,
    options?.sortBy,
    options?.limit,
  ]);

  return { products, loading, error };
}
