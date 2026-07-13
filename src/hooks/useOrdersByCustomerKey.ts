import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type OrderRow = {
  id: string;
  user_id: string | null;
  guest_email: string | null;
  customer_email: string | null;
  status: string;
  total: number | string;
  subtotal: number | string;
  shipping_total: number | string;
  tax_total: number | string;
  created_at: string;
};

export function useOrdersByCustomerKey(customerKey: string | undefined) {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(!!customerKey);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!customerKey) {
      setOrders([]);
      setLoading(false);
      return;
    }
    const key = customerKey;
    let mounted = true;

    async function fetchOrders() {
      const isUserId = UUID_REGEX.test(key);
      let query = supabase
        .from("orders")
        .select(
          "id, user_id, guest_email, customer_email, status, total, subtotal, shipping_total, tax_total, created_at"
        )
        .order("created_at", { ascending: false });

      if (isUserId) {
        query = query.eq("user_id", key);
      } else {
        query = query.or(
          `customer_email.ilike.${key},guest_email.ilike.${key}`
        );
      }

      const { data, error: err } = await query;

      if (!mounted) return;
      if (err) {
        setError(new Error(err.message));
        setOrders([]);
      } else {
        setOrders((data ?? []) as OrderRow[]);
        setError(null);
      }
      setLoading(false);
    }

    setLoading(true);
    void fetchOrders();
    return () => {
      mounted = false;
    };
  }, [customerKey]);

  return { orders, loading, error };
}
