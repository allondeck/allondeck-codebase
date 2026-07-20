import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useCustomerOrders } from "../../hooks/useCustomerOrders";
import { formatPrice } from "../../lib/utils";

export default function AccountOrders() {
  const { user, loading: authLoading } = useAuth();
  const { orders, loading, error } = useCustomerOrders();

  if (authLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-medium/35 border-t-brand-orange" />
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
      <Link to="/account" className="text-sm text-brand-light hover:text-white">
        ← Back to account
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-white">All orders</h1>
      <p className="mt-1 text-sm text-brand-light">
        {orders.length} {orders.length === 1 ? "order" : "orders"} total
      </p>

      {loading ? (
        <p className="mt-6 text-sm text-brand-light">Loading...</p>
      ) : error ? (
        <p className="mt-6 text-sm text-red-400">Failed to load orders.</p>
      ) : (
        <ul className="mt-6 space-y-3">
          {orders.map((order) => (
            <li
              key={order.id}
              className="flex items-center gap-4 rounded border border-brand-medium/35 bg-brand-dark-alt p-4"
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-brand-dark">
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
                  <div className="flex h-full w-full items-center justify-center text-xs text-brand-light">
                    —
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  to={`/account/orders/${order.id}`}
                  className="font-medium text-white hover:text-brand-light"
                >
                  Order #{order.id.slice(0, 8)}
                </Link>
                <p className="text-sm text-brand-light">
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
                  <p className="mt-0.5 truncate text-xs text-brand-light/70">
                    {order.first_item.product_name}
                  </p>
                )}
              </div>
              <span className="shrink-0 font-medium text-brand-cream">
                {formatPrice(order.total)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
