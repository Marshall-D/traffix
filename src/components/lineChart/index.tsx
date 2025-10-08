// src/components/lineChart.tsx
import React, { FC, useMemo } from "react";
import { Line } from "react-chartjs-2";
import "@/src/lib/chartjs"; // ensure ChartJS is registered once
import type { ChartData, ChartOptions } from "chart.js";

interface Series {
  label?: string;
  // accept readonly arrays coming from constants (e.g. `as readonly number[]`)
  data?: readonly number[];
  backgroundColor?: string;
  borderColor?: string;
}

interface Props {
  // accept both mutable and readonly string arrays for title
  chartTitle?: string | readonly string[];
  chartData?: Series;
  chartDataTwo?: Series;
  chartLabels?: readonly string[]; // accept readonly labels
}

const DEFAULT_SERIES_DATA: readonly number[] = [0, 0, 0, 0, 0, 0, 0];

const LineChart: FC<Props> = ({
  chartTitle,
  chartData,
  chartDataTwo,
  chartLabels,
}) => {
  // Normalize chart title (array -> joined string)
  const titleText = useMemo(() => {
    if (Array.isArray(chartTitle)) {
      // chartTitle may be readonly; join still works
      return chartTitle.join(" - ");
    }
    return chartTitle ?? "";
  }, [chartTitle]);

  // Build chart data as mutable arrays to satisfy ChartData<"line", number[], string>
  const data: ChartData<"line", number[], string> = useMemo(() => {
    // convert readonly number[] (or undefined) to mutable number[]
    const firstData: number[] = [...(chartData?.data ?? DEFAULT_SERIES_DATA)];
    const secondData: number[] = [
      ...(chartDataTwo?.data ?? DEFAULT_SERIES_DATA),
    ];

    // convert readonly labels to mutable string[]
    const labelsMutable: string[] = [...(chartLabels ?? [])];

    return {
      labels: labelsMutable,
      datasets: [
        {
          label: chartData?.label ?? "",
          data: firstData,
          fill: false,
          borderColor: chartData?.borderColor ?? "#0056B3",
          backgroundColor: chartData?.backgroundColor ?? "#0056B3",
          tension: 0.4,
          pointBackgroundColor: chartData?.borderColor ?? "#0056B3",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        },
        {
          label: chartDataTwo?.label ?? "",
          data: secondData,
          fill: false,
          borderColor: chartDataTwo?.borderColor ?? "#FF6384",
          backgroundColor: chartDataTwo?.backgroundColor ?? "#FF6384",
          tension: 0.4,
          pointBackgroundColor: chartDataTwo?.backgroundColor ?? "#FF6384",
          pointBorderColor: "#fff",
          pointBorderWidth: 2,
        },
      ],
    };
  }, [chartData, chartDataTwo, chartLabels]);

  const options: ChartOptions<"line"> = useMemo(
    () => ({
      responsive: true,
      plugins: {
        legend: { display: true },
        title: {
          display: Boolean(titleText),
          text: typeof titleText === "string" ? titleText : titleText.join(" "),
          font: { size: 10 },
        },
        tooltip: { enabled: true },
      },
      scales: { y: { beginAtZero: true } },
    }),
    [titleText]
  );

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default React.memo(LineChart);
