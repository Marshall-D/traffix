// src/pages/admin/monthly.tsx
import React, { useState } from "react";
import DashboardHeader from "@/src/components/dashboardHeader";
import { DashboardSidebar } from "@/src/components/dashboardSidebar";
import MonthlySectionOne from "@/src/components/monthly/MonthlySectionOne";
import Summary from "@/src/components/summary";
import { formatDate } from "@/src/utils/helpers";
import TodaysCount from "@/src/components/todaysCount";
import { monthlyData, monthlySummary } from "@/src/utils/data";
import MonthlyTrendChart from "@/src/components/monthly/MonthlyTrendChart";
import MonthlyWeeksCard from "@/src/components/monthly/MonthlyWeeksCard";

const MonthlyPage: React.FC = () => {
  const [selectedMonthStart, setSelectedMonthStart] = useState<string | null>(
    null
  );
  const [showWeekView, setShowWeekView] = useState(false);
  const [selectedMonthNumber, setSelectedMonthNumber] = useState<number | null>(
    null
  );

  // NEW: the specific week start date within the month to highlight
  const [selectedWeekStart, setSelectedWeekStart] = useState<string | null>(
    null
  );

  const title = selectedMonthStart
    ? `${formatDate(selectedMonthStart)}`
    : "Monthly Count Overview";

  // Now accepts optional third param: highlightedWeekStart
  const handleTableClick = (
    startOfMonthDate: string,
    monthNumber: number,
    highlightedWeekStart?: string | null
  ) => {
    setSelectedMonthStart(startOfMonthDate);
    setSelectedMonthNumber(monthNumber);
    setSelectedWeekStart(highlightedWeekStart ?? null);
    setShowWeekView(true);
  };

  const handleBackToMonths = () => {
    setShowWeekView(false);
    setSelectedMonthNumber(null);
    setSelectedMonthStart(null);
    setSelectedWeekStart(null);
  };

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

        <div className="flex flex-col lg:flex-row gap-4 mt-5 mx-4 mb-8">
          <div className="w-full">
            <p className="lg:hidden text-lg font-medium ">
              {selectedMonthStart ? formatDate(selectedMonthStart) : "Monthly"}
            </p>

            <div className="lg:hidden my-4">
              <TodaysCount
                count={monthlyData.reduce((s, m) => s + m.count, 0)}
              />
            </div>

            {/* Show months list OR weeks view (same pattern as your Weekly page) */}
            {!showWeekView ? (
              <MonthlySectionOne onTableItemClick={handleTableClick} />
            ) : (
              // show weeks for the selected month
              <MonthlyWeeksCard
                monthStart={selectedMonthStart!}
                monthNumber={selectedMonthNumber!}
                onBack={handleBackToMonths}
                highlightedWeekStart={selectedWeekStart}
              />
            )}
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
