import React, { useState } from "react";
import BarChart from "@/src/components/barChart";
import DailySectionOne from "@/src/components/dailySectionOne";
import DashboardHeader from "@/src/components/dashboardHeader";
import { DashboardSidebar } from "@/src/components/dashboardSidebar";
import HourlySectionOne from "@/src/components/hourlysection";
import LineChart from "@/src/components/lineChart";
import useAuthRedirect from "@/src/hooks/useAuthRedirect";

const Daily = () => {
  useAuthRedirect();

  // State to toggle between DailySectionOne and HourlySectionOne
  const [showHourlySection, setShowHourlySection] = useState(false);

  const handleTableItemClick = () => {
    setShowHourlySection(!showHourlySection); // Show HourlySectionOne on click
  };

  const dailyData = {
    data: [12, 19, 3, 5, 2, 3, 7], // Example dynamic data
  };

  const dailyLineChartData = {
    data: [12, 19, 3, 5, 2, 3, 7, 4, 5, 6], // Example dynamic data
    label: "Today",
  };

  const dailyLineChartDataTwo = {
    data: [2, 1, 13, 9, 6, 5, 1, 1, 2, 3], // Example dynamic data
    backgroundColor: "#FF5733",
    borderColor: "#FF5733",
    label: "Yesterday",
  };
  const dailyLineChartLabels = [
    "9",
    "10",
    "11",
    "12",
    "01",
    "02",
    "03",
    "04",
    "05",
  ];
  const dailyLineChartTitle = ["Hourly Trend", "9am - 5pm"];

  return (
    <div className="lg:pl-72 ">
      <DashboardSidebar></DashboardSidebar>
      <div className="mb-36 lg:mb-0">
        <DashboardHeader title="Daily Count Overview"></DashboardHeader>{" "}
      </div>

      <div className="flex flex-col  gap-4 justify-center mt-5 mx-4">
        {/* Conditionally render DailySectionOne or HourlySectionOne */}
        {!showHourlySection ? (
          <DailySectionOne onTableItemClick={handleTableItemClick} />
        ) : (
          <HourlySectionOne onTableItemClick={handleTableItemClick} />
        )}

        <div className="flex flex-col w-full gap-3 p-4 rounded-2xl border-2 border-grey shadow-lg hover:bg-grey">
          <p className="text-black font-medium">Summary</p>
          <div className="flex flex-row gap-1 text-sm text-black">
            <p className="">Total Count for last 30 days: </p>
            <p className="font-bold "> 25,047</p>
          </div>
          <div className="flex flex-row gap-1 text-sm text-black">
            <p className="">Average daily count: </p>
            <p className="font-bold "> 251</p>
          </div>
          <div className="flex flex-row gap-1 text-sm text-black">
            <p className="">Highest daily count:</p>
            <p className="font-bold "> 347</p>
          </div>
          <div className="flex flex-row gap-1 text-sm text-black">
            <p className=""> Lowest daily count: </p>
            <p className="font-bold "> 114</p>
          </div>
          <div className="flex flex-row gap-1 text-sm text-black">
            <p className=""> Highest hourly count: </p>
            <p className="font-bold "> 41</p>
          </div>
          <div className="flex flex-row gap-1 text-sm text-black">
            <p className="">Lowest hourly count: </p>
            <p className="font-bold "> 8</p>
          </div>
        </div>

        <div className="w-full justify-center rounded-2xl p-9 border-2 border-grey gap-4 shadow-lg hover:bg-grey">
          <BarChart chartData={dailyData} chartTitle="Daily trend"></BarChart>
        </div>

        <div className="w-full justify-center rounded-2xl p-9 border-2 border-grey gap-4 shadow-lg hover:bg-grey">
          <LineChart
            chartDataTwo={dailyLineChartDataTwo}
            chartData={dailyLineChartData}
            chartTitle={dailyLineChartTitle}
            chartLabels={dailyLineChartLabels}
          ></LineChart>
        </div>
      </div>
    </div>
  );
};

export default Daily;
