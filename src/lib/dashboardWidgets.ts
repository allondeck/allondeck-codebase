/** Max widgets shown on overview; "View all widgets" shows every widget. */
export const DASHBOARD_OVERVIEW_LIMITS = {
  stats: 4,
  charts: 4,
  lists: 2,
} as const;

export const DASHBOARD_WIDGETS = [
  // Key metrics (stats)
  {
    id: "revenue_card",
    label: "Total Revenue",
    category: "stats",
    icon: "revenue",
  },
  {
    id: "orders_card",
    label: "Total Orders",
    category: "stats",
    icon: "orders",
  },
  {
    id: "products_card",
    label: "Product Catalog",
    category: "stats",
    icon: "products",
  },
  {
    id: "low_stock_card",
    label: "Low Stock Summary",
    category: "stats",
    icon: "alert",
  },
  // Charts
  {
    id: "revenue_chart",
    label: "Revenue Trend (14 Days)",
    category: "charts",
    icon: "chart",
  },
  {
    id: "orders_status_chart",
    label: "Orders By Status",
    category: "charts",
    icon: "chart",
  },
  {
    id: "orders_over_time",
    label: "Orders Over Time (14 Days)",
    category: "charts",
    icon: "chart",
  },
  {
    id: "average_order_value_chart",
    label: "Average Order Value (14 Days)",
    category: "charts",
    icon: "chart",
  },
  {
    id: "orders_by_weekday",
    label: "Orders By Day Of Week",
    category: "charts",
    icon: "chart",
  },
  // Lists
  {
    id: "top_products",
    label: "Top Selling Products",
    category: "lists",
    icon: "list",
  },
  {
    id: "low_stock_list",
    label: "Low Stock Alerts",
    category: "lists",
    icon: "list",
  },
] as const;

export type DashboardWidgetId = (typeof DASHBOARD_WIDGETS)[number]["id"];

export const DEFAULT_DASHBOARD_WIDGETS: DashboardWidgetId[] = [
  "revenue_card",
  "orders_card",
  "products_card",
  "low_stock_card",
  "revenue_chart",
  "orders_status_chart",
  "orders_over_time",
  "top_products",
  "low_stock_list",
];

export function parseDashboardWidgets(v: unknown): DashboardWidgetId[] {
  if (v == null) return DEFAULT_DASHBOARD_WIDGETS;
  if (Array.isArray(v)) {
    const valid = v.filter(
      (x): x is DashboardWidgetId =>
        typeof x === "string" && DASHBOARD_WIDGETS.some((w) => w.id === x)
    );
    return valid.length > 0 ? valid : DEFAULT_DASHBOARD_WIDGETS;
  }
  if (typeof v === "string") {
    try {
      const parsed = JSON.parse(v) as unknown;
      return Array.isArray(parsed)
        ? parseDashboardWidgets(parsed)
        : DEFAULT_DASHBOARD_WIDGETS;
    } catch {
      return DEFAULT_DASHBOARD_WIDGETS;
    }
  }
  return DEFAULT_DASHBOARD_WIDGETS;
}

export const WIDGET_CATEGORY_LABELS: Record<string, string> = {
  stats: "Key Metrics",
  charts: "Charts & Graphs",
  lists: "Lists",
};


