import React, { useState } from "react";
import BarChart from "@/src/components/barChart";
import DailySectionOne from "@/src/components/dailySectionOne";
import DashboardHeader from "@/src/components/dashboardHeader";
import { DashboardSidebar } from "@/src/components/dashboardSidebar";
import HourlySectionOne from "@/src/components/hourlysection";
import LineChart from "@/src/components/lineChart";
import { formatDate } from "@/src/utils/helpers";
import WeeklyCountCard from "@/src/components/weeklyCountCard";
import DailySectionWeeklyCountCard from "@/src/components/dailySectionWeeklyCountCard";
import WeeklyTrendChart from "@/src/components/chart";
import SummaryWeekly from "@/src/components/summaryWeekly";
import { WeeklyData, weeklySummary } from "@/src/utils/data";

const Weekly = () => {
  const [showDailySection, setShowDailySection] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null); // State to store the selected date

  const handleTableItemClick = (date: string) => {
    const week = WeeklyData.find((item) => item.date === date)?.week || null;

    setSelectedDate(date); // Update selected date
    setSelectedWeek(week); // Update selected week
    setShowDailySection(!showDailySection); // Toggle view
  };

  const formattedTitle =
    selectedWeek && selectedDate
      ? `Week ${selectedWeek}, ${new Intl.DateTimeFormat("en-GB").format(
          new Date(selectedDate)
        )}`
      : "Weekly Count Overview";

  return (
    <div className="lg:pl-72 flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <div className="mb-36 lg:mb-0 block lg:hidden">
          {/* For mobile and tablet screens (default) */}
          <DashboardHeader
            title={showDailySection ? formattedTitle : "Weekly Count Overview"}
            showDailySection={showDailySection}
            // selectedDate={selectedDate}
            // busiestDay={busiestDay}
          />
        </div>

        {/* For desktop screens */}
        <div className="mb-36 lg:mb-0 hidden lg:block">
          <DashboardHeader
            title={showDailySection ? formattedTitle : "Weekly Count Overview"}
            showDailySection={showDailySection}
            // selectedDate={selectedDate}
            // busiestDay={busiestDay}
          />
        </div>
        <div className="flex flex-col lg:flex-row gap-4 mt-5 mx-4">
          <div id="weekly-side" className="w-full">
            <p className="lg:hidden text-lg font-medium ">
              {showDailySection && formattedTitle}
            </p>
            {!showDailySection ? (
              <WeeklyCountCard
                onTableItemClick={handleTableItemClick}
                weeklyData={WeeklyData}
              />
            ) : (
              <DailySectionWeeklyCountCard
                onTableItemClick={() => setShowDailySection(false)} // Handle back navigation
              />
            )}
          </div>
          <div id="summary-side" className="flex flex-col gap-4 w-full">
            <div className="flex flex-col  gap-6">
              <SummaryWeekly
                details={weeklySummary}
                subtitle="last 7 days"
              ></SummaryWeekly>

              <div className="w-full rounded-2xl p-12 border-2 border-grey  shadow-lg hover:bg-grey">
                {/* <BarChart chartData={dailyData} chartTitle="Daily trend" /> */}
                <WeeklyTrendChart></WeeklyTrendChart>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weekly;
