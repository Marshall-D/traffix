// src/pages/admin/weekly.tsx
import React from "react";
import dynamic from "next/dynamic";
import DashboardHeader from "@/src/components/dashboardHeader";
import { DashboardSidebar } from "@/src/components/dashboardSidebar";
import WeeklyCountCard from "@/src/components/weeklyCountCard";
import DailySectionWeeklyCountCard from "@/src/components/dailySectionWeeklyCountCard";
import SummaryWeekly from "@/src/components/summary";
import BusiestDay from "@/src/components/busiestDay";
import useWeeklyView from "@/src/hooks/useWeeklyView";

// dynamic import of chart to avoid Chart.js SSR/hydration issues
const WeeklyTrendChart = dynamic(() => import("@/src/components/chart"), {
  ssr: false,
});

const Weekly: React.FC = () => {
  const {
    showDailySection,
    selectedWeek,
    selectedDate,
    busiestDay,
    handleTableItemClick,
    closeDailySection,
    formattedTitle,
    summaryForSidebar,
    weeklyData,
    dailyData,
  } = useWeeklyView();

  return (
    <div className="lg:pl-72 flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <div className="mb-36 lg:mb-0 block lg:hidden">
          <DashboardHeader
            title={"Weekly Count"}
            showDailySection={showDailySection}
            busiestDay={busiestDay}
          />
        </div>

        {/* Desktop header */}
        <div className="mb-36 lg:mb-0 hidden lg:block">
          <DashboardHeader
            title={showDailySection ? formattedTitle : "Weekly Count Overview"}
            showDailySection={showDailySection}
            busiestDay={busiestDay}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mt-5 mx-4">
          <div id="weekly-side" className="flex-1">
            {showDailySection && (
              <>
                <p className="lg:hidden">
                  <span className="text-grey-4">Weekly</span> / Count details
                </p>
                <p className="lg:hidden text-lg font-medium ">
                  {formattedTitle}
                </p>

                <div className="lg:hidden my-4">
                  <div className="my-8">
                    <BusiestDay day={busiestDay || "N/A"} />
                  </div>
                </div>
              </>
            )}

            {!showDailySection ? (
              <WeeklyCountCard
                onTableItemClick={handleTableItemClick}
                weeklyData={weeklyData}
              />
            ) : (
              <DailySectionWeeklyCountCard
                onTableItemClick={closeDailySection}
                dailyData={dailyData}
              />
            )}
          </div>

          <div id="summary-side" className="flex-1 flex flex-col gap-4">
            <div className="flex flex-col gap-6">
              <SummaryWeekly
                details={summaryForSidebar}
                subtitle="last 7 days"
                showDailySection={showDailySection}
              />

              <div className="w-full rounded-2xl p-12 border-2 border-grey shadow-lg hover:bg-grey">
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
