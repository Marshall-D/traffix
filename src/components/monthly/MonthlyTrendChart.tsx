// src/components/monthly/MonthlyTrendChart.tsx
import React, { FC } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface MonthItem {
  month: number;
  start: string;
  count: number;
}

const MonthLabels = [
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
];

const MonthlyTrendChart: FC<{ data: MonthItem[] }> = ({ data }) => {
  // sort by month so chart always shows Jan..Dec order where present
  const sorted = [...data].sort((a, b) => a.month - b.month);

  const chartData = {
    labels: sorted.map((d) => MonthLabels[(d.month - 1) % 12]),
    datasets: [
      {
        label: "Monthly Count",
        data: sorted.map((d) => d.count),
        backgroundColor: "#0056B3",
        borderColor: "#0056B3",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Monthly trend (this year)" },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div style={{ minHeight: 260 }}>
      <Bar data={chartData} options={options as any} />
    </div>
  );
};

export default MonthlyTrendChart;
