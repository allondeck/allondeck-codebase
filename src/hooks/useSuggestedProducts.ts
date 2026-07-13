import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { ProductRow } from "../types/database";

const SUGGESTED_LIMIT = 6;
const PRICE_RANGE_FACTOR = 0.5; // ±50% of price

export function useSuggestedProducts(
  productId: string | null,
  categoryIds: string[],
  price: number,
  enabled: boolean,
) {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || !productId) {
      setProducts([]);
      return;
    }

    const minPrice = Math.max(0, price * (1 - PRICE_RANGE_FACTOR));
    const maxPrice = price * (1 + PRICE_RANGE_FACTOR);

    void (async () => {
      setLoading(true);
      try {
        let query = supabase
          .from("products")
          .select("*")
          .eq("is_published", true)
          .neq("id", productId)
          .gte("price", minPrice)
          .lte("price", maxPrice)
          .limit(SUGGESTED_LIMIT);

        if (categoryIds.length > 0) {
          const orClause = categoryIds
            .map((cid) => `category_id.eq.${cid}`)
            .join(",");
          const { data: pcData } = await supabase
            .from("product_categories")
            .select("product_id")
            .or(orClause);
          const productIds = [
            ...new Set((pcData ?? []).map((r) => r.product_id)),
          ];
          if (productIds.length === 0) {
            setProducts([]);
            setLoading(false);
            return;
          }
          query = supabase
            .from("products")
            .select("*")
            .eq("is_published", true)
            .neq("id", productId)
            .gte("price", minPrice)
            .lte("price", maxPrice)
            .in("id", productIds)
            .limit(SUGGESTED_LIMIT);
        }

        const { data, error: err } = await query;
        if (err) throw err;
        const raw = (data ?? []) as ProductRow[];
        setProducts(raw);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [productId, categoryIds, price, enabled]);

  return { products, loading };
}
