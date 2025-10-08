// src/components/barChart.tsx
import React, { FC, useMemo } from "react";
import { Bar } from "react-chartjs-2";
import "@/src/lib/chartjs"; // ensure ChartJS is registered once
import type { ChartData, ChartOptions } from "chart.js";

interface Series {
  label?: string;
  data?: readonly number[]; // accept readonly from constants
  backgroundColor?: string;
  borderColor?: string;
}

interface Props {
  chartTitle?: string | readonly string[];
  chartData?: Series;
  chartLabels?: readonly string[];
}

const DEFAULT_SERIES_DATA: readonly number[] = [0, 0, 0, 0, 0, 0, 0];
const DEFAULT_LABELS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const BarChart: FC<Props> = ({ chartTitle, chartData, chartLabels }) => {
  const titleText = useMemo(() => {
    if (Array.isArray(chartTitle)) return chartTitle.join(" - ");
    return chartTitle ?? "";
  }, [chartTitle]);

  const data: ChartData<"bar", number[], string> = useMemo(() => {
    // convert readonly inputs to mutable arrays for ChartData
    const labelsMutable: string[] = [...(chartLabels ?? DEFAULT_LABELS)];
    const datasetData: number[] = [...(chartData?.data ?? DEFAULT_SERIES_DATA)];

    return {
      labels: labelsMutable,
      datasets: [
        {
          label: chartData?.label ?? "",
          data: datasetData,
          backgroundColor: chartData?.backgroundColor ?? "#0056B3",
          borderColor: chartData?.borderColor ?? "#0056B3",
          borderWidth: 1,
        },
      ],
    };
  }, [chartData, chartLabels]);

  const options: ChartOptions<"bar"> = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { display: true },
        title: {
          display: Boolean(titleText),
          text: typeof titleText === "string" ? titleText : titleText.join(" "),
        },
        tooltip: { enabled: true },
      },
      scales: {
        y: { beginAtZero: true },
      },
    }),
    [titleText]
  );

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default React.memo(BarChart);
