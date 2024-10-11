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

interface Props {
  chartTitle?: string;
  chartData?: any;
}

const BarChart: FC<Props> = ({ chartTitle, chartData }) => {
  const data = {
    labels: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
    datasets: [
      {
        label: chartData?.label || "",
        data: chartData?.data || [0, 0, 0, 0, 0, 0, 0], // Default data if not provided
        backgroundColor: chartData?.backgroundColor || "#0056B3",
        borderColor: chartData?.borderColor || "#0056B3",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      title: {
        display: true,
        text: chartTitle || "", // Default title if not provided
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
