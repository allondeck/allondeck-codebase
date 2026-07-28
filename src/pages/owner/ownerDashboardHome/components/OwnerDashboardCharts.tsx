import { useState, useEffect } from "react";
import type { useDashboardStats } from "../../../../hooks/useDashboardStats";

export interface DashboardChartsProps {
  stats: ReturnType<typeof useDashboardStats>["stats"];
  ordersByStatusData: any[];
  enabledChartIds: string[];
}

export default function OwnerDashboardCharts(props: DashboardChartsProps) {
  const [Component, setComponent] = useState<React.ComponentType<DashboardChartsProps> | null>(null);

  useEffect(() => {
    import("./OwnerDashboardChartsInner").then((m) =>
      setComponent(() => m.default)
    );
  }, []);

  if (!Component) {
    return (
      <div className="flex h-64 items-center justify-center rounded-lg border border-brand-medium/35 bg-brand-dark-alt">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
      </div>
    );
  }
  return <Component {...props} />;
}
