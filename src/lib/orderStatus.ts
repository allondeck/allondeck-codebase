/**
 * Single Authoritative Source of Truth for Order Statuses across the entire application.
 *
 * Enforces consistency between:
 * - PostgreSQL schema constraint: CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'))
 * - Owner Admin status selectors & badges
 * - Customer account order timelines & labels
 * - Dashboard charts & revenue statistics
 */

export const ORDER_STATUSES = [
  "pending",
  "paid",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type OrderStatusOrAlias = OrderStatus | "completed";

export interface OrderStatusOption {
  value: OrderStatus;
  label: string;
}

/**
 * Standard selectable status options for owner / admin dropdowns.
 * "delivered" is labeled "Completed" across all user-facing interfaces.
 */
export const ORDER_STATUS_OPTIONS: readonly OrderStatusOption[] = [
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "processing", label: "In progress" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
] as const;

/**
 * User-facing labels for order status.
 * Maps both "delivered" and legacy "completed" to "Completed".
 */
export const ORDER_STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  paid: "Paid",
  processing: "In progress",
  shipped: "Shipped",
  delivered: "Completed",
  completed: "Completed", // alias fallback
  cancelled: "Cancelled",
  refunded: "Refunded",
};

/**
 * Normalizes any status string (including legacy "completed") to a valid database OrderStatus.
 */
export function normalizeOrderStatus(status: string | null | undefined): OrderStatus {
  if (!status) return "pending";
  if (status === "completed") return "delivered";
  if ((ORDER_STATUSES as readonly string[]).includes(status)) {
    return status as OrderStatus;
  }
  return "pending";
}

/**
 * Returns human-readable label for an order status.
 */
export function orderStatusLabel(status: string | null | undefined): string {
  if (!status) return "Pending";
  return ORDER_STATUS_LABELS[status] ?? status;
}

/**
 * Tailwind badge styling classes for status pills.
 */
export const ORDER_STATUS_BADGE_CLASSES: Record<string, string> = {
  pending: "bg-yellow-950/40 text-yellow-400 border border-yellow-900/30",
  paid: "bg-sky-950/40 text-sky-400 border border-sky-900/30",
  processing: "bg-indigo-950/40 text-indigo-400 border border-indigo-900/30",
  shipped: "bg-blue-950/40 text-blue-400 border border-blue-900/30",
  delivered: "bg-green-950/40 text-green-400 border border-green-900/30",
  completed: "bg-green-950/40 text-green-400 border border-green-900/30",
  cancelled: "bg-red-950/40 text-red-400 border border-red-900/30",
  refunded: "bg-brand-medium/30 text-brand-light border border-brand-medium/35",
};

export function getOrderStatusBadgeClass(status: string | null | undefined): string {
  if (!status) return ORDER_STATUS_BADGE_CLASSES.pending;
  return (
    ORDER_STATUS_BADGE_CLASSES[status] ??
    "bg-brand-medium/30 text-brand-light border border-brand-medium/35"
  );
}

/**
 * Hex colors for charts (e.g. Recharts / analytics overview).
 */
export const ORDER_STATUS_HEX_COLORS: Record<string, string> = {
  pending: "#facc15",
  paid: "#38bdf8",
  processing: "#818cf8",
  shipped: "#60a5fa",
  delivered: "#4ade80",
  completed: "#4ade80",
  cancelled: "#f87171",
  refunded: "#94a3b8",
};

export function getOrderStatusHexColor(status: string | null | undefined): string {
  if (!status) return ORDER_STATUS_HEX_COLORS.pending;
  return ORDER_STATUS_HEX_COLORS[status] ?? "#94a3b8";
}

/**
 * Generates an SVG dropdown chevron URL color-coded to the status.
 */
export function getOrderStatusChevronSvg(status: string | null | undefined): string {
  const norm = normalizeOrderStatus(status);
  let strokeColor = "%23facc15"; // yellow pending
  switch (norm) {
    case "delivered":
      strokeColor = "%234ade80"; // green completed
      break;
    case "cancelled":
      strokeColor = "%23f87171"; // red
      break;
    case "shipped":
      strokeColor = "%2360a5fa"; // blue
      break;
    case "paid":
      strokeColor = "%2338bdf8"; // sky
      break;
    case "processing":
      strokeColor = "%23818cf8"; // indigo
      break;
    case "refunded":
      strokeColor = "%2394a3b8"; // slate
      break;
  }
  return `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='${strokeColor}'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E")`;
}

/**
 * Customer order progress timeline steps.
 */
export const ORDER_TIMELINE_STEPS = [
  { id: "pending", label: "Order Placed" },
  { id: "processing", label: "Processing" },
  { id: "shipped", label: "Shipped" },
  { id: "delivered", label: "Delivered" },
] as const;

export const ORDER_TIMELINE_STEP_MAP: Record<string, number> = {
  pending: 0,
  paid: 0,
  processing: 1,
  shipped: 2,
  delivered: 3,
  completed: 3,
};

export function getOrderTimelineStepIndex(status: string | null | undefined): number {
  if (!status) return 0;
  return ORDER_TIMELINE_STEP_MAP[status] ?? -1;
}

/**
 * Statuses that count toward business revenue.
 */
export const REVENUE_ORDER_STATUSES: readonly string[] = [
  "paid",
  "processing",
  "shipped",
  "delivered",
  "completed",
] as const;
