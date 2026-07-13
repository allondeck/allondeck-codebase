import { useEffect, useState, useMemo } from "react";
import { supabase } from "../lib/supabase";
import { parsePrice } from "../lib/utils";
import type { DealRow, DealItemRow } from "../types/database";

export type DealWithItems = DealRow & {
  deal_items: DealItemRow[];
};

/** Storefront: fetch all deals with their items. Used for Deals filter (product ids) and to show combo info. */
export function useDeals() {
  const [deals, setDeals] = useState<DealWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!supabase) return;
    (async () => {
      const { data: dealsData, error: dealsErr } = await supabase
        .from("deals")
        .select("id, name, total_price, sort_order, created_at, updated_at")
        .order("sort_order", { ascending: true });
      if (dealsErr) {
        setError(dealsErr);
        setLoading(false);
        return;
      }
      const dealList = (dealsData ?? []) as DealRow[];
      if (dealList.length === 0) {
        setDeals([]);
        setLoading(false);
        return;
      }
      const { data: itemsData, error: itemsErr } = await supabase
        .from("deal_items")
        .select("id, deal_id, product_id, quantity, created_at")
        .in(
          "deal_id",
          dealList.map((d) => d.id),
        );
      if (itemsErr) {
        setError(itemsErr);
        setLoading(false);
        return;
      }
      const items = (itemsData ?? []) as DealItemRow[];
      const withItems: DealWithItems[] = dealList.map((d) => ({
        ...d,
        total_price: parsePrice(d.total_price),
        deal_items: items.filter((i) => i.deal_id === d.id),
      }));
      setDeals(withItems);
      setLoading(false);
    })();
  }, []);

  /** All product IDs that appear in any deal (for the Deals filter on Products page). */
  const dealProductIds = useMemo(() => {
    const set = new Set<string>();
    for (const d of deals) {
      for (const item of d.deal_items) {
        set.add(item.product_id);
      }
    }
    return Array.from(set);
  }, [deals]);

  return { deals, loading, error, dealProductIds };
}
