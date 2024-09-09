import React from "react";
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

const BarChart = () => {
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
        label: "",
        data: [12, 19, 3, 5, 2, 3, 7], // Example data for each day of the week
        backgroundColor: "#0056B3",
        borderColor: "#0056B3",
        borderWidth: 1,
        // innerHeight: 4,
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
        text: "busiest days",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    // style: {

    //   height: "5000px",
    // },
  };

  return (
    // <div className=" w-full justify-stretch   rounded-2xl p-2  border-2 border-grey gap-4 shadow-lg hover:bg-grey">
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
