import { useCallback, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { parsePrice } from "../lib/utils";
import type { DealRow, DealItemRow } from "../types/database";

export type DealWithItems = DealRow & { deal_items: DealItemRow[] };

export function useDealsAdmin() {
  const [deals, setDeals] = useState<DealWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDeals = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    void fetchDeals();
  }, [fetchDeals]);

  async function createDeal(
    name: string,
    totalPrice: number,
    items: { product_id: string; quantity: number }[],
  ) {
    const { data: deal, error: dealErr } = await supabase
      .from("deals")
      .insert({
        name: name || "Combo deal",
        total_price: totalPrice,
        sort_order: 0,
      })
      .select("id")
      .single();
    if (dealErr || !deal) throw dealErr || new Error("Failed to create deal");
    if (items.length > 0) {
      const { error: itemsErr } = await supabase.from("deal_items").insert(
        items.map((i) => ({
          deal_id: deal.id,
          product_id: i.product_id,
          quantity: i.quantity || 1,
        })),
      );
      if (itemsErr) throw itemsErr;
    }
    await fetchDeals();
  }

  async function updateDeal(
    dealId: string,
    name: string,
    totalPrice: number,
    items: { product_id: string; quantity: number }[],
  ) {
    await supabase
      .from("deals")
      .update({
        name: name || "Combo deal",
        total_price: totalPrice,
        updated_at: new Date().toISOString(),
      })
      .eq("id", dealId);
    await supabase.from("deal_items").delete().eq("deal_id", dealId);
    if (items.length > 0) {
      await supabase.from("deal_items").insert(
        items.map((i) => ({
          deal_id: dealId,
          product_id: i.product_id,
          quantity: i.quantity || 1,
        })),
      );
    }
    await fetchDeals();
  }

  async function deleteDeal(dealId: string) {
    const { error: err } = await supabase
      .from("deals")
      .delete()
      .eq("id", dealId);
    if (err) throw err;
    await fetchDeals();
  }

  return {
    deals,
    loading,
    error,
    refetch: fetchDeals,
    createDeal,
    updateDeal,
    deleteDeal,
  };
}
