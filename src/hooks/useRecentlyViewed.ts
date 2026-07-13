import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";
import type { ProductRow } from "../types/database";

const STORAGE_KEY = "recently_viewed_product_ids";
const MAX_RECENT = 6;

function getStoredIds(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((x): x is string => typeof x === "string")
      .slice(-MAX_RECENT);
  } catch {
    return [];
  }
}

function storeIds(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.slice(-MAX_RECENT)));
  } catch {
    // ignore
  }
}

export function useRecentlyViewed(excludeProductId?: string | null) {
  const [ids, setIds] = useState<string[]>(() => getStoredIds());
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [loading, setLoading] = useState(false);

  const recordView = useCallback((productId: string) => {
    setIds((prev) => {
      const next = prev
        .filter((id) => id !== productId)
        .concat(productId)
        .slice(-MAX_RECENT);
      storeIds(next);
      return next;
    });
  }, []);

  useEffect(() => {
    const list = excludeProductId
      ? ids.filter((id) => id !== excludeProductId)
      : ids;
    if (list.length === 0) {
      setProducts([]);
      return;
    }
    setLoading(true);
    void (async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .in("id", list)
        .eq("is_published", true);
      setLoading(false);
      if (error) {
        setProducts([]);
        return;
      }
      const rows = (data ?? []) as ProductRow[];
      const byId = new Map(rows.map((p) => [p.id, p]));
      const ordered = list
        .map((id) => byId.get(id))
        .filter(Boolean) as ProductRow[];
      setProducts(ordered);
    })();
  }, [ids, excludeProductId]);

  return { products, loading, recordView };
}
