import { useParams, useNavigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "../../components/Button";
import { useCustomerNote } from "../../hooks/useCustomerNote";
import {
  useOrdersByCustomerKey,
  type OrderRow,
} from "../../hooks/useOrdersByCustomerKey";
import { formatPrice, orderStatusLabel } from "../../lib/utils";

const statusColors: Record<string, string> = {
  pending: "bg-amber-950/40 text-amber-400 border border-amber-900/30",
  paid: "bg-blue-950/40 text-blue-400 border border-blue-900/30",
  processing: "bg-indigo-950/40 text-indigo-400 border border-indigo-900/30",
  shipped: "bg-purple-950/40 text-purple-400 border border-purple-900/30",
  delivered: "bg-green-950/40 text-green-400 border border-green-900/30",
  completed: "bg-green-950/40 text-green-400 border border-green-900/30",
  cancelled: "bg-red-950/40 text-red-400 border border-red-900/30",
  refunded: "bg-[#066175]/30 text-[#76abbf] border border-[#066175]/35",
};

function getStatusClass(status: string): string {
  return statusColors[status] ?? "bg-[#066175]/30 text-[#76abbf] border border-[#066175]/35";
}

export default function OwnerCustomerDetail() {
  const { customerKey: encodedKey } = useParams<{ customerKey: string }>();
  const navigate = useNavigate();
  const customerKey = encodedKey ? decodeURIComponent(encodedKey) : undefined;

  const {
    note,
    loading: noteLoading,
    saving,
    error: noteError,
    saveNote,
  } = useCustomerNote(customerKey);
  const {
    orders,
    loading: ordersLoading,
    error: ordersError,
  } = useOrdersByCustomerKey(customerKey);

  const [editing, setEditing] = useState(false);
  const [editDraft, setEditDraft] = useState("");
  const [hideCancelled, setHideCancelled] = useState(true);

  const displayedOrders = hideCancelled
    ? orders.filter((o) => o.status !== "cancelled")
    : orders;

  useEffect(() => {
    setEditDraft(note);
  }, [note, editing]);

  const displayLabel =
    orders.length > 0
      ? orders[0].customer_email ?? customerKey
      : customerKey ?? "Customer";

  const handleSaveDescription = async () => {
    await saveNote(editDraft);
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setEditDraft(note);
    setEditing(false);
  };

  if (!encodedKey || !customerKey) {
    return (
      <div className="rounded-lg bg-amber-950/20 border border-amber-900/30 p-4 text-[#e38622]">
        Missing customer.{" "}
        <Link to="/account/owner/customers" className="underline">
          Back to Customers
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <Link
          to="/account/owner/customers"
          className="text-sm font-medium text-[#76abbf] hover:text-white"
        >
          ← Customers
        </Link>
      </div>

      <h2 className="text-xl font-semibold text-[#f6ebd4]">{displayLabel}</h2>
      <p className="mt-1 text-sm text-[#76abbf]">
        {orders.length} order{orders.length !== 1 ? "s" : ""} total
      </p>

      {/* Description */}
      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-medium text-white">
            Notes (owner only)
          </h3>
          {!editing ? (
            <Button
              variant="secondary"
              className="px-3 py-1.5 text-sm"
              onClick={() => setEditing(true)}
            >
              Edit description
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="px-3 py-1.5 text-sm"
                onClick={handleCancelEdit}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                className="px-3 py-1.5 text-sm"
                onClick={handleSaveDescription}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
          )}
        </div>
        {noteError && (
          <p className="mt-1 text-sm text-red-400">{noteError.message}</p>
        )}
        {noteLoading && !editing ? (
          <div className="mt-2 h-20 animate-pulse rounded-lg bg-[#066175]/30" />
        ) : editing ? (
          <textarea
            className="mt-2 w-full rounded-lg bg-[#044155] border border-[#066175]/60 p-3 text-sm text-white shadow-sm focus:border-[#e38622] focus:ring-1 focus:ring-[#e38622]"
            rows={4}
            value={editDraft}
            onChange={(e) => setEditDraft(e.target.value)}
            placeholder="Add notes about this customer…"
          />
        ) : (
          <div className="mt-2 rounded-lg border border-[#066175]/35 bg-[#052631] p-4 text-sm text-white whitespace-pre-wrap">
            {note || <span className="text-[#76abbf]">No notes yet.</span>}
          </div>
        )}
      </section>

      {/* Orders */}
      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-sm font-medium text-white">All orders</h3>
          <label className="flex cursor-pointer items-center gap-2 text-sm text-[#76abbf]">
            <input
              type="checkbox"
              checked={hideCancelled}
              onChange={(e) => setHideCancelled(e.target.checked)}
              className="rounded border-[#066175]/60 bg-[#044155] text-[#e38622] focus:ring-[#e38622]"
            />
            Hide cancelled
          </label>
        </div>
        {ordersError && (
          <p className="mt-1 text-sm text-red-400">{ordersError.message}</p>
        )}
        {ordersLoading ? (
          <div className="mt-4 flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#066175]/35 border-t-[#e38622]" />
          </div>
        ) : orders.length === 0 ? (
          <div className="mt-4 rounded-xl border border-dashed border-[#066175]/35 bg-[#052631] p-8 text-center text-[#76abbf]">
            No orders for this customer.
          </div>
        ) : (
          <div className="mt-4 overflow-hidden rounded-xl border border-[#066175]/35 bg-[#052631] shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#066175]/35">
                <thead className="bg-[#066175]/30">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#76abbf]">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#76abbf]">
                      Order
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium uppercase text-[#76abbf]">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium uppercase text-[#76abbf]">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#066175]/35 bg-[#052631]">
                  {displayedOrders.map((order: OrderRow) => (
                    <tr
                      key={order.id}
                      className="hover:bg-[#066175]/20 cursor-pointer"
                      onClick={() =>
                        navigate(`/owner/orders/${order.id}`)
                      }
                    >
                      <td className="px-4 py-3 text-sm text-[#76abbf]">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm text-white">
                          {order.id.slice(0, 8)}…
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium border ${getStatusClass(
                            order.status
                          )}`}
                        >
                          {orderStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-[#f6ebd4]">
                        {formatPrice(order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {displayedOrders.length === 0 && orders.length > 0 && (
              <p className="py-6 text-center text-sm text-[#76abbf]">
                All orders are cancelled. Uncheck “Hide cancelled” to see them.
              </p>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

