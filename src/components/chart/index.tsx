// src/components/weekly/WeeklyTrendChart.tsx
import React, { FC, memo, useMemo } from "react";
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

// Ensure Chart.js elements/plugins are registered once in your app.
// This imports and executes src/lib/chartjs which registers ChartJS globally.
import "@/src/lib/chartjs";

interface Props {
  title?: string;
  subtitle?: string;
  ariaLabel?: string;
}

/**
 * WeeklyTrendChart
 *
 * - Uses the centralized chart registration at src/lib/chartjs
 * - Ensures labels/data lengths match (7 days)
 * - Memoizes data/options for stable renders
 * - Adds accessibility attributes and a graceful empty state
 */
const WeeklyTrendChart: FC<Props> = ({
  title = "Weekly trend",
  subtitle = "Cars 5% ↑",
  ariaLabel = "Weekly trend chart",
}) => {
  // labels for the week (7 days)
  const labels = useMemo(
    () => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    []
  );

  // datasets must match labels length. The original code had arrays of length 12,
  // which caused an implicit mismatch — we truncate/ensure to 7 points here.
  const datasets = useMemo(() => {
    const ds1 = [100, 200, 150, 300, 250, 400, 350];
    const ds2 = [150, 300, 200, 250, 300, 450, 400];

    return [
      {
        label: "Dataset 1",
        data: ds1,
        borderColor: "#1E3A8A",
        backgroundColor: "rgba(30, 58, 138, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Dataset 2",
        data: ds2,
        borderColor: "#64748B",
        backgroundColor: "rgba(100, 116, 139, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ] as const;
  }, []);

  const data = useMemo<ChartData<"line">>(() => {
    return {
      labels,
      datasets: datasets as unknown as ChartData<"line">["datasets"],
    };
  }, [labels, datasets]);

  const options = useMemo<ChartOptions<"line">>(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
        },
        title: {
          display: false, // we show the title in markup above the chart
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };
  }, []);

  // Graceful placeholder if no data (shouldn't happen with the defaults above)
  if (!data || data.datasets?.length === 0) {
    return (
      <div className="p-5 bg-white rounded-xl shadow-md w-full">
        <div className="text-lg font-semibold text-gray-800 mb-2">{title}</div>
        <div className="text-sm text-green-600 mb-4">{subtitle}</div>
        <div
          style={{ height: 300 }}
          className="flex items-center justify-center"
        >
          No data available
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-5 bg-white rounded-xl shadow-md w-full"
      role="region"
      aria-label={ariaLabel}
    >
      <div className="text-lg font-semibold text-gray-800 mb-2">{title}</div>
      <div className="text-sm text-green-600 mb-4">{subtitle}</div>
      <div style={{ height: 300 }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default memo(WeeklyTrendChart);
