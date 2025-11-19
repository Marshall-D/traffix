// src/pages/admin/daily.tsx
import React, { useMemo } from "react";
import withAuth from "@/src/hocs/withAuth";
import BarChart from "@/src/components/barChart";
import DailySectionOne from "@/src/components/dailySectionOne";
import DashboardHeader from "@/src/components/dashboardHeader";
import { DashboardSidebar } from "@/src/components/dashboardSidebar";
import HourlySectionOne from "@/src/components/hourlysection";
import LineChart from "@/src/components/lineChart";
import { formatDate } from "@/src/utils/helpers";
import TodaysCount from "@/src/components/todaysCount";
import Summary from "@/src/components/summary";
import {
  dailyLineChartDataTwo,
  dailySummary,
  dailyBarData,
  hourlySummary,
  dailyLineChartTitle,
  dailyLineChartLabels,
  dailyLineChartData,
} from "@/src/utils/data";
import useDailyView from "@/src/hooks/useDailyView";

const Daily: React.FC = () => {
  const {
    showHourlySection,
    selectedDate,
    handleTableItemClick,
    handleBackFromHourly,
  } = useDailyView();

  const headerTitle = useMemo(() => {
    if (showHourlySection && selectedDate) {
      return formatDate(selectedDate);
    }
    return "Daily Count Overview";
  }, [showHourlySection, selectedDate]);

  return (
    <div className="lg:pl-72 flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        {/* Mobile / tablet header */}
        <div className="mb-36 lg:mb-0 block lg:hidden">
          <DashboardHeader daily={true} title={"Daily Count"} />
        </div>

        {/* Desktop header */}
        <div className="mb-36 lg:mb-0 hidden lg:block">
          <DashboardHeader daily={true} title={headerTitle} />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 justify-center mt-5 mx-4 mb-4">
          <div className="w-full">
            {/* Mobile single-line date when viewing hourly */}
            <p className="lg:hidden text-lg font-medium ">
              {showHourlySection && selectedDate && formatDate(selectedDate)}
            </p>

            <div className="lg:hidden my-4">
              <TodaysCount count={128} />
            </div>

            {!showHourlySection ? (
              <DailySectionOne onTableItemClick={handleTableItemClick} />
            ) : (
              <HourlySectionOne onTableItemClick={handleBackFromHourly} />
            )}
          </div>

          <div className="flex flex-col gap-4 w-full">
            <div id="summary-side" className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-6">
                <Summary
                  details={showHourlySection ? hourlySummary : dailySummary}
                  subtitle="last 7 days"
                />

                <div className="w-full rounded-2xl p-12 border-2 border-grey shadow-lg hover:bg-grey">
                  {showHourlySection ? (
                    <LineChart
                      chartDataTwo={dailyLineChartDataTwo}
                      chartData={dailyLineChartData}
                      chartTitle={dailyLineChartTitle}
                      chartLabels={dailyLineChartLabels}
                    />
                  ) : (
                    <BarChart
                      chartData={dailyBarData}
                      chartTitle="Daily trend"
                    />
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

export default withAuth(Daily);
