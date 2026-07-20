import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { formatPrice } from "../../lib/utils";
import type { OrderRow } from "../../types/database";

export default function OwnerOrders() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error: err } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (err) {
      setError(err.message);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    try {
      const { error: err } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", id);
      if (err) throw err;
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status } : o)),
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    }
  }

  if (loading)
    return (
      <div className="py-8 text-center text-brand-light">Loading orders...</div>
    );
  if (error)
    return <div className="py-8 text-center text-red-400">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-brand-cream">Orders</h2>
      </div>

      <div className="overflow-x-auto rounded-lg border border-brand-medium/35 bg-brand-dark-alt">
        <table className="min-w-full divide-y divide-brand-medium/35">
          <thead className="bg-brand-medium/30">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-brand-light">
                Order
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-brand-light">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-brand-light">
                Total
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-brand-light">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-brand-light">
                Date
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-medium/35 bg-brand-dark-alt">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-brand-medium/20">
                <td className="whitespace-nowrap px-6 py-4">
                  <Link
                    to={`/owner/orders/${order.id}`}
                    className="font-medium text-white hover:text-brand-light"
                  >
                    #{order.id.slice(0, 8)}
                  </Link>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-white">
                    {order.customer_email || order.guest_email || "N/A"}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-brand-cream">
                  {formatPrice(order.total)}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold border ${
                      order.status === "completed"
                        ? "bg-green-950/40 text-green-400 border-green-900/30"
                        : order.status === "cancelled"
                          ? "bg-red-950/40 text-red-400 border-red-900/30"
                          : order.status === "shipped"
                            ? "bg-blue-950/40 text-blue-400 border-blue-900/30"
                            : "bg-yellow-950/40 text-yellow-400 border-yellow-900/30"
                    } focus:outline-none focus:ring-1 focus:ring-brand-orange`}
                  >
                    <option className="bg-brand-dark-alt text-white" value="pending">Pending</option>
                    <option className="bg-brand-dark-alt text-white" value="processing">Processing</option>
                    <option className="bg-brand-dark-alt text-white" value="shipped">Shipped</option>
                    <option className="bg-brand-dark-alt text-white" value="completed">Completed</option>
                    <option className="bg-brand-dark-alt text-white" value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-brand-light">
                  {new Date(order.created_at).toLocaleDateString()}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                  <Link
                    to={`/owner/orders/${order.id}`}
                    className="text-brand-light hover:text-white"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="py-12 text-center text-brand-light">
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
}

