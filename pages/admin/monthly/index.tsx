// src/pages/admin/monthly.tsx
import React from "react";
import DashboardHeader from "@/src/components/dashboardHeader";
import { DashboardSidebar } from "@/src/components/dashboardSidebar";
// lazy-load components that use browser APIs / non-SSR-friendly libs
const MonthlySectionOne = dynamic(
  () => import("@/src/components/monthly/MonthlySectionOne"),
  { ssr: false }
);

const MonthlyTrendChart = dynamic(
  () => import("@/src/components/monthly/MonthlyTrendChart"),
  { ssr: false }
);
import Summary from "@/src/components/summary";
import TodaysCount from "@/src/components/todaysCount";
import { monthlyData, monthlySummary } from "@/src/utils/data";
import MonthlyWeeksCard from "@/src/components/monthly/MonthlyWeeksCard";
import useMonthlyView from "@/src/hooks/useMonthlyView";
import dynamic from "next/dynamic";
import CountStatsCard from "@/src/components/countStatsCard";

const MonthlyPage: React.FC = () => {
  const {
    selectedMonthStart,
    selectedMonthNumber,
    selectedWeekStart,
    showWeekView,
    title,
    totalCount,
    handleTableClick,
    handleBackToMonths,
  } = useMonthlyView();

  return (
    <div className="lg:pl-72 flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <div className="mb-36 lg:mb-0 block lg:hidden">
          <DashboardHeader daily={false} title={"Monthly Count"} />
        </div>

        <div className="mb-36 lg:mb-0 hidden lg:block">
          <DashboardHeader title={title} />
        </div>

        <div className="m-3">
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <CountStatsCard title="Current Month Count" value="73" />
            <CountStatsCard title="Previous Month Count" value="288" />
            <CountStatsCard
              title="Month-over-Month Change (%)"
              value={1503} // pass a numeric value (1503 → will render "1,503%")
              isPercentage={true}
              // optional explicit override: "up" | "down" | "neutral"
              // trend="up"
            />{" "}
            <CountStatsCard title="Average Monthly Count (YTD)" value="4,179" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 mt-5 mx-4 mb-8">
          <div className="w-full">
            <p className="lg:hidden text-lg font-medium ">
              {selectedMonthStart ? title : "Monthly"}
            </p>

            <div className="lg:hidden my-4">
              <TodaysCount count={totalCount} />
            </div>

            {/* Show months list OR weeks view */}
            {!showWeekView ? (
              <MonthlySectionOne onTableItemClick={handleTableClick} />
            ) : selectedMonthStart && selectedMonthNumber != null ? (
              <MonthlyWeeksCard
                monthStart={selectedMonthStart}
                monthNumber={selectedMonthNumber}
                onBack={handleBackToMonths}
                highlightedWeekStart={selectedWeekStart}
              />
            ) : null}
          </div>

          <div className="flex flex-col gap-4 w-full">
            <div id="summary-side" className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-6">
                <Summary details={monthlySummary} subtitle="last 12 months" />

                <div className="w-full rounded-2xl p-12 border-2 border-grey shadow-lg hover:bg-grey">
                  <MonthlyTrendChart data={monthlyData} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyPage;
