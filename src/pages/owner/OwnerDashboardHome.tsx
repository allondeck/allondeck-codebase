import { lazy, Suspense, type ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { useProductsAdmin } from "../../hooks/useProductsAdmin";
import { useOrdersAdmin } from "../../hooks/useOrdersAdmin";
import { useDashboardStats } from "../../hooks/useDashboardStats";
import { useStoreSettings } from "../../hooks/useStoreSettings";
import {
  parseDashboardWidgets,
  DASHBOARD_OVERVIEW_LIMITS,
} from "../../lib/dashboardWidgets";

const OwnerDashboardCharts = lazy(() => import("./OwnerDashboardCharts"));

const MAX_STAT_CARDS = DASHBOARD_OVERVIEW_LIMITS.stats;
const MAX_CHARTS = DASHBOARD_OVERVIEW_LIMITS.charts;
const MAX_LIST_WIDGETS = DASHBOARD_OVERVIEW_LIMITS.lists;

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  paid: "#3b82f6",
  processing: "#8b5cf6",
  shipped: "#06b6d4",
  delivered: "#22c55e",
  cancelled: "#6b7280",
  refunded: "#ef4444",
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

type OwnerDashboardHomeProps = { showAllWidgets?: boolean };

export default function OwnerDashboardHome({
  showAllWidgets = false,
}: OwnerDashboardHomeProps) {
  const location = useLocation();
  const { products } = useProductsAdmin();
  const { orders } = useOrdersAdmin();
  const { settings } = useStoreSettings();
  const { stats, loading, error } = useDashboardStats();

  const enabledWidgets = parseDashboardWidgets(settings.dashboard_widgets);
  const hasWidget = (id: string) =>
    enabledWidgets.includes(id as (typeof enabledWidgets)[number]);
  const isAllWidgetsPage =
    showAllWidgets || location.pathname === "/account/owner/widgets";
  /** On "all widgets" page we show every widget (selected or not). */
  const showWidget = (id: string) => isAllWidgetsPage || hasWidget(id);

  const publishedCount = products.filter((p) => p.is_published).length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;

  const ordersByStatusData = Object.entries(stats.ordersByStatus).map(
    ([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      count,
      fill: STATUS_COLORS[status] ?? "#94a3b8",
    })
  );

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#066175]/35 border-t-[#e38622]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-950/40 border border-red-900/55 p-4 text-red-400">
        <p className="font-medium">Failed to load dashboard</p>
        <p className="mt-1 text-sm">{error.message}</p>
      </div>
    );
  }

  const STAT_CARD_IDS = [
    "revenue_card",
    "orders_card",
    "products_card",
    "low_stock_card",
  ] as const;
  const CHART_IDS = [
    "revenue_chart",
    "orders_status_chart",
    "orders_over_time",
    "average_order_value_chart",
    "orders_by_weekday",
  ];
  const LIST_IDS = ["top_products", "low_stock_list"] as const;

  const statCardMap: Record<string, ReactNode> = {};
  if (showWidget("revenue_card")) {
    statCardMap["revenue_card"] = (
      <Link
        key="revenue_card"
        to="/owner/orders"
        className="rounded-xl border border-[#066175]/35 bg-[#052631] p-5 shadow-sm transition hover:border-[#066175]/70 hover:shadow"
      >
        <p className="text-sm font-medium text-[#76abbf]">Total Revenue</p>
        <p className="mt-1 text-2xl font-bold text-[#f6ebd4]">
          {formatCurrency(stats.revenue)}
        </p>
        <p className="mt-1 text-xs text-[#76abbf]">From paid/shipped orders</p>
      </Link>
    );
  }
  if (showWidget("orders_card")) {
    statCardMap["orders_card"] = (
      <Link
        key="orders_card"
        to="/owner/orders"
        className="rounded-xl border border-[#066175]/35 bg-[#052631] p-5 shadow-sm transition hover:border-[#066175]/70 hover:shadow"
      >
        <p className="text-sm font-medium text-[#76abbf]">Total Orders</p>
        <p className="mt-1 text-2xl font-bold text-white">
          {stats.totalOrders}
        </p>
        <p className="mt-1 text-xs text-[#76abbf]">{pendingOrders} pending</p>
      </Link>
    );
  }
  if (showWidget("products_card")) {
    statCardMap["products_card"] = (
      <Link
        key="products_card"
        to={
          stats.lowStockCount > 0
            ? "/account/owner/products?low_stock=1"
            : "/account/owner/products"
        }
        className="rounded-xl border border-[#066175]/35 bg-[#052631] p-5 shadow-sm transition hover:border-[#066175]/70 hover:shadow"
      >
        <p className="text-sm font-medium text-[#76abbf]">Product Catalog</p>
        <p className="mt-1 text-2xl font-bold text-white">
          {products.length}
        </p>
        <p className="mt-1 text-xs text-[#76abbf]">
          {publishedCount} published
          {stats.lowStockCount > 0 && (
            <span className="ml-1 font-medium text-[#e38622]">
              · {stats.lowStockCount} low stock
            </span>
          )}
        </p>
      </Link>
    );
  }
  if (showWidget("low_stock_card")) {
    statCardMap["low_stock_card"] = (
      <Link
        key="low_stock_card"
        to="/account/owner/products?low_stock=1"
        className="rounded-xl border border-[#066175]/35 bg-[#052631] p-5 shadow-sm transition hover:border-[#066175]/70 hover:shadow"
      >
        <p className="text-sm font-medium text-[#76abbf]">Low Stock Summary</p>
        <p className="mt-1 text-2xl font-bold text-[#e38622]">
          {stats.lowStockCount}
        </p>
        <p className="mt-1 text-xs text-[#76abbf]">
          Stock at or below threshold
        </p>
      </Link>
    );
  }

  const orderedStatIds = isAllWidgetsPage
    ? [...STAT_CARD_IDS]
    : enabledWidgets.filter((id) =>
        STAT_CARD_IDS.includes(id as (typeof STAT_CARD_IDS)[number])
      );
  const displayedStatCards = (
    isAllWidgetsPage ? orderedStatIds : orderedStatIds.slice(0, MAX_STAT_CARDS)
  )
    .map((id) => statCardMap[id])
    .filter(Boolean);

  const orderedChartIds = isAllWidgetsPage
    ? [...CHART_IDS]
    : enabledWidgets.filter((id) => CHART_IDS.includes(id));
  const enabledChartIds = isAllWidgetsPage
    ? orderedChartIds
    : orderedChartIds.slice(0, MAX_CHARTS);

  const topProductsWidget = showWidget("top_products") && (
    <div
      key="top_products"
      className="rounded-xl border border-[#066175]/35 bg-[#052631] p-5 shadow-sm"
    >
      <h3 className="font-semibold text-[#f6ebd4]">Top Selling Products</h3>
      {stats.topProducts.length > 0 ? (
        <div className="mt-4 space-y-3">
          {stats.topProducts.map((p, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg bg-[#066175]/30 px-3 py-2"
            >
              <span className="truncate font-medium text-white font-semibold">
                {p.name}
              </span>
              <div className="ml-2 flex shrink-0 items-center gap-3">
                <span className="text-sm text-[#76abbf]">{p.quantity} sold</span>
                <span className="text-sm font-medium text-[#f6ebd4]">
                  {formatCurrency(p.revenue)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-[#76abbf]">No sales yet</p>
      )}
    </div>
  );

  const lowStockWidget = showWidget("low_stock_list") && (
    <div
      key="low_stock_list"
      className="rounded-xl border border-[#066175]/35 bg-[#052631] p-5 shadow-sm"
    >
      <h3 className="font-semibold text-[#f6ebd4]">Low Stock Alerts</h3>
      {stats.lowStockProducts.length > 0 ? (
        <div className="mt-4 space-y-3">
          {stats.lowStockProducts.map((p) => (
            <Link
              key={p.id}
              to={`/account/owner/products/${p.id}`}
              className="flex items-center justify-between rounded-lg bg-amber-950/20 border border-amber-900/30 px-3 py-2 transition hover:bg-amber-950/40"
            >
              <span className="truncate font-medium text-white">
                {p.name}
              </span>
              <span
                className={`shrink-0 text-sm font-medium ${
                  p.stock_quantity === 0 ? "text-red-400" : "text-[#e38622]"
                }`}
              >
                {p.stock_quantity} left
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-4 text-[#76abbf]">All products have sufficient stock</p>
      )}
    </div>
  );

  const listWidgetMap: Record<string, ReactNode> = {};
  if (topProductsWidget) listWidgetMap["top_products"] = topProductsWidget;
  if (lowStockWidget) listWidgetMap["low_stock_list"] = lowStockWidget;

  const orderedListIds = isAllWidgetsPage
    ? [...LIST_IDS]
    : enabledWidgets.filter((id) =>
        LIST_IDS.includes(id as (typeof LIST_IDS)[number])
      );
  const displayedListWidgets = (
    isAllWidgetsPage
      ? orderedListIds
      : orderedListIds.slice(0, MAX_LIST_WIDGETS)
  )
    .map((id) => listWidgetMap[id])
    .filter(Boolean);

  const hasCharts = enabledChartIds.length > 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold text-[#f6ebd4]">
          {isAllWidgetsPage ? "All widgets" : "Overview"}
        </h2>
        <div className="flex items-center gap-3">
          {isAllWidgetsPage ? (
            <Link
              to="/account/owner"
              className="text-sm font-medium text-[#76abbf] hover:text-white"
            >
              ← Back to overview
            </Link>
          ) : (
            <>
              <Link
                to="/account/owner/widgets"
                className="rounded-lg border border-[#066175]/35 bg-[#052631] px-3 py-2 text-sm font-medium text-white hover:bg-[#066175]/30"
              >
                View all widgets
              </Link>
              <Link
                to="/account/owner/settings"
                className="text-sm font-medium text-[#76abbf] hover:text-white"
              >
                Customize dashboard →
              </Link>
            </>
          )}
        </div>
      </div>

      {displayedStatCards.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {displayedStatCards}
        </div>
      )}

      {hasCharts && (
        <Suspense
          fallback={
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="h-80 animate-pulse rounded-xl bg-[#066175]/30" />
              <div className="h-80 animate-pulse rounded-xl bg-[#066175]/30" />
            </div>
          }
        >
          <OwnerDashboardCharts
            stats={{
              revenueByDay: stats.revenueByDay,
              ordersByDay: stats.ordersByDay,
              averageOrderValueByDay: stats.averageOrderValueByDay,
              ordersByWeekday: stats.ordersByWeekday,
            }}
            ordersByStatusData={ordersByStatusData}
            enabledChartIds={enabledChartIds}
          />
        </Suspense>
      )}

      {displayedListWidgets.length > 0 && (
        <div className="grid gap-6 lg:grid-cols-2">{displayedListWidgets}</div>
      )}

      {displayedStatCards.length === 0 &&
        !hasCharts &&
        displayedListWidgets.length === 0 && (
          <p className="rounded-lg border border-dashed border-[#066175]/35 bg-[#052631] p-8 text-center text-[#76abbf]">
            No dashboard widgets enabled. Go to{" "}
            <Link
              to="/account/owner/settings"
              className="font-medium text-[#f6ebd4] hover:underline"
            >
              Store settings
            </Link>{" "}
            to add visualizations.
          </p>
        )}
    </div>
  );
}

