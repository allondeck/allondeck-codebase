import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useCouponsAdmin } from "../../hooks/useCouponsAdmin";
import { useCouponOrderStats } from "../../hooks/useCouponOrderStats";
import { useDealsAdmin } from "../../hooks/useDealsAdmin";
import { useDealOrderStats } from "../../hooks/useDealOrderStats";
import { ComboDealsManager } from "./ComboDealsManager";
import { formatPrice } from "../../lib/utils";

const SCOPE_LABELS: Record<string, string> = {
  all: "All items",
  featured: "Featured items",
  categories: "Specific categories",
  products: "Specific products",
};

function formatDiscount(c: {
  discount_type: string;
  discount_value: number;
}): string {
  if (c.discount_type === "percent") return `${c.discount_value}% off`;
  return `$${Number(c.discount_value).toFixed(2)} off`;
}

type TabId = "coupons" | "deals";

export default function OwnerCouponsInner() {
  const navigate = useNavigate();
  const {
    coupons,
    loading: couponsLoading,
    error: couponsError,
  } = useCouponsAdmin();
  const { statsByCouponId, loading: statsLoading } = useCouponOrderStats();
  const { deals } = useDealsAdmin();
  const {
    statsByDealId,
    totals: dealTotals,
    loading: dealStatsLoading,
  } = useDealOrderStats();
  const [activeTab, setActiveTab] = useState<TabId>("coupons");

  const totals = useMemo(() => {
    let totalSaved = 0;
    let totalSpent = 0;
    let orderCount = 0;
    Object.values(statsByCouponId).forEach((s) => {
      totalSaved += s.totalSaved;
      totalSpent += s.totalSpent;
      orderCount += s.orderCount;
    });
    return { totalSaved, totalSpent, orderCount };
  }, [statsByCouponId]);

  const chartData = useMemo(() => {
    return coupons
      .map((c) => {
        const stats = statsByCouponId[c.id];
        return {
          code: c.code,
          saved: stats?.totalSaved ?? 0,
          orders: stats?.orderCount ?? 0,
        };
      })
      .filter((d) => d.saved > 0 || d.orders > 0)
      .sort((a, b) => b.saved - a.saved)
      .slice(0, 10);
  }, [coupons, statsByCouponId]);

  const dealChartData = useMemo(() => {
    return deals
      .map((d) => {
        const stats = statsByDealId[d.id];
        return {
          name: d.name || "Unnamed deal",
          revenue: stats?.totalRevenue ?? 0,
          orders: stats?.orderCount ?? 0,
          units: stats?.unitsSold ?? 0,
        };
      })
      .filter((d) => d.revenue > 0 || d.orders > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [deals, statsByDealId]);

  const dealPieData = useMemo(() => {
    return dealChartData.map((d, i) => ({
      ...d,
      fill: [
        "#6366f1",
        "#8b5cf6",
        "#a855f7",
        "#d946ef",
        "#ec4899",
        "#f43f5e",
        "#f97316",
        "#eab308",
        "#22c55e",
        "#14b8a6",
      ][i % 10],
    }));
  }, [dealChartData]);

  if (couponsLoading && coupons.length === 0) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-medium/35 border-t-brand-orange" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-brand-cream">Discounts</h2>
        <div className="flex rounded-lg border border-brand-medium/35 bg-brand-dark-alt p-1">
          <button
            type="button"
            onClick={() => setActiveTab("coupons")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === "coupons"
                ? "bg-brand-medium/30 text-white shadow-sm"
                : "text-brand-light hover:text-white"
            }`}
          >
            Coupons
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("deals")}
            className={`rounded-md px-4 py-2 text-sm font-medium transition ${
              activeTab === "deals"
                ? "bg-brand-medium/30 text-white shadow-sm"
                : "text-brand-light hover:text-white"
            }`}
          >
            Deals
          </button>
        </div>
      </div>

      {activeTab === "coupons" && (
        <>
          {couponsError && (
            <div className="mb-4 rounded-lg bg-red-950/40 border border-red-900/55 p-4 text-red-400">
              Failed to load coupons: {couponsError.message}
            </div>
          )}

          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-emerald-900/35 bg-emerald-950/15 p-4">
              <p className="text-sm font-medium text-emerald-400">
                Total saved by customers
              </p>
              <p className="mt-1 text-2xl font-bold text-emerald-300">
                {statsLoading ? "—" : formatPrice(totals.totalSaved)}
              </p>
              <p className="mt-0.5 text-xs text-emerald-400">
                Discount amount from all coupon redemptions
              </p>
            </div>
            <div className="rounded-xl border border-brand-medium/35 bg-brand-dark-alt p-4 shadow-sm">
              <p className="text-sm font-medium text-white">
                Spent with coupons
              </p>
              <p className="mt-1 text-2xl font-bold text-brand-cream">
                {statsLoading ? "—" : formatPrice(totals.totalSpent)}
              </p>
              <p className="mt-0.5 text-xs text-brand-light">
                Order total from orders that used a coupon
              </p>
            </div>
            <div className="rounded-xl border border-brand-medium/35 bg-brand-dark-alt p-4 shadow-sm">
              <p className="text-sm font-medium text-white">
                Orders with coupon
              </p>
              <p className="mt-1 text-2xl font-bold text-brand-cream">
                {totals.orderCount}
              </p>
              <p className="mt-0.5 text-xs text-brand-light">
                Number of orders that used any coupon
              </p>
            </div>
          </div>

          {chartData.length > 0 && (
            <div className="mb-6 rounded-xl border border-brand-medium/35 bg-brand-dark-alt p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-white">
                Savings by coupon
              </h3>
              <p className="mt-0.5 text-xs text-brand-light">
                Total discount amount per coupon (top 10)
              </p>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#066175" strokeOpacity={0.2} />
                    <XAxis dataKey="code" tick={{ fontSize: 12, fill: '#76abbf' }} />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#76abbf' }}
                      tickFormatter={(v) => `$${v}`}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#052631', borderColor: '#066175', color: '#fff' }}
                      labelStyle={{ color: '#f6ebd4' }}
                      itemStyle={{ color: '#fff' }}
                      formatter={(value) =>
                        value != null
                          ? [formatPrice(Number(value)), "Saved"]
                          : null
                      }
                      labelFormatter={(label) => `Code: ${label}`}
                    />
                    <Bar
                      dataKey="saved"
                      fill="#e38622"
                      radius={[4, 4, 0, 0]}
                      name="Saved"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-brand-light">
              Manage discount codes applied at checkout.
            </p>
            <Link
              to="/account/owner/coupons/new"
              className="w-full rounded-lg bg-brand-orange px-4 py-2 text-center text-sm font-medium text-white hover:bg-brand-orange/80 sm:w-auto"
            >
              Add coupon
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto rounded-lg border border-brand-medium/35 bg-brand-dark-alt">
            <table className="w-full min-w-[640px] table-fixed divide-y divide-brand-medium/35">
              <thead className="bg-brand-medium/30">
                <tr>
                  <th className="w-[14%] px-4 py-2.5 text-left text-xs font-medium uppercase text-brand-light">
                    Code
                  </th>
                  <th className="w-[14%] px-4 py-2.5 text-left text-xs font-medium uppercase text-brand-light">
                    Discount
                  </th>
                  <th className="w-[14%] px-4 py-2.5 text-left text-xs font-medium uppercase text-brand-light">
                    Applies to
                  </th>
                  <th className="w-[10%] px-4 py-2.5 text-left text-xs font-medium uppercase text-brand-light">
                    Usage
                  </th>
                  <th className="w-[12%] px-4 py-2.5 text-left text-xs font-medium uppercase text-brand-light">
                    Saved
                  </th>
                  <th className="w-[12%] px-4 py-2.5 text-left text-xs font-medium uppercase text-brand-light">
                    Spent
                  </th>
                  <th className="w-[14%] px-4 py-2.5 text-left text-xs font-medium uppercase text-brand-light">
                    Valid
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-medium/35 bg-brand-dark-alt">
                {coupons.map((c) => {
                  const stats = statsByCouponId[c.id];
                  return (
                    <tr
                      key={c.id}
                      onClick={() => navigate(`/account/owner/coupons/${c.id}`)}
                      className="cursor-pointer hover:bg-brand-medium/20"
                    >
                      <td className="px-4 py-2.5 font-mono font-medium text-white">
                        {c.code}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-brand-light">
                        {formatDiscount(c)}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-brand-light">
                        {SCOPE_LABELS[c.scope] ?? c.scope}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-brand-light">
                        {c.usage_limit != null
                          ? `${c.usage_count} / ${c.usage_limit}`
                          : c.usage_count}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-brand-light">
                        {stats ? formatPrice(stats.totalSaved) : "—"}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-brand-light">
                        {stats ? formatPrice(stats.totalSpent) : "—"}
                      </td>
                      <td className="px-4 py-2.5 text-sm text-brand-light">
                        {c.starts_at || c.ends_at
                          ? [
                              c.starts_at
                                ? new Date(c.starts_at).toLocaleDateString()
                                : "",
                              c.ends_at
                                ? new Date(c.ends_at).toLocaleDateString()
                                : "",
                            ]
                              .filter(Boolean)
                              .join(" – ")
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {coupons.length === 0 && (
            <p className="mt-6 text-center text-brand-light">
              No coupons yet. Add one to offer discounts at checkout.
            </p>
          )}
        </>
      )}

      {activeTab === "deals" && (
        <>
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-indigo-900/35 bg-indigo-950/15 p-4">
              <p className="text-sm font-medium text-indigo-400">
                Revenue from combos
              </p>
              <p className="mt-1 text-2xl font-bold text-indigo-300">
                {dealStatsLoading
                  ? "—"
                  : formatPrice(dealTotals?.totalRevenue ?? 0)}
              </p>
              <p className="mt-0.5 text-xs text-indigo-400">
                Total from orders that included a combo deal
              </p>
            </div>
            <div className="rounded-xl border border-brand-medium/35 bg-brand-dark-alt p-4 shadow-sm">
              <p className="text-sm font-medium text-white">
                Orders with a deal
              </p>
              <p className="mt-1 text-2xl font-bold text-brand-cream">
                {dealTotals?.distinctOrdersWithDeal ?? 0}
              </p>
              <p className="mt-0.5 text-xs text-brand-light">
                Orders that contained at least one combo
              </p>
            </div>
            <div className="rounded-xl border border-brand-medium/35 bg-brand-dark-alt p-4 shadow-sm">
              <p className="text-sm font-medium text-white">Units sold</p>
              <p className="mt-1 text-2xl font-bold text-brand-cream">
                {dealTotals?.unitsSold ?? 0}
              </p>
              <p className="mt-0.5 text-xs text-brand-light">
                Total units across all deals
              </p>
            </div>
          </div>

          {dealChartData.length > 0 && (
            <div className="mb-6 grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border border-brand-medium/35 bg-brand-dark-alt p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-white">
                  Revenue by deal
                </h3>
                <p className="mt-0.5 text-xs text-brand-light">
                  Top 10 combo deals by revenue
                </p>
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={dealChartData}
                      margin={{ top: 8, right: 8, left: 8, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#066175" strokeOpacity={0.2} />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: '#76abbf' }}
                        interval={0}
                        angle={-20}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: '#76abbf' }}
                        tickFormatter={(v) => `$${v}`}
                      />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#052631', borderColor: '#066175', color: '#fff' }}
                        labelStyle={{ color: '#f6ebd4' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value) =>
                          value != null
                            ? [formatPrice(Number(value)), "Revenue"]
                            : null
                        }
                        labelFormatter={(label) => label}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="#e38622"
                        radius={[4, 4, 0, 0]}
                        name="Revenue"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="rounded-xl border border-brand-medium/35 bg-brand-dark-alt p-4 shadow-sm">
                <h3 className="text-sm font-semibold text-white">
                  Share of combo revenue
                </h3>
                <p className="mt-0.5 text-xs text-brand-light">
                  Revenue split by deal
                </p>
                <div className="mt-4 h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart
                      margin={{ top: 16, right: 16, left: 16, bottom: 16 }}
                    >
                      <Pie
                        data={dealPieData}
                        dataKey="revenue"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                      >
                        {dealPieData.map((entry, i) => (
                          <Cell key={`${entry.name}-${i}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#052631', borderColor: '#066175', color: '#fff' }}
                        labelStyle={{ color: '#f6ebd4' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value) =>
                          value != null ? formatPrice(Number(value)) : ""
                        }
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          {dealChartData.length === 0 && !dealStatsLoading && (
            <p className="mb-6 text-sm text-brand-light">
              No combo sales yet. Charts will appear once customers order
              combos.
            </p>
          )}

          <ComboDealsManager />
        </>
      )}
    </div>
  );
}

