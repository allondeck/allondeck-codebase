import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { ProductRow } from "../types/database";
import type { CategoryRow } from "../types/database";

const SUGGESTED_LIMIT = 6;

type ProductWithCategories = ProductRow & {
  product_categories?: { categories: CategoryRow | null }[];
};

export function useSuggestedProductsForListing(
  excludeProductIds: string[],
  categorySlug: string | undefined,
  enabled: boolean,
) {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setProducts([]);
      return;
    }

    const excludeSet = new Set(excludeProductIds);

    void (async () => {
      setLoading(true);
      try {
        const { data, error: err } = await supabase
          .from("products")
          .select("*, product_categories(categories(id, slug))")
          .eq("is_published", true)
          .order("is_featured", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(50);

        if (err) throw err;
        const raw = (data ?? []) as ProductWithCategories[];

        let filtered: ProductRow[];

        if (categorySlug) {
          // Suggest products from *other* categories (explore more)
          filtered = raw.filter((p) => {
            if (excludeSet.has(p.id)) return false;
            const slugs = (p.product_categories ?? [])
              .map((pc) => pc.categories?.slug)
              .filter(Boolean) as string[];
            return slugs.length > 0 && !slugs.includes(categorySlug);
          });
        } else {
          // Suggest featured first, then newest
          filtered = raw.filter((p) => !excludeSet.has(p.id));
        }

        setProducts(filtered.slice(0, SUGGESTED_LIMIT));
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [categorySlug, enabled, excludeProductIds]);

  return { products, loading };
}
