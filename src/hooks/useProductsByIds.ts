import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import type { ProductRow } from "../types/database";

export function useProductsByIds(ids: string[]) {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("id", ids)
        .eq("is_published", true);
      if (cancelled) return;
      if (error) {
        setProducts([]);
        setLoading(false);
        return;
      }
      const list = (data ?? []) as ProductRow[];
      setProducts(list);
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [ids]);

  return { products, loading };
}
