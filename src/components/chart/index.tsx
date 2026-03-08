// src/components/weekly/WeeklyTrendChart.tsx
import React, { FC, memo, useMemo } from "react";
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";

// Ensure Chart.js elements/plugins are registered once in your app.
// This imports and executes src/lib/chartjs which registers ChartJS globally.
import "@/src/lib/chartjs";

export type WeeklyChartPoint = { date: string; count: number; week: number };

interface Props {
  title?: string;
  subtitle?: string;
  ariaLabel?: string;
  /** When provided, chart uses API data (weeks for the year). Otherwise shows empty state. */
  weeklyData?: WeeklyChartPoint[] | null;
}

/**
 * WeeklyTrendChart
 *
 * - Uses the centralized chart registration at src/lib/chartjs
 * - When weeklyData is provided (from GET /api/v1/stats/weekly), shows weekly counts for the year
 * - Memoizes data/options for stable renders
 * - Adds accessibility attributes and a graceful empty state
 */
const WeeklyTrendChart: FC<Props> = ({
  title = "Weekly trend",
  subtitle,
  ariaLabel = "Weekly trend chart",
  weeklyData,
}) => {
  const { labels, datasets } = useMemo(() => {
    if (weeklyData && weeklyData.length > 0) {
      const sorted = [...weeklyData].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      return {
        labels: sorted.map((w) => `W${w.week}`),
        datasets: [
          {
            label: "Weekly count",
            data: sorted.map((w) => w.count),
            borderColor: "#1E3A8A",
            backgroundColor: "rgba(30, 58, 138, 0.2)",
            tension: 0.4,
            fill: true,
          },
        ],
      };
    }
    return {
      labels: [] as string[],
      datasets: [] as { label: string; data: number[]; borderColor: string; backgroundColor: string; tension: number; fill: boolean }[],
    };
  }, [weeklyData]);

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

  const hasData = data?.datasets?.length && (data.datasets[0] as { data?: number[] })?.data?.length;

  if (!hasData) {
    return (
      <div className="p-5 bg-white rounded-xl shadow-md w-full">
        <div className="text-lg font-semibold text-gray-800 mb-2">{title}</div>
        {subtitle ? <div className="text-sm text-green-600 mb-4">{subtitle}</div> : null}
        <div
          style={{ height: 300 }}
          className="flex items-center justify-center text-grey-4"
        >
          No weekly data available
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
      {subtitle ? <div className="text-sm text-green-600 mb-4">{subtitle}</div> : null}
      <div style={{ height: 300 }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default memo(WeeklyTrendChart);
