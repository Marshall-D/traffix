// src/pages/admin/weekly.tsx
import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import withAuth from "@/src/hocs/withAuth";
import DashboardHeader from "@/src/components/dashboardHeader";
import { DashboardSidebar } from "@/src/components/dashboardSidebar";
import WeeklyCountCard from "@/src/components/weeklyCountCard";
import DailySectionWeeklyCountCard from "@/src/components/dailySectionWeeklyCountCard";
import SummaryWeekly from "@/src/components/summary";
import BusiestDay from "@/src/components/busiestDay";
import useWeeklyView from "@/src/hooks/useWeeklyView";
import useWeeklyStats from "@/src/hooks/useWeeklyStats";
import useDailyStats from "@/src/hooks/useDailyStats";
import CountStatsCard from "@/src/components/countStatsCard";
import { getFullYearWeeks, getMondayOfWeek, formatWeekday, toLocalDateString } from "@/src/utils/helpers";

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + days);
  return toLocalDateString(d);
}

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

// dynamic import of chart to avoid Chart.js SSR/hydration issues
const WeeklyTrendChart = dynamic(() => import("@/src/components/chart"), {
  ssr: false,
});

const Weekly: React.FC = () => {
  const [selectedYear] = useState(() => new Date().getFullYear());
  const { weeks, weeklySummary, loading: weeklyLoading, error: weeklyError } = useWeeklyStats(selectedYear);
  const fullYearWeeks = useMemo(
    () => getFullYearWeeks(selectedYear, weeks),
    [selectedYear, weeks]
  );
  const {
    showDailySection,
    selectedWeek,
    selectedDate,
    handleTableItemClick,
    closeDailySection,
    formattedTitle,
    defaultSummaryForSidebar,
    weeklyData,
    currentWeekCount,
    previousWeekCount,
    wowPercent,
    averageWeeklyCount,
  } = useWeeklyView({ weeklyData: fullYearWeeks, weeklySummary });

  const weekStart = useMemo(() => {
    if (!selectedDate) return null;
    return getMondayOfWeek(selectedDate);
  }, [selectedDate]);

  const weekEnd = useMemo(() => {
    if (!weekStart) return null;
    return addDays(weekStart, 6);
  }, [weekStart]);

  const { dailyData, dailySummary } = useDailyStats(
    showDailySection && weekStart && weekEnd ? weekStart : undefined,
    showDailySection && weekStart && weekEnd ? weekEnd : undefined
  );

  const byDate = useMemo(() => {
    const map = new Map<string, { count: number; day?: string }>();
    dailyData.forEach((d) => map.set(d.date, { count: d.count, day: d.day }));
    return map;
  }, [dailyData]);

  const sortedDailyData = useMemo(() => {
    if (!weekStart || !weekEnd) return [];
    const out: { date: string; count: number; day: string }[] = [];
    for (let i = 0; i < 7; i++) {
      const dateStr = addDays(weekStart, i);
      const entry = byDate.get(dateStr);
      const count = entry?.count ?? 0;
      out.push({
        date: dateStr,
        count,
        day: entry?.day ?? formatWeekday(dateStr),
      });
    }
    return out;
  }, [weekStart, weekEnd, byDate]);

  const { busiestDay, busiestDayComparisonText } = useMemo(() => {
    if (!sortedDailyData.length) return { busiestDay: null as string | null, busiestDayComparisonText: null as string | null };
    const maxCount = Math.max(...sortedDailyData.map((d) => d.count));
    const withMax = sortedDailyData.filter((d) => d.count === maxCount);
    if (withMax.length !== 1) return { busiestDay: null, busiestDayComparisonText: null };
    const total = sortedDailyData.reduce((s, d) => s + d.count, 0);
    const avg = total / sortedDailyData.length;
    let comparisonText: string | null = null;
    if (avg > 0 && Number.isFinite(avg)) {
      const pct = ((maxCount - avg) / avg) * 100;
      const sign = pct >= 0 ? "+" : "";
      comparisonText = `${sign}${pct.toFixed(0)}% above weekly average`;
    }
    return {
      busiestDay: withMax[0].day,
      busiestDayComparisonText: comparisonText,
    };
  }, [sortedDailyData]);

  const summaryForSidebar = useMemo(
    () =>
      showDailySection && dailySummary
        ? summaryDetailsFromDaily(dailySummary)
        : defaultSummaryForSidebar,
    [showDailySection, dailySummary, defaultSummaryForSidebar]
  );

  const displayWowPercent = useMemo(() => {
    if (wowPercent != null && Number.isFinite(wowPercent)) return wowPercent;
    if (previousWeekCount === 0) return currentWeekCount != null && currentWeekCount > 0 ? 100 : 0;
    return null;
  }, [wowPercent, previousWeekCount, currentWeekCount]);

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
            busiestDayComparisonText={busiestDayComparisonText}
          />
        </div>

        {/* Desktop header */}
        <div className="mb-36 lg:mb-0 hidden lg:block">
          <DashboardHeader
            title={showDailySection ? formattedTitle : "Weekly Count Overview"}
            showDailySection={showDailySection}
            busiestDay={busiestDay}
            busiestDayComparisonText={busiestDayComparisonText}
          />
        </div>

        {weeklyError ? (
          <p className="text-red-600 text-sm mx-3" role="alert">
            Could not load weekly stats.
          </p>
        ) : null}
        {/* TOP STATS: same layout as monthly page (4 CountStatsCard) */}
        <div className="m-3">
          <div className="flex flex-col md:flex-row gap-4 w-full">
            <CountStatsCard
              title="Current Week Count"
              value={currentWeekCount ?? "—"}
            />
            <CountStatsCard
              title="Previous Week Count"
              value={previousWeekCount ?? "—"}
            />
            <CountStatsCard
              title="Week-over-Week Change (%)"
              value={displayWowPercent ?? "—"}
              isPercentage={true}
            />
            <CountStatsCard
              title="Average Weekly Count (YTD)"
              value={averageWeeklyCount ?? "—"}
            />
          </div>
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

                {busiestDay != null ? (
                  <div className="lg:hidden my-4">
                    <div className="my-8">
                      <BusiestDay day={busiestDay} comparisonText={busiestDayComparisonText} />
                    </div>
                  </div>
                ) : null}
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
                dailyData={sortedDailyData}
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
                <WeeklyTrendChart weeklyData={weeks} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withAuth(Weekly);
