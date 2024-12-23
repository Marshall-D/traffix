import React, { useState, useEffect } from "react";
import DashboardHeader from "@/src/components/dashboardHeader";
import { DashboardSidebar } from "@/src/components/dashboardSidebar";
import WeeklyCountCard from "@/src/components/weeklyCountCard";
import DailySectionWeeklyCountCard from "@/src/components/dailySectionWeeklyCountCard";
import SummaryWeekly from "@/src/components/summary";
import WeeklyTrendChart from "@/src/components/chart";
import {
  WeeklyData,
  weeklySummary,
  dailyData,
  monthySummary,
} from "@/src/utils/data";
import BusiestDay from "@/src/components/busiestDay";

const Weekly = () => {
  const [showDailySection, setShowDailySection] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [busiestDay, setBusiestDay] = useState<string | null>(null);

  // Find the busiest day (day string) when `dailyData` changes
  useEffect(() => {
    const maxDay = dailyData.reduce((prev, curr) =>
      curr.count > prev.count ? curr : prev
    );

    setBusiestDay(maxDay.day); // Set the `day` string directly
  }, []);

  const handleTableItemClick = (date: string | null, week: number | null) => {
    setSelectedDate(date);
    setSelectedWeek(week);

    if (date && week) {
      setShowDailySection(true);
    } else {
      setShowDailySection(false); // No data case
    }
  };

  const formattedTitle =
    selectedWeek && selectedDate
      ? `Week ${selectedWeek}, ${new Intl.DateTimeFormat("en-GB").format(
          new Date(selectedDate)
        )}`
      : selectedDate === null
      ? "No data available for this date"
      : "Weekly Count Overview";

  return (
    <div className="lg:pl-72 flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <div className="mb-36 lg:mb-0 block lg:hidden">
          {/* For mobile and tablet screens */}
          <DashboardHeader
            title={"Weekly Count"}
            showDailySection={showDailySection}
            busiestDay={busiestDay}
          />
        </div>

        {/* For desktop screens */}
        <div className="mb-36 lg:mb-0 hidden lg:block">
          <DashboardHeader
            title={showDailySection ? formattedTitle : "Weekly Count Overview"}
            showDailySection={showDailySection}
            busiestDay={busiestDay}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mt-5 mx-4">
          {/* <div id="weekly-side" className="w-full"> */}
          <div id="weekly-side" className="flex-1">
            {showDailySection && (
              <p className="lg:hidden">
                <span className="text-grey-4">Weekly</span> / Count details
              </p>
            )}
            <p className="lg:hidden text-lg font-medium ">
              {showDailySection && formattedTitle}
            </p>
            <div className="lg:hidden my-4">
              {showDailySection && (
                <div>
                  <div className="my-8">
                    <BusiestDay day={busiestDay || "N/A"} />{" "}
                  </div>
                </div>
              )}
            </div>
            {!showDailySection ? (
              <WeeklyCountCard
                onTableItemClick={handleTableItemClick}
                weeklyData={WeeklyData}
              />
            ) : (
              <DailySectionWeeklyCountCard
                onTableItemClick={() => setShowDailySection(false)}
                dailyData={dailyData}
              />
            )}
          </div>
          <div id="summary-side" className="flex-1 flex flex-col gap-4">
            {/* <div id="summary-side" className="flex flex-col gap-4 w-full"> */}
            <div className="flex flex-col  gap-6">
              <SummaryWeekly
                details={showDailySection ? weeklySummary : monthySummary}
                subtitle="last 7 days"
                showDailySection={showDailySection}
              ></SummaryWeekly>

              <div className="w-full rounded-2xl p-12 border-2 border-grey  shadow-lg hover:bg-grey">
                <WeeklyTrendChart />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Weekly;
