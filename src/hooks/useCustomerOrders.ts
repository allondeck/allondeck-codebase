import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/AuthContext";

export type OrderRow = {
  id: string;
  status: string;
  total: number | string;
  created_at: string;
  first_item?: { image_url: string | null; product_name: string };
  item_count?: number;
};

type OrderItemWithProduct = {
  order_id: string;
  product_name: string;
  products: { image_url: string | null } | null;
};

export function useCustomerOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }
    void (async () => {
      const { data: ordersData, error: orderErr } = await supabase
        .from("orders")
        .select("id, status, total, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (orderErr) {
        setError(orderErr);
        setLoading(false);
        return;
      }
      const orderList = (ordersData ?? []) as OrderRow[];
      if (orderList.length === 0) {
        setOrders([]);
        setError(null);
        setLoading(false);
        return;
      }

      const orderIds = orderList.map((o) => o.id);
      const { data: itemsData } = await supabase
        .from("order_items")
        .select("order_id, product_name, products(image_url)")
        .in("order_id", orderIds)
        .order("order_id")
        .order("id");

      const items = (itemsData ?? []) as OrderItemWithProduct[];
      const orderIdToFirstItem = new Map<
        string,
        { image_url: string | null; product_name: string }
      >();
      const orderIdToCount = new Map<string, number>();
      for (const item of items) {
        if (!orderIdToFirstItem.has(item.order_id)) {
          orderIdToFirstItem.set(item.order_id, {
            image_url: item.products?.image_url ?? null,
            product_name: item.product_name,
          });
        }
        orderIdToCount.set(
          item.order_id,
          (orderIdToCount.get(item.order_id) ?? 0) + 1,
        );
      }

      const ordersWithDetails = orderList.map((o) => ({
        ...o,
        first_item: orderIdToFirstItem.get(o.id),
        item_count: orderIdToCount.get(o.id) ?? 0,
      }));
      setOrders(ordersWithDetails);
      setError(null);
      setLoading(false);
    })();
  }, [user]);

  return { orders, loading, error };
}
