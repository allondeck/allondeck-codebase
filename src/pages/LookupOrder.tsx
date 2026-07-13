import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/Button";
import { supabase } from "../lib/supabase";
import { formatPrice, parsePrice, orderStatusLabel } from "../lib/utils";
import { getTrackingUrl } from "../lib/tracking";

type OrderRow = {
  id: string;
  status: string;
  total: number | string;
  subtotal: number | string;
  shipping_total: number | string;
  tax_total: number | string;
  discount_amount?: number | string;
  created_at: string;
  tracking_number?: string | null;
  carrier?: string | null;
};

type OrderItemRow = {
  product_name: string;
  product_price: number | string;
  quantity: number;
};

export default function LookupOrder() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<OrderRow | null>(null);
  const [items, setItems] = useState<OrderItemRow[]>([]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = orderId.trim();
    const em = email.trim();
    if (!id || !em) {
      setError("Please enter both order ID and email.");
      return;
    }
    setError(null);
    setOrder(null);
    setItems([]);
    setLoading(true);
    try {
      const { data: orderData, error: orderErr } = (await (
        supabase as unknown as {
          rpc: (
            name: string,
            args: Record<string, unknown>,
          ) => Promise<{ data: unknown; error: { message: string } | null }>;
        }
      ).rpc("get_order_for_guest", {
        lookup_order_id: id,
        lookup_email: em,
      })) as { data: OrderRow[] | null; error: { message: string } | null };
      if (orderErr) {
        setError(orderErr.message);
        setLoading(false);
        return;
      }
      const rows = (orderData ?? []) as OrderRow[];
      if (rows.length === 0) {
        setError("Order not found or email does not match.");
        setLoading(false);
        return;
      }
      const o = rows[0];
      setOrder(o);
      const { data: itemsData, error: itemsErr } = (await (
        supabase as unknown as {
          rpc: (
            name: string,
            args: Record<string, unknown>,
          ) => Promise<{ data: unknown; error: { message: string } | null }>;
        }
      ).rpc("get_order_items_for_guest", {
        lookup_order_id: o.id,
        lookup_email: em,
      })) as { data: OrderItemRow[] | null; error: { message: string } | null };
      if (!itemsErr && itemsData) {
        setItems((itemsData as OrderItemRow[]) ?? []);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-8 sm:px-6 lg:px-8 w-full text-left">
      <h1 className="text-2xl font-bold text-white">Look up your order</h1>
      <p className="mt-1 text-sm text-[#76abbf]">
        Enter the order ID and email address used when you placed the order.
      </p>
      <form
        onSubmit={handleSubmit}
        className="mt-6 space-y-4 rounded-lg border border-[#066175]/35 bg-[#052631] p-6"
      >
        <div>
          <label
            htmlFor="lookup-order-id"
            className="block text-sm font-medium text-[#f6ebd4]"
          >
            Order ID
          </label>
          <input
            id="lookup-order-id"
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="e.g. abc12345-..."
            className="mt-1 w-full rounded-lg border border-[#066175]/50 bg-[#044155] px-3 py-2 text-white placeholder-[#76abbf]/50 focus:border-[#e38622] focus:outline-none focus:ring-1 focus:ring-[#e38622] font-mono text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="lookup-email"
            className="block text-sm font-medium text-[#f6ebd4]"
          >
            Email
          </label>
          <input
            id="lookup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="mt-1 w-full rounded-lg border border-[#066175]/50 bg-[#044155] px-3 py-2 text-white placeholder-[#76abbf]/50 focus:border-[#e38622] focus:outline-none focus:ring-1 focus:ring-[#e38622]"
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Looking up..." : "Look up order"}
        </Button>
      </form>

      {order && (
        <div className="mt-8 space-y-4">
          <div className="rounded-lg border border-[#066175]/35 bg-[#052631] p-6">
            <h2 className="text-xl font-semibold text-white">
              Order #{order.id.slice(0, 8)}
            </h2>
            <p className="mt-1 text-[#f6ebd4]">
              {new Date(order.created_at).toLocaleString()} ·{" "}
              {orderStatusLabel(order.status)}
            </p>
            {order.tracking_number && (
              <div className="mt-4 border-t border-[#066175]/35 pt-4">
                <h3 className="text-sm font-semibold text-white">
                  Tracking
                </h3>
                <p className="mt-1 text-sm text-[#f6ebd4]">
                  {order.carrier && (
                    <span className="font-medium">{order.carrier}: </span>
                  )}
                  <span className="font-mono">{order.tracking_number}</span>
                </p>
                {getTrackingUrl(order.carrier, order.tracking_number) ? (
                  <a
                    href={getTrackingUrl(order.carrier, order.tracking_number)!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-medium text-[#e38622] hover:underline"
                  >
                    Track package →
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      navigator.clipboard.writeText(order.tracking_number ?? "")
                    }
                    className="mt-2 text-sm font-medium text-[#76abbf] hover:text-white"
                  >
                    Copy tracking number
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="rounded-lg border border-[#066175]/35 bg-[#052631] p-6">
            <h3 className="font-semibold text-white">Items</h3>
            <ul className="mt-4 space-y-3">
              {items.map((item, i) => (
                <li
                  key={i}
                  className="flex justify-between border-b border-[#066175]/35 pb-3 last:border-0"
                >
                  <span className="text-white">
                    {item.product_name} × {item.quantity}
                  </span>
                  <span className="font-medium text-[#f6ebd4]">
                    {formatPrice(
                      parsePrice(item.product_price) * item.quantity,
                    )}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-4 border-t border-[#066175]/35 pt-4">
              <div className="flex justify-between text-sm text-[#f6ebd4]">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              {Number(order.discount_amount ?? 0) > 0 && (
                <div className="flex justify-between text-sm text-emerald-400">
                  <span>Discount</span>
                  <span>−{formatPrice(order.discount_amount)}</span>
                </div>
              )}
              <div className="mt-2 flex justify-between font-semibold text-white">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
          <Button
            variant="secondary"
            type="button"
            onClick={() => {
              setOrder(null);
              setItems([]);
              setOrderId("");
              setEmail("");
              setError(null);
            }}
          >
            Look up another order
          </Button>
        </div>
      )}

      <p className="mt-6 text-center text-sm text-[#76abbf]">
        <Link to="/" className="text-[#76abbf] hover:text-white">
          Back to store
        </Link>
      </p>
    </div>
  );
}
