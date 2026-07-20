import { useState } from "react";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../context/AuthContext";
import { useCustomerOrders } from "../../hooks/useCustomerOrders";
import { formatPrice } from "../../lib/utils";

export default function Account() {
  const { user, profile, loading, signOut, deleteAccount, isOwner } = useAuth();
  const navigate = useNavigate();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { orders, loading: ordersLoading } = useCustomerOrders();

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-medium/35 border-t-brand-orange" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login?redirect=/account" replace />;
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 lg:px-12 py-8 sm:px-6 lg:px-8 w-full text-left">
      <h1 className="text-2xl font-bold text-white">Account</h1>
      <p className="mt-1 text-brand-cream">{profile?.full_name || user.email}</p>

      <div className="mt-8 space-y-6">
        <section className="rounded-lg border border-brand-medium/35 bg-brand-dark-alt p-6">
          <h2 className="font-semibold text-white">Profile</h2>
          <p className="mt-1 text-sm text-brand-cream">{user.email}</p>
          <p className="mt-1 text-sm text-brand-cream">
            {profile?.full_name || "No name set"}
          </p>
        </section>

        {isOwner && (
          <section className="rounded-lg border border-brand-orange/30 bg-brand-orange/10 p-6">
            <h2 className="font-semibold text-brand-orange">Store owner</h2>
            <p className="mt-1 text-sm text-brand-cream">
              You have full access to the store CMS. Manage products, orders,
              homepage sections, special offers, and store settings.
            </p>
            <Link
              to="/account/owner"
              className="mt-4 inline-block rounded-lg bg-brand-orange px-4 py-2 font-medium text-white hover:bg-orange-600 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              Open store dashboard
            </Link>
          </section>
        )}

        <section className="rounded-lg border border-brand-medium/35 bg-brand-dark-alt p-6">
          <h2 className="font-semibold text-white">Order history</h2>
          {ordersLoading ? (
            <p className="mt-2 text-sm text-brand-light">Loading...</p>
          ) : orders.length === 0 ? (
            <p className="mt-2 text-sm text-brand-light">No orders yet.</p>
          ) : (
            <>
              <ul className="mt-4 space-y-3">
                {orders.slice(0, 6).map((order) => (
                  <li
                    key={order.id}
                    className="flex items-center gap-4 rounded border border-brand-medium/35 bg-brand-dark p-3"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-brand-dark-alt">
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
              {orders.length > 6 && (
                <Link
                  to="/account/orders"
                  className="mt-4 block w-full rounded-lg border border-brand-medium/50 bg-brand-dark-alt py-2.5 text-center text-sm font-medium text-brand-cream hover:bg-brand-medium/30 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  View all {orders.length} orders
                </Link>
              )}
            </>
          )}
        </section>

        <section className="rounded-lg border border-red-950/60 bg-red-950/20 p-6">
          <h2 className="font-semibold text-white">Delete account</h2>
          <p className="mt-1 text-sm text-brand-cream">
            Permanently delete your account and all associated data. This cannot
            be undone.
            {isOwner && (
              <span className="mt-2 block font-medium text-brand-orange">
                You are the store owner. Deleting your account will remove owner
                access; the store will need a new owner.
              </span>
            )}
          </p>
          {deleteError && (
            <p className="mt-2 text-sm text-red-400">{deleteError}</p>
          )}
          {!deleteConfirm ? (
            <Button
              variant="secondary"
              type="button"
              className="mt-4 border-red-800 text-red-400 bg-red-950/30 hover:bg-red-900/40 hover:scale-105 active:scale-95 transition-all duration-200"
              onClick={() => {
                setDeleteError(null);
                setDeleteConfirm(true);
              }}
            >
              Delete my account
            </Button>
          ) : (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                className="bg-red-600 text-white hover:bg-red-700 hover:scale-105 active:scale-95 transition-all duration-200"
                disabled={deleteLoading}
                onClick={async () => {
                  setDeleteError(null);
                  setDeleteLoading(true);
                  const { error } = await deleteAccount();
                  setDeleteLoading(false);
                  if (error) {
                    setDeleteError(error.message);
                    return;
                  }
                  navigate("/", { replace: true });
                }}
              >
                {deleteLoading ? "Deleting…" : "Yes, delete my account"}
              </Button>
              <Button
                variant="secondary"
                type="button"
                disabled={deleteLoading}
                onClick={() => {
                  setDeleteConfirm(false);
                  setDeleteError(null);
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </section>

        <Button
          variant="secondary"
          type="button"
          onClick={() => void signOut()}
        >
          Sign out
        </Button>
      </div>
    </div>
  );
}
