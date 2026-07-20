import { Link } from "react-router-dom";
import { useCustomersFromOrders } from "../../hooks/useCustomersFromOrders";
import { formatPrice } from "../../lib/utils";

export default function OwnerCustomers() {
  const { customers, loading, error } = useCustomersFromOrders();

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-medium/35 border-t-brand-orange" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-950/40 border border-red-900/55 p-4 text-red-400">
        Failed to load customers: {error.message}
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-brand-cream">Customers</h2>
      <p className="mt-1 text-sm text-brand-light">
        Customers with at least one completed order, ordered by total spent.
      </p>

      {customers.length === 0 ? (
        <div className="mt-8 rounded-xl border-2 border-dashed border-brand-medium/35 bg-brand-dark-alt p-12 text-center">
          <p className="text-white">No customers yet.</p>
          <p className="mt-1 text-sm text-brand-light">
            Customers appear here once they have at least one order marked as
            delivered or completed.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-brand-medium/35 bg-brand-dark-alt shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-brand-medium/35">
              <thead className="bg-brand-medium/30">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase text-brand-light">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-brand-light">
                    Completed Orders
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase text-brand-light">
                    Total spent
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-medium/35 bg-brand-dark-alt">
                {customers.map((c) => (
                  <tr key={c.key} className="hover:bg-brand-medium/20">
                    <td className="px-4 py-3">
                      <Link
                        to={`/account/owner/customers/${encodeURIComponent(
                          c.key
                        )}`}
                        className="font-medium text-white hover:underline"
                      >
                        {c.email}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right text-brand-light">
                      {c.orderCount}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-brand-cream">
                      {formatPrice(c.totalSpent)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

