// src/components/monthly/MonthlyTrendChart.tsx
import React, { FC, memo, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import type { ChartOptions, ChartData } from "chart.js";

// ensure chart.js elements/plugins are registered once (your existing file)
import "@/src/lib/chartjs";

interface MonthItem {
  month: number; // 1..12
  start: string; // ISO date string for month start
  count: number;
}

interface Props {
  data: MonthItem[];
  /**
   * Optional chart title. Defaults to "Monthly trend (this year)".
   */
  title?: string;
  /**
   * Optional aria label for accessibility.
   */
  ariaLabel?: string;
}

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const DEFAULT_COLOR = "#0056B3";

const MonthlyTrendChart: FC<Props> = ({
  data,
  title = "Monthly trend (this year)",
  ariaLabel = "Monthly trend chart",
}) => {
  // sort by month number (1..12) to ensure predictable month ordering
  const sorted = useMemo(() => {
    return [...(data || [])].sort((a, b) => Number(a.month) - Number(b.month));
  }, [data]);

  const chartData = useMemo<ChartData<"bar", number[], string>>(() => {
    const labels = sorted.map((d) => {
      const idx = (((Number(d.month) - 1) % 12) + 12) % 12; // guard against out-of-range
      return MONTH_LABELS[idx];
    });

    const datasetValues = sorted.map((d) => Number(d.count ?? 0));

    return {
      labels,
      datasets: [
        {
          label: "Monthly Count",
          data: datasetValues,
          backgroundColor: DEFAULT_COLOR,
          borderColor: DEFAULT_COLOR,
          borderWidth: 1,
        },
      ],
    };
  }, [sorted]);

  const options = useMemo<ChartOptions<"bar">>(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: {
          display: Boolean(title),
          text: title,
        },
        tooltip: {
          enabled: true,
          mode: "index",
          intersect: false,
        },
      },
      interaction: {
        mode: "nearest",
        intersect: false,
      },
      scales: {
        x: {
          stacked: false,
        },
        y: {
          beginAtZero: true,
        },
      },
    };
  }, [title]);

  // If there's no data, render a small placeholder so layout remains stable
  if (!data || data.length === 0) {
    return (
      <div className="min-h-[260px] flex items-center justify-center">
        No monthly data available
      </div>
    );
  }

  return (
    <div className="min-h-[260px]" role="region" aria-label={ariaLabel}>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default memo(MonthlyTrendChart);
