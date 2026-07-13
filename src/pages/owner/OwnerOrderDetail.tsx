import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "../../components/Button";
import { Select } from "../../components/Select";
import { useOrderDetail } from "../../hooks/useOrderDetail";
import { formatPrice, parsePrice } from "../../lib/utils";
import { orderStatusLabel } from "../../lib/utils";
import { supabase } from "../../lib/supabase";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "processing", label: "In progress" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

type ShippingAddress = {
  full_name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
};

function ShippingAddressDisplay({ address }: { address: unknown }) {
  const addr = address as ShippingAddress;
  return (
    <address className="mt-2 text-sm text-[#76abbf] not-italic">
      {addr.full_name && (
        <span className="block font-medium text-white">
          {addr.full_name}
        </span>
      )}
      <span className="block">
        {addr.line1}
        {addr.line2 && <>, {addr.line2}</>}
      </span>
      <span className="block">
        {addr.city}
        {addr.state && <>, {addr.state}</>} {addr.postal_code}
      </span>
      <span className="block">{addr.country}</span>
      {addr.phone && <span className="mt-1 block">Phone: {addr.phone}</span>}
    </address>
  );
}

export default function OwnerOrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { order, items, loading, error, refetch } = useOrderDetail(id);
  const [deletingOrder, setDeletingOrder] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [restoringStock, setRestoringStock] = useState(false);

  async function handleStatusChange(newStatus: string) {
    if (!id || !order || newStatus === order.status) return;
    if (
      newStatus === "cancelled" &&
      !window.confirm(
        "Mark this order as cancelled? This cannot be undone — cancelled orders cannot be reactivated.",
      )
    )
      return;
    setUpdatingStatus(true);
    try {
      const { error: err } = await supabase
        .from("orders")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (err) throw err;
      await refetch();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to update status");
    } finally {
      setUpdatingStatus(false);
    }
  }

  async function handleRestoreStock() {
    if (!id || !order || order.status !== "cancelled") return;
    if (
      !window.confirm(
        "Add the items from this cancelled order back to stock? This will increase product quantities.",
      )
    )
      return;
    setRestoringStock(true);
    try {
      const { error: err } = (await (
        supabase as unknown as {
          rpc: (
            name: string,
            args: Record<string, unknown>,
          ) => Promise<{ data: unknown; error: { message: string } | null }>;
        }
      ).rpc("restore_stock_for_order", {
        p_order_id: id,
      })) as { data: unknown; error: { message: string } | null };
      if (err) throw err;
      await refetch();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to restore stock");
    } finally {
      setRestoringStock(false);
    }
  }

  async function handleDeleteOrder() {
    if (!id || !order) return;
    if (
      !window.confirm(
        "Permanently delete this order? This cannot be undone and will remove all order lines.",
      )
    )
      return;
    setDeletingOrder(true);
    try {
      const { error: err } = await supabase
        .from("orders")
        .delete()
        .eq("id", id);
      if (err) throw err;
      navigate("/owner/orders");
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to delete order");
    } finally {
      setDeletingOrder(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#066175]/35 border-t-[#e38622]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-lg bg-red-950/40 border border-red-900/55 p-4 text-red-400">
        Order not found or failed to load.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <Button
          variant="secondary"
          type="button"
          onClick={() => navigate("/owner/orders")}
          className="text-sm text-[#76abbf] hover:text-white"
        >
          ← Back to orders
        </Button>
      </div>
      <div className="rounded-lg border border-[#066175]/35 bg-[#052631] p-6">
        <h2 className="text-xl font-semibold text-[#f6ebd4]">
          Order #{order.id.slice(0, 8)}
        </h2>
        <p className="mt-1 text-sm text-[#76abbf]">
          {new Date(order.created_at).toLocaleString()}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium text-white">Status</span>
          {order.status === "cancelled" ? (
            <>
              <span className="inline-flex rounded-full bg-red-950/40 border border-red-900/30 px-2.5 py-0.5 text-sm font-medium text-red-400">
                {orderStatusLabel(order.status)}
              </span>
              <span className="text-sm text-[#76abbf]">
                Cancelled orders cannot be reactivated.
              </span>
            </>
          ) : (
            <>
              <Select
                value={order.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={updatingStatus}
                className="max-w-[11rem]"
                aria-label="Order status"
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
              {updatingStatus && (
                <span className="text-sm text-[#76abbf]">Updating…</span>
              )}
            </>
          )}
          {order.tracking_number && (
            <span className="text-sm text-[#76abbf]">
              Tracking: {order.carrier && `${order.carrier} — `}
              <span className="font-mono">{order.tracking_number}</span>
            </span>
          )}
        </div>
        {order.status === "cancelled" && (
          <div className="mt-4 border-t border-[#066175]/35 pt-4">
            {order.stock_restored_at ? (
              <p className="text-sm text-[#76abbf]">
                Stock restored on{" "}
                {new Date(order.stock_restored_at).toLocaleString()}.
              </p>
            ) : (
              <Button
                type="button"
                variant="secondary"
                onClick={handleRestoreStock}
                disabled={restoringStock}
                className="border border-[#066175]/35 bg-[#052631] text-white hover:bg-[#066175]/30"
              >
                {restoringStock ? "Restoring…" : "Add back to stock"}
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="rounded-lg border border-[#066175]/35 bg-[#052631] p-6">
        <h3 className="font-semibold text-[#f6ebd4]">Payment</h3>
        {order.stripe_checkout_session_id ? (
          <div className="mt-2 flex items-center gap-2 rounded-lg bg-emerald-950/20 border border-emerald-900/30 px-3 py-2 text-sm text-emerald-400">
            <span aria-hidden className="text-emerald-400">
              ✓
            </span>
            <span>
              <strong>Payment received via Stripe.</strong>
            </span>
          </div>
        ) : (
          <p className="mt-2 text-sm text-[#76abbf]">
            No payment record for this order.
          </p>
        )}
      </div>
      <div className="rounded-lg border border-[#066175]/35 bg-[#052631] p-6">
        <h3 className="font-semibold text-[#f6ebd4]">Customer</h3>
        <p className="mt-1 text-sm text-white">
          {order.customer_email ?? order.guest_email ?? "—"}
        </p>
      </div>
      {(order.coupon_id != null || Number(order.discount_amount ?? 0) > 0) && (
        <div className="rounded-lg border border-[#066175]/35 bg-[#052631] p-6">
          <h3 className="font-semibold text-[#f6ebd4]">Coupon used</h3>
          <p className="mt-2 text-sm text-white">
            {order.coupons?.code != null ? (
              <span>
                <span className="font-mono font-medium text-white">
                  {order.coupons.code}
                </span>{" "}
                (−{formatPrice(order.discount_amount)})
              </span>
            ) : (
              <span>Discount −{formatPrice(order.discount_amount)}</span>
            )}
          </p>
        </div>
      )}
      {order.shipping_address != null ? (
        <div className="rounded-lg border border-[#066175]/35 bg-[#052631] p-6">
          <h3 className="font-semibold text-[#f6ebd4]">Shipping address</h3>
          <ShippingAddressDisplay address={order.shipping_address} />
        </div>
      ) : null}
      <div className="rounded-lg border border-[#066175]/35 bg-[#052631] p-6">
        <h3 className="font-semibold text-[#f6ebd4]">Items</h3>
        <ul className="mt-4 space-y-3">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-2 border-b border-[#066175]/25 pb-3 last:border-0"
            >
              <span className="text-white">{item.product_name}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#76abbf]">×{item.quantity}</span>
                <span className="font-medium text-[#f6ebd4]">
                  {formatPrice(parsePrice(item.product_price) * item.quantity)}
                </span>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-[#066175]/35 pt-4">
          <div className="flex justify-between text-sm text-[#76abbf]">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {Number(order.discount_amount ?? 0) > 0 && (
            <div className="flex justify-between text-sm text-emerald-400">
              <span>Discount</span>
              <span>−{formatPrice(order.discount_amount)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm text-[#76abbf]">
            <span>Shipping</span>
            <span>{formatPrice(order.shipping_total)}</span>
          </div>
          <div className="flex justify-between text-sm text-[#76abbf]">
            <span>Tax</span>
            <span>{formatPrice(order.tax_total)}</span>
          </div>
          <div className="mt-2 flex justify-between font-semibold text-[#f6ebd4]">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-red-900/55 bg-red-950/20 p-6">
        <h3 className="font-semibold text-red-400">Delete order</h3>
        <p className="mt-1 text-sm text-red-300">
          Permanently remove this order and all its lines from the database.
          This cannot be undone.
        </p>
        <Button
          type="button"
          onClick={handleDeleteOrder}
          disabled={deletingOrder}
          className="mt-4 border border-red-900/40 bg-red-750 text-white hover:bg-red-750/80 disabled:opacity-50"
        >
          {deletingOrder ? "Deleting…" : "Delete order"}
        </Button>
      </div>
    </div>
  );
}

