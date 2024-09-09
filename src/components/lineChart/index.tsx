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

const LineChart = () => {
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
        label: "last 7 days",
        data: [10, 15, 8, 12, 18, 9, 14], // Sample data for each day of the week
        fill: false,
        borderColor: "#0056B3",
        tension: 0.4, // This adds smooth curves to the line chart
        pointBackgroundColor: "#0056B3",
        backgroundColor: "#0056B3",

        pointBorderColor: "#fff",
        pointBorderWidth: 2,
      },
      {
        label: "previous 7 days",
        data: [12, 10, 14, 16, 9, 13, 8], // Data for Week 2
        fill: false,
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
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
        text: "congestion trends",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    // <div className=" w-full justify-center   rounded-2xl p-2  border-2 border-grey gap-4 shadow-lg hover:bg-grey">
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
