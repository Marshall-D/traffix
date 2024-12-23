import React, { useState } from "react";
import BarChart from "@/src/components/barChart";
import DailySectionOne from "@/src/components/dailySectionOne";
import DashboardHeader from "@/src/components/dashboardHeader";
import { DashboardSidebar } from "@/src/components/dashboardSidebar";
import HourlySectionOne from "@/src/components/hourlysection";
import LineChart from "@/src/components/lineChart";
import { formatDate } from "@/src/utils/helpers";
import TodaysCount from "@/src/components/todaysCount";
import Summary from "@/src/components/summary";
import { dailySummary, hourlySummary } from "@/src/utils/data";

const Daily = () => {
  const [showHourlySection, setShowHourlySection] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // State to store the selected date

  const handleTableItemClick = (date: string) => {
    setSelectedDate(date); // Update selected date
    setShowHourlySection(!showHourlySection); // Toggle view
  };

  const dailyData = {
    data: [12, 19, 3, 5, 2, 3, 7],
  };

  const dailyLineChartData = {
    data: [12, 19, 3, 5, 2, 3, 7, 4, 5, 6],
    label: "Today",
  };

  const dailyLineChartDataTwo = {
    data: [2, 1, 13, 9, 6, 5, 1, 1, 2, 3],
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
    <div className="lg:pl-72 flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <div className="mb-36 lg:mb-0 block lg:hidden">
          {/* For mobile and tablet screens (default) */}
          <DashboardHeader daily={true} title={"Daily Count"} />
        </div>

        {/* For desktop screens */}
        <div className="mb-36 lg:mb-0 hidden lg:block">
          <DashboardHeader
            daily={true}
            title={
              showHourlySection && selectedDate
                ? formatDate(selectedDate)
                : "Daily Count Overview"
            }
          />
        </div>

        <div className=" flex flex-col lg:flex-row gap-4 justify-center mt-5 mx-4 mb-4">
          <div className="w-full">
            <p className="lg:hidden text-lg font-medium ">
              {showHourlySection && selectedDate && formatDate(selectedDate)}
            </p>

            <div className="lg:hidden my-4">
              <TodaysCount count={128} />{" "}
            </div>
            {!showHourlySection ? (
              <DailySectionOne onTableItemClick={handleTableItemClick} />
            ) : (
              <HourlySectionOne
                onTableItemClick={() => setShowHourlySection(false)} // Handle back navigation
              />
            )}
          </div>
          <div className="flex flex-col gap-4 w-full">
            <div id="summary-side" className="flex flex-col gap-4 w-full">
              <div className="flex flex-col  gap-6">
                <Summary
                  details={showHourlySection ? hourlySummary : dailySummary}
                  subtitle="last 7 days"
                ></Summary>

                <div className="w-full rounded-2xl p-12 border-2 border-grey  shadow-lg hover:bg-grey">
                  {showHourlySection === true ? (
                    <LineChart
                      chartDataTwo={dailyLineChartDataTwo}
                      chartData={dailyLineChartData}
                      chartTitle={dailyLineChartTitle}
                      chartLabels={dailyLineChartLabels}
                    />
                  ) : (
                    <BarChart chartData={dailyData} chartTitle="Daily trend" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Daily;
