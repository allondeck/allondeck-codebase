import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { parsePrice } from "../lib/utils";

export type CustomerSummary = {
  /** Stable key: email or user_id for grouping */
  key: string;
  /** Display email (customer_email || guest_email or "—") */
  email: string;
  /** User ID if logged-in customer */
  userId: string | null;
  /** Number of completed orders */
  orderCount: number;
  /** Sum of order totals */
  totalSpent: number;
};

const COMPLETED_STATUSES = ["delivered", "completed"];

export function useCustomersFromOrders() {
  const [customers, setCustomers] = useState<CustomerSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function fetchAndGroup() {
      const { data, error: err } = await supabase
        .from("orders")
        .select("id, user_id, guest_email, customer_email, total")
        .in("status", COMPLETED_STATUSES);

      if (!mounted) return;
      if (err) {
        setError(new Error(err.message));
        setLoading(false);
        return;
      }

      const rows = (data ?? []) as Array<{
        id: string;
        user_id: string | null;
        guest_email: string | null;
        customer_email: string | null;
        total: number | string;
      }>;

      const byKey = new Map<
        string,
        {
          email: string;
          userId: string | null;
          orderCount: number;
          totalSpent: number;
        }
      >();

      for (const o of rows) {
        const email = (o.customer_email ?? o.guest_email ?? "").trim() || "—";
        // Only use a stable key: email or user_id. Never use order id (would be wrong on detail page).
        const hasEmail = email !== "—";
        const hasUserId = o.user_id != null && o.user_id !== "";
        if (!hasEmail && !hasUserId) continue; // skip orders we can't attribute to a customer

        const key = hasEmail ? email.toLowerCase() : o.user_id!;
        const total = parsePrice(o.total);

        const existing = byKey.get(key);
        if (existing) {
          existing.orderCount += 1;
          existing.totalSpent += total;
        } else {
          byKey.set(key, {
            email,
            userId: o.user_id,
            orderCount: 1,
            totalSpent: total,
          });
        }
      }

      const list: CustomerSummary[] = Array.from(byKey.entries()).map(
        ([key, v]) => ({
          key,
          email: v.email,
          userId: v.userId,
          orderCount: v.orderCount,
          totalSpent: v.totalSpent,
        })
      );
      list.sort((a, b) => b.totalSpent - a.totalSpent);
      setCustomers(list);
      setError(null);
      setLoading(false);
    }

    void fetchAndGroup();
    return () => {
      mounted = false;
    };
  }, []);

  return { customers, loading, error };
}
