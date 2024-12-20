import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
} from "chart.js";

// Register components required for the Line Chart
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
);

const WeeklyTrendChart = () => {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Dataset 1",
        data: [100, 200, 150, 300, 250, 400, 350, 300, 200, 250, 400, 300],
        borderColor: "#1E3A8A", // Blue line color
        backgroundColor: "rgba(30, 58, 138, 0.2)", // Blue translucent fill
        tension: 0.4, // Smooth curves
        fill: true, // Fill the area under the line
      },
      {
        label: "Dataset 2",
        data: [150, 300, 200, 250, 300, 450, 400, 250, 150, 200, 350, 250],
        borderColor: "#64748B", // Gray line color
        backgroundColor: "rgba(100, 116, 139, 0.2)", // Gray translucent fill
        tension: 0.4, // Smooth curves
        fill: true, // Fill the area under the line
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
      tooltip: {
        enabled: true, // Enable tooltips
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-5 bg-white rounded-xl shadow-md w-full max-w-md">
      <div className="text-lg font-semibold text-gray-800 mb-2">
        Weekly trend
      </div>
      <div className="text-sm text-green-600 mb-4">Cars 5% ↑</div>
      <div style={{ height: "300px" }}>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default WeeklyTrendChart;
