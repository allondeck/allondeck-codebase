import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShoppingBag,
  Package,
  Truck,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { formatPrice, parsePrice } from "../lib/utils";
import type { OrderRow, OrderItemRow } from "../types/database";

type OrderWithDetails = OrderRow & {
  order_items: (OrderItemRow & {
    products: {
      name: string;
      image_url: string | null;
    } | null;
  })[];
  coupons?: {
    code: string;
  } | null;
};

const statusSteps = [
  { id: "pending", label: "Order Placed", icon: ShoppingBag },
  { id: "processing", label: "Processing", icon: Package },
  { id: "shipped", label: "Shipped", icon: Truck },
  { id: "completed", label: "Delivered", icon: CheckCircle2 },
];

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (id) {
      void fetchOrder();
    }
  }, [id]);

  async function fetchOrder() {
    if (!id) return;
    setLoading(true);
    try {
      const { data, error: err } = await supabase
        .from("orders")
        .select(
          `
          *,
          order_items (
            *,
            products (
              name,
              image_url
            )
          ),
          coupons (
            code
          )
        `,
        )
        .eq("id", id)
        .single();

      if (err) throw err;
      setOrder(data as unknown as OrderWithDetails);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleCancelOrder() {
    if (
      !order ||
      !id ||
      !confirm("Are you sure you want to cancel this order?")
    )
      return;

    setCancelling(true);
    try {
      const { error: err } = await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", id);

      if (err) throw err;
      await fetchOrder();
    } catch (err) {
      alert(err instanceof Error ? err.message : String(err));
    } finally {
      setCancelling(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#066175]/35 border-t-[#e38622]" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-[#052631] p-8 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="mt-4 text-lg font-semibold text-red-400">
          Order not found
        </h2>
        <p className="mt-2 text-red-400">
          {error || "The requested order could not be loaded."}
        </p>
        <Link
          to="/account/orders"
          className="mt-6 inline-flex items-center gap-2 font-medium text-[#76abbf] hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex((s) => s.id === order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-12 text-left">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            to="/account/orders"
            className="mb-2 inline-flex items-center gap-1 text-sm text-[#76abbf] hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
          <h1 className="text-2xl font-bold text-white">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="text-[#76abbf]">
            Placed on {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
        {order.status === "pending" && (
          <button
            onClick={handleCancelOrder}
            disabled={cancelling}
            className="inline-flex items-center gap-2 rounded-lg border border-red-950 bg-red-900/30 px-4 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-900/50 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {cancelling ? "Cancelling..." : "Cancel Order"}
          </button>
        )}
      </div>

      {/* Status Timeline */}
      <div className="rounded-2xl border border-[#066175]/35 bg-[#052631] p-6 sm:p-8">
        {isCancelled ? (
          <div className="flex items-center gap-3 rounded-xl bg-red-900/30 border border-red-500/20 p-4 text-red-200">
            <AlertCircle className="h-6 w-6" />
            <div>
              <p className="font-semibold">This order has been cancelled</p>
              <p className="text-sm">
                If you believe this was an error, please contact support.
              </p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-0 top-[18px] hidden h-0.5 w-full bg-[#066175]/35 sm:block" />
            <div className="relative flex flex-col justify-between gap-8 sm:flex-row sm:gap-0">
              {statusSteps.map((step, idx) => {
                const Icon = step.icon;
                const isCompleted = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div
                    key={step.id}
                    className="relative z-10 flex items-center gap-4 sm:flex-col sm:gap-2"
                  >
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#052631] transition-colors ${
                        isCompleted
                          ? "bg-[#e38622] text-white"
                          : "bg-[#044155] text-[#76abbf]/50"
                      } ${isCurrent ? "ring-2 ring-[#e38622] ring-offset-2 ring-offset-[#052631]" : ""}`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span
                      className={`text-sm font-medium ${
                        isCompleted ? "text-white" : "text-[#76abbf]/60"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Items List */}
        <div className="space-y-4 lg:col-span-2">
          <h2 className="text-lg font-semibold text-white">Items Ordered</h2>
          <div className="divide-y divide-[#066175]/35 overflow-hidden rounded-2xl border border-[#066175]/35 bg-[#052631]">
            {order.order_items.map((item) => {
              const unit = parsePrice(item.product_price);
              return (
              <div key={item.id} className="flex gap-4 p-4 sm:p-6">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-[#044155]">
                  {item.products?.image_url ? (
                    <img
                      src={item.products.image_url}
                      alt={item.products.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-300">
                      <ShoppingBag className="h-8 w-8" />
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-center">
                  <h3 className="font-medium text-white">
                    {item.product_name || item.products?.name}
                  </h3>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-sm text-[#f6ebd4]">
                      {formatPrice(unit)} × {item.quantity}
                    </p>
                    <p className="font-medium text-[#f6ebd4]">
                      {formatPrice(unit * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>

        {/* Order Info Sidebar */}
        <div className="space-y-8">
          {/* Shipping Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Shipping Information
            </h2>
            <div className="rounded-2xl border border-[#066175]/35 bg-[#052631] p-6">
              <p className="text-sm text-[#76abbf]">Delivery Address</p>
              <div className="mt-2 text-[#f6ebd4]">
                {typeof order.shipping_address === "object" &&
                order.shipping_address !== null ? (
                  <address className="not-italic">
                    {(order.shipping_address as Record<string, string>)
                      .name && (
                      <p className="font-medium text-white">
                        {
                          (order.shipping_address as Record<string, string>)
                            .name
                        }
                      </p>
                    )}
                    <p>
                      {
                        (order.shipping_address as Record<string, string>)
                          .address
                      }
                    </p>
                    <p>
                      {(order.shipping_address as Record<string, string>).city},{" "}
                      {(order.shipping_address as Record<string, string>).state}{" "}
                      {(order.shipping_address as Record<string, string>).zip}
                    </p>
                    <p>
                      {
                        (order.shipping_address as Record<string, string>)
                          .country
                      }
                    </p>
                  </address>
                ) : (
                  <p>No shipping address provided.</p>
                )}
              </div>
              {order.tracking_number && (
                <div className="mt-6 border-t border-[#066175]/35 pt-6">
                  <p className="text-sm text-[#76abbf]">Tracking Number</p>
                  <p className="mt-1 font-mono text-sm font-medium text-emerald-400">
                    {order.carrier && (
                      <span className="mr-2 text-white">
                        {order.carrier}:
                      </span>
                    )}
                    {order.tracking_number}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sumary Info */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">
              Order Summary
            </h2>
            <div className="rounded-2xl border border-[#066175]/35 bg-[#052631] p-6">
              <div className="space-y-3">
                <div className="flex justify-between text-[#f6ebd4]">
                  <span>Subtotal</span>
                  <span>{formatPrice(parsePrice(order.subtotal))}</span>
                </div>
                {parsePrice(order.discount_amount) > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>
                        Discount{" "}
                        {order.coupons?.code && `(${order.coupons.code})`}
                      </span>
                      <span>
                        -{formatPrice(parsePrice(order.discount_amount))}
                      </span>
                    </div>
                  )}
                <div className="flex justify-between text-[#f6ebd4]">
                  <span>Shipping</span>
                  <span>
                    {formatPrice(parsePrice(order.shipping_total))}
                  </span>
                </div>
                <div className="flex justify-between text-[#f6ebd4]">
                  <span>Tax</span>
                  <span>{formatPrice(parsePrice(order.tax_total))}</span>
                </div>
                <div className="mt-4 flex justify-between border-t border-[#066175]/35 pt-4 text-lg font-bold text-white">
                  <span>Total</span>
                  <span>{formatPrice(parsePrice(order.total))}</span>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 rounded-lg bg-emerald-950/40 border border-emerald-500/20 p-3 text-sm text-emerald-300">
                <CheckCircle2 className="h-4 w-4" />
                <span>Payment completed successfully</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
