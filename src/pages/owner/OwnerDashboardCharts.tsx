import { useEffect, useState } from "react";

export type DashboardChartsProps = {
  stats: {
    revenueByDay: { date: string; revenue: number; orders: number }[];
    ordersByDay: { date: string; orders: number }[];
    averageOrderValueByDay: { date: string; avg: number; orders: number }[];
    ordersByWeekday: { name: string; count: number; dayOfWeek: number }[];
  };
  ordersByStatusData: { name: string; count: number; fill: string }[];
  enabledChartIds: string[];
};

export default function OwnerDashboardCharts(props: DashboardChartsProps) {
  const [Inner, setInner] =
    useState<React.ComponentType<DashboardChartsProps> | null>(null);

  useEffect(() => {
    import("./OwnerDashboardChartsInner").then((m) =>
      setInner(() => m.default)
    );
  }, []);

  if (!Inner) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
      </div>
    );
  }
  return <Inner {...props} />;
}
