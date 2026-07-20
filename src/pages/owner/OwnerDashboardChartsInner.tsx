import type { ReactNode } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";
import type { DashboardChartsProps } from "./OwnerDashboardCharts";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}

function formatDate(s: string) {
  const d = new Date(s);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function showChart(enabledChartIds: string[], id: string) {
  return enabledChartIds.includes(id);
}

export default function OwnerDashboardChartsInner({
  stats,
  ordersByStatusData,
  enabledChartIds,
}: DashboardChartsProps) {


  const revenueChart = showChart(enabledChartIds, "revenue_chart") && (
    <div
      key="revenue_chart"
      className="rounded-xl border border-brand-medium/35 bg-brand-dark-alt p-5 shadow-sm"
    >
      <h3 className="font-semibold text-brand-cream">Revenue Trend (14 Days)</h3>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={stats.revenueByDay}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e38622" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#e38622" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#066175" strokeOpacity={0.2} />
            <XAxis
              dataKey="date"
              tickFormatter={(v) => formatDate(v + "T00:00:00")}
              tick={{ fontSize: 11, fill: '#76abbf' }}
            />
            <YAxis
              tickFormatter={(v) => `$${v}`}
              tick={{ fontSize: 11, fill: '#76abbf' }}
              width={45}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#052631', borderColor: '#066175', color: '#fff' }}
              labelStyle={{ color: '#f6ebd4' }}
              itemStyle={{ color: '#fff' }}
              formatter={(value: any) => [
                formatCurrency(value ?? 0),
                "Revenue",
              ]}
              labelFormatter={(label) =>
                formatDate(String(label) + "T00:00:00")
              }
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#e38622"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const ordersStatusChart = showChart(
    enabledChartIds,
    "orders_status_chart"
  ) && (
    <div
      key="orders_status_chart"
      className="rounded-xl border border-brand-medium/35 bg-brand-dark-alt p-5 shadow-sm"
    >
      <h3 className="font-semibold text-brand-cream">Orders By Status</h3>
      <div className="mt-4 h-64">
        {ordersByStatusData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={ordersByStatusData}
              layout="vertical"
              margin={{ left: 20, right: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#066175" strokeOpacity={0.2} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#76abbf' }} />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 11, fill: '#76abbf' }}
                width={80}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#052631', borderColor: '#066175', color: '#fff' }}
                labelStyle={{ color: '#f6ebd4' }}
                itemStyle={{ color: '#fff' }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-brand-light">
            No orders yet
          </div>
        )}
      </div>
    </div>
  );

  const averageOrderValueChart = showChart(
    enabledChartIds,
    "average_order_value_chart"
  ) && (
    <div
      key="average_order_value_chart"
      className="rounded-xl border border-brand-medium/35 bg-brand-dark-alt p-5 shadow-sm"
    >
      <h3 className="font-semibold text-brand-cream">
        Average Order Value (14 Days)
      </h3>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={stats.averageOrderValueByDay}>
            <CartesianGrid strokeDasharray="3 3" stroke="#066175" strokeOpacity={0.2} />
            <XAxis
              dataKey="date"
              tickFormatter={(v) => formatDate(v + "T00:00:00")}
              tick={{ fontSize: 11, fill: '#76abbf' }}
            />
            <YAxis
              tickFormatter={(v) => `$${v}`}
              tick={{ fontSize: 11, fill: '#76abbf' }}
              width={45}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#052631', borderColor: '#066175', color: '#fff' }}
              labelStyle={{ color: '#f6ebd4' }}
              itemStyle={{ color: '#fff' }}
              formatter={(value: any) => [
                formatCurrency(value ?? 0),
                "Avg. order value",
              ]}
              labelFormatter={(label) =>
                formatDate(String(label) + "T00:00:00")
              }
            />
            <Line
              type="monotone"
              dataKey="avg"
              stroke="#e38622"
              strokeWidth={2}
              dot={{ r: 3 }}
              name="AOV"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const ordersByWeekdayChart = showChart(
    enabledChartIds,
    "orders_by_weekday"
  ) && (
    <div
      key="orders_by_weekday"
      className="rounded-xl border border-brand-medium/35 bg-brand-dark-alt p-5 shadow-sm"
    >
      <h3 className="font-semibold text-brand-cream">Orders By Day Of Week</h3>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={stats.ordersByWeekday}
            margin={{ left: 20, right: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#066175" strokeOpacity={0.2} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#76abbf' }} />
            <YAxis tick={{ fontSize: 11, fill: '#76abbf' }} width={30} />
            <Tooltip
              contentStyle={{ backgroundColor: '#052631', borderColor: '#066175', color: '#fff' }}
              labelStyle={{ color: '#f6ebd4' }}
              itemStyle={{ color: '#fff' }}
              formatter={(value: any) => [value, "Orders"]}
            />
            <Bar
              dataKey="count"
              fill="#e38622"
              radius={[4, 4, 0, 0]}
              name="Orders"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const ordersOverTimeChart = showChart(
    enabledChartIds,
    "orders_over_time"
  ) && (
    <div
      key="orders_over_time"
      className="rounded-xl border border-brand-medium/35 bg-brand-dark-alt p-5 shadow-sm"
    >
      <h3 className="font-semibold text-brand-cream">
        Orders Over Time (14 Days)
      </h3>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={stats.ordersByDay}>
            <defs>
              <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#76abbf" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#76abbf" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#066175" strokeOpacity={0.2} />
            <XAxis
              dataKey="date"
              tickFormatter={(v) => formatDate(v + "T00:00:00")}
              tick={{ fontSize: 11, fill: '#76abbf' }}
            />
            <YAxis tick={{ fontSize: 11, fill: '#76abbf' }} width={30} />
            <Tooltip
              contentStyle={{ backgroundColor: '#052631', borderColor: '#066175', color: '#fff' }}
              labelStyle={{ color: '#f6ebd4' }}
              itemStyle={{ color: '#fff' }}
              formatter={(value: any) => [value, "Orders"]}
              labelFormatter={(label) =>
                formatDate(String(label) + "T00:00:00")
              }
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="#76abbf"
              strokeWidth={2}
              fill="url(#ordersGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const chartMap: Record<string, ReactNode> = {
    revenue_chart: revenueChart,
    orders_status_chart: ordersStatusChart,
    orders_over_time: ordersOverTimeChart,
    average_order_value_chart: averageOrderValueChart,
    orders_by_weekday: ordersByWeekdayChart,
  };
  const chartWidgets = enabledChartIds
    .map((id) => chartMap[id])
    .filter(Boolean);

  if (chartWidgets.length === 0) return null;

  return <div className="grid gap-6 lg:grid-cols-2">{chartWidgets}</div>;
}

