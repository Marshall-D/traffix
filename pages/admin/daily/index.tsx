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
import { useAuth } from "@/src/context/AuthContext";
import useDailyView from "@/src/hooks/useDailyView";
import useDailyStats from "@/src/hooks/useDailyStats";
import useDailyHourly from "@/src/hooks/useDailyHourly";
import useAdminCount from "@/src/hooks/useAdminCount";

function summaryDetailsFromDaily(summary: {
  average?: number;
  highest?: number;
  lowest?: number;
} | null): { label: string; value: string }[] {
  if (!summary) return [];
  return [
    { label: "Average Daily Count", value: String(summary.average ?? "—") },
    { label: "Highest Daily Count", value: String(summary.highest ?? "—") },
    { label: "Lowest Daily Count", value: String(summary.lowest ?? "—") },
  ];
}

function summaryDetailsFromHourly(hourlyData: { hour: string; count: number }[]): { label: string; value: string }[] {
  if (!hourlyData.length) return [];
  const counts = hourlyData.map((h) => h.count);
  const sum = counts.reduce((a, b) => a + b, 0);
  const avg = Math.round(sum / counts.length);
  const highest = Math.max(...counts);
  const lowest = Math.min(...counts);
  return [
    { label: "Average Hourly Count", value: String(avg) },
    { label: "Highest Hourly Count", value: String(highest) },
    { label: "Lowest Hourly Count", value: String(lowest) },
  ];
}

function getTodayDateString(): string {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
}

function getYesterdayDateString(): string {
  const n = new Date();
  n.setDate(n.getDate() - 1);
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
}

/** YYYY-MM-DD for n days ago (e.g. 7 = a week ago). */
function getDateDaysAgo(days: number): string {
  const n = new Date();
  n.setDate(n.getDate() - days);
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
}

const Daily: React.FC = () => {
  const { user } = useAuth();
  const adminId = user ? (user.userId ?? user._id ?? user.email ?? null) : null;

  const {
    showHourlySection,
    selectedDate,
    handleTableItemClick,
    handleBackFromHourly,
  } = useDailyView();

  const { count: liveTodayCount } = useAdminCount(adminId);
  const dailyRangeFrom = useMemo(() => getDateDaysAgo(7), []);
  const dailyRangeTo = useMemo(() => getTodayDateString(), []);
  const { dailyData, dailySummary, loading: dailyLoading, error: dailyError } = useDailyStats(
    dailyRangeFrom,
    dailyRangeTo
  );
  const { hourlyData, loading: hourlyLoading } = useDailyHourly(selectedDate);

  // Same count as admin count page (GET /api/v1/counts/today)
  const todayCount = liveTodayCount;

  // Percentage: live today count vs yesterday from daily stats (range includes yesterday)
  const todayComparisonText = useMemo(() => {
    if (todayCount == null) return null;
    const yesterdayStr = getYesterdayDateString();
    const yesterdayRow = dailyData.find((d) => d.date === yesterdayStr);
    if (yesterdayRow == null) return null;
    const yesterdayCount = yesterdayRow.count;
    if (yesterdayCount === 0) {
      return todayCount > 0 ? "+100% vs yesterday" : "0% vs yesterday";
    }
    const pct = ((todayCount - yesterdayCount) / yesterdayCount) * 100;
    if (!Number.isFinite(pct)) return null;
    const sign = pct >= 0 ? "+" : "";
    return `${sign}${pct.toFixed(0)}% vs yesterday`;
  }, [dailyData, todayCount]);

  const headerTitle = useMemo(() => {
    if (showHourlySection && selectedDate) {
      return formatDate(selectedDate);
    }
    return "Daily Count Overview";
  }, [showHourlySection, selectedDate]);

  const dailySummaryDetails = useMemo(
    () => summaryDetailsFromDaily(dailySummary),
    [dailySummary]
  );
  const hourlySummaryDetails = useMemo(
    () => summaryDetailsFromHourly(hourlyData),
    [hourlyData]
  );

  const dailyBarChartData = useMemo(() => {
    if (!dailyData.length) return { data: [] as number[] };
    return {
      data: dailyData.map((d) => d.count),
      label: "Count",
    };
  }, [dailyData]);

  const dailyBarChartLabels = useMemo(
    () => dailyData.map((d) => d.date),
    [dailyData]
  );

  const hourlyLineChartData = useMemo(() => {
    if (!hourlyData.length) return { data: [] as number[], label: "Hourly" };
    return {
      data: hourlyData.map((h) => h.count),
      label: "Count",
    };
  }, [hourlyData]);

  const hourlyLineChartLabels = useMemo(
    () => hourlyData.map((h) => h.hour),
    [hourlyData]
  );

  return (
    <div className="lg:pl-72 flex">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        {/* Mobile / tablet header */}
        <div className="mb-36 lg:mb-0 block lg:hidden">
          <DashboardHeader
            daily={true}
            title={"Daily Count"}
            dailyCount={todayCount}
            dailyCountComparisonText={todayComparisonText}
          />
        </div>

        {/* Desktop header */}
        <div className="mb-36 lg:mb-0 hidden lg:block">
          <DashboardHeader
            daily={true}
            title={headerTitle}
            dailyCount={todayCount}
            dailyCountComparisonText={todayComparisonText}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-4 justify-center mt-5 mx-4 mb-4">
          <div className="w-full">
            {/* Mobile single-line date when viewing hourly */}
            <p className="lg:hidden text-lg font-medium ">
              {showHourlySection && selectedDate && formatDate(selectedDate)}
            </p>

            <div className="lg:hidden my-4">
              <TodaysCount
                count={todayCount}
                comparisonText={todayComparisonText}
              />
            </div>

            {!showHourlySection ? (
              <DailySectionOne
                onTableItemClick={handleTableItemClick}
                dailyData={dailyData}
                loading={dailyLoading}
              />
            ) : (
              <HourlySectionOne
                onTableItemClick={handleBackFromHourly}
                data={hourlyData}
              />
            )}
          </div>

          <div className="flex flex-col gap-4 w-full">
            {dailyError ? (
              <p className="text-red-600 text-sm" role="alert">
                Could not load daily stats.
              </p>
            ) : null}
            <div id="summary-side" className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-6">
                <Summary
                  details={
                    showHourlySection
                      ? hourlySummaryDetails.length
                        ? hourlySummaryDetails
                        : [{ label: "—", value: "No hourly data" }]
                      : dailySummaryDetails.length
                        ? dailySummaryDetails
                        : [{ label: "—", value: dailyLoading ? "Loading…" : "No data" }]
                  }
                  subtitle="last 7 days"
                />

                <div className="w-full rounded-2xl p-12 border-2 border-grey shadow-lg hover:bg-grey">
                  {showHourlySection ? (
                    hourlyData.length > 0 ? (
                      <LineChart
                        chartData={hourlyLineChartData}
                        chartDataTwo={{
                          data: hourlyData.map(() => 0),
                          label: "",
                        }}
                        chartTitle="Hourly count"
                        chartLabels={hourlyLineChartLabels}
                      />
                    ) : (
                      <p className="text-grey-4 text-sm">
                        {hourlyLoading ? "Loading…" : "No hourly data for this date."}
                      </p>
                    )
                  ) : dailyData.length > 0 ? (
                    <BarChart
                      chartData={dailyBarChartData}
                      chartTitle="Daily trend"
                      chartLabels={dailyBarChartLabels}
                    />
                  ) : (
                    <p className="text-grey-4 text-sm">
                      {dailyLoading ? "Loading…" : "No daily data."}
                    </p>
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
