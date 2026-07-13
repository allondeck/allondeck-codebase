import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCustomerOrders } from "../hooks/useCustomerOrders";
import { formatPrice } from "../lib/utils";

export default function AccountOrders() {
  const { user, loading: authLoading } = useAuth();
  const { orders, loading, error } = useCustomerOrders();

  if (authLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#066175]/35 border-t-[#e38622]" />
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/login?redirect=/account/orders" replace />;
  }
  if (!loading && orders.length === 0 && !error) {
    return <Navigate to="/account" replace />;
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-8 sm:px-6 lg:px-8 w-full text-left">
      <Link to="/account" className="text-sm text-[#76abbf] hover:text-white">
        ← Back to account
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-white">All orders</h1>
      <p className="mt-1 text-sm text-[#76abbf]">
        {orders.length} {orders.length === 1 ? "order" : "orders"} total
      </p>

      {loading ? (
        <p className="mt-6 text-sm text-[#76abbf]">Loading...</p>
      ) : error ? (
        <p className="mt-6 text-sm text-red-400">Failed to load orders.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {orders.map((order) => (
            <li
              key={order.id}
              className="flex items-center gap-4 rounded border border-[#066175]/35 bg-[#052631] p-4"
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-[#044155]">
                {order.first_item?.image_url ? (
                  <img
                    src={order.first_item.image_url}
                    alt=""
                    width={56}
                    height={56}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-[#76abbf]">
                    —
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  to={`/account/orders/${order.id}`}
                  className="font-medium text-white hover:text-[#76abbf]"
                >
                  Order #{order.id.slice(0, 8)}
                </Link>
                <p className="text-sm text-[#76abbf]">
                  {new Date(order.created_at).toLocaleDateString()} ·{" "}
                  {order.status === "processing"
                    ? "In progress"
                    : order.status === "delivered"
                    ? "Completed"
                    : order.status}
                  {order.item_count != null && order.item_count > 0 && (
                    <>
                      {" "}
                      · {order.item_count}{" "}
                      {order.item_count === 1 ? "item" : "items"}
                    </>
                  )}
                </p>
                {order.first_item?.product_name && (
                  <p className="mt-0.5 truncate text-xs text-[#76abbf]/70">
                    {order.first_item.product_name}
                  </p>
                )}
              </div>
              <span className="shrink-0 font-medium text-[#f6ebd4]">
                {formatPrice(order.total)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
