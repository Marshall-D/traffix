import React, { FC } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  chartTitle?: any;
  chartData?: any;
  chartDataTwo?: any;
}
const LineChart: FC<Props> = ({ chartTitle, chartData, chartDataTwo }) => {
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
        fill: false,
        borderColor: chartData?.borderColor || "#0056B3",
        tension: 0.4, // This adds smooth curves to the line chart
        pointBackgroundColor: "#0056B3",
        backgroundColor: chartData?.backgroundColor || "#0056B3",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
      {
        label: chartDataTwo?.label || "",
        data: chartDataTwo?.data || [0, 0, 0, 0, 0, 0, 0], // Default data if not provided
        fill: false,
        borderColor: chartDataTwo?.borderColor || "#0056B3",
        backgroundColor: chartDataTwo?.backgroundColor || "#0056B3",
        tension: 0.4,
        pointBackgroundColor: "rgba(255, 99, 132, 1)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
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

        // text: ["Congestion Trends", "From May 1 - 14 May, 2024"], // Multi-line title
        font: {
          size: 10, // You can customize the font size if needed
        },
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
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
