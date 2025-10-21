// src/components/monthly/MonthlyPageView.tsx
import React, { FC } from "react";
import DashboardHeader from "@/src/components/dashboardHeader";
import { DashboardSidebar } from "@/src/components/dashboardSidebar";
import Summary from "@/src/components/summary";
import TodaysCount from "@/src/components/todaysCount";
import CountStatsCard from "@/src/components/countStatsCard";

type MonthRow = { month: number; start: string; count: number };

interface Props {
  // basic page wiring
  title: string;
  selectedYear: number;
  setSelectedYear: (y: number) => void;
  availableYears: number[];

  // view state
  selectedMonthStart: string | null;
  selectedMonthNumber: number | null;
  selectedWeekStart: string | null;
  showWeekView: boolean;
  totalCount: number;

  // callbacks
  handleTableClick: (
    startOfMonthDate: string,
    monthNumber: number,
    highlightedWeekStart?: string | null
  ) => void;
  handleBackToMonths: () => void;

  // top stats
  currentMonthCount: number | null;
  previousMonthCount: number | null;
  momPercent: number | null;
  averageMonthlyCount: number | null;

  // summary data
  computedMonthlySummary: { label: string; value: string }[];

  // components to render (injected by parent)
  section: React.ReactNode;
  weeks: React.ReactNode;
  chart: React.ReactNode;
}

const MonthlyPageView: FC<Props> = ({
  title,
  selectedYear,
  setSelectedYear,
  availableYears,
  selectedMonthStart,
  selectedMonthNumber,
  selectedWeekStart,
  showWeekView,
  totalCount,
  handleTableClick,
  handleBackToMonths,
  currentMonthCount,
  previousMonthCount,
  momPercent,
  averageMonthlyCount,
  computedMonthlySummary,
  section,
  weeks,
  chart,
}) => {
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

        {/* Year selector */}
        <div className="m-3 flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <label className="text-sm text-grey-600 font-medium">Year:</label>
              <select
                aria-label="Select year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="ml-2 border px-2 py-1 rounded-md"
              >
                {availableYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="m-3">
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <CountStatsCard
              title="Current Month Count"
              value={currentMonthCount ?? "—"}
            />
            <CountStatsCard
              title="Previous Month Count"
              value={previousMonthCount ?? "—"}
            />
            <CountStatsCard
              title="Month-over-Month Change (%)"
              value={momPercent ?? "—"}
              isPercentage={true}
            />
            <CountStatsCard
              title="Average Monthly Count (YTD)"
              value={averageMonthlyCount ?? "—"}
            />
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
            {!showWeekView
              ? section
              : selectedMonthStart && selectedMonthNumber != null
              ? weeks
              : null}
          </div>

          <div className="flex flex-col gap-4 w-full">
            <div id="summary-side" className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-6">
                <Summary
                  details={computedMonthlySummary}
                  subtitle={`last 12 months — ${selectedYear}`}
                />

                <div className="w-full rounded-2xl p-12 border-2 border-grey shadow-lg hover:bg-grey">
                  {chart}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonthlyPageView;
