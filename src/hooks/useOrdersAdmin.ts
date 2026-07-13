import { useEffect, useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

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

export type OrderSortBy =
  | "newest"
  | "oldest"
  | "total_desc"
  | "total_asc"
  | "status";

export function useOrdersAdmin(options?: {
  sortBy?: OrderSortBy;
  statusFilter?: string;
}) {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const sortBy = options?.sortBy ?? "newest";
  const statusFilter = options?.statusFilter;

  const refetch = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("orders")
      .select(
        "id, user_id, guest_email, customer_email, status, total, subtotal, shipping_total, tax_total, created_at",
      );

    if (statusFilter) {
      query = query.eq("status", statusFilter);
    }

    switch (sortBy) {
      case "oldest":
        query = query.order("created_at", { ascending: true });
        break;
      case "total_desc":
        query = query.order("total", { ascending: false });
        break;
      case "total_asc":
        query = query.order("total", { ascending: true });
        break;
      case "status":
        query = query
          .order("status", { ascending: true })
          .order("created_at", { ascending: false });
        break;
      case "newest":
      default:
        query = query.order("created_at", { ascending: false });
        break;
    }

    const { data, error: err } = await query;
    setLoading(false);
    if (err) {
      setError(err);
      return;
    }
    setOrders((data ?? []) as OrderRow[]);
    setError(null);
  }, [statusFilter, sortBy]);

  useEffect(() => {
    void refetch();
  }, [sortBy, statusFilter, refetch]);

  return { orders, loading, error, refetch };
}
