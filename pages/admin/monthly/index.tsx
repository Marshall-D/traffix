// src/pages/admin/monthly.tsx
import React, { useMemo, useState } from "react";
import dynamic from "next/dynamic";
import withAuth from "@/src/hocs/withAuth";
// lazy-load components that use browser APIs / non-SSR-friendly libs
const MonthlySectionOne = dynamic(
  () => import("@/src/components/monthly/MonthlySectionOne"),
  { ssr: false }
);

const MonthlyTrendChart = dynamic(
  () => import("@/src/components/monthly/MonthlyTrendChart"),
  { ssr: false }
);

import MonthlyPageView from "@/src/components/monthly/MonthlyPageView";
import MonthlyWeeksCard from "@/src/components/monthly/MonthlyWeeksCard";
import {
  monthlyData,
  monthlySummary as mockMonthlySummary,
  monthlyDataByYear,
} from "@/src/utils/data";
import useMonthlyView from "@/src/hooks/useMonthlyView";
import useMonthlyStats from "@/src/hooks/useMonthlyStats";
import useDailyStats from "@/src/hooks/useDailyStats";

/** Current year and the last 4 years (5 years total), oldest first. */
function getAvailableYears(): number[] {
  const current = new Date().getFullYear();
  return [current - 4, current - 3, current - 2, current - 1, current];
}

/** Last day of month as YYYY-MM-DD (e.g. "2026-02-28"). */
function getMonthEndDate(monthStart: string): string {
  const d = new Date(monthStart + "T00:00:00");
  d.setMonth(d.getMonth() + 1);
  d.setDate(0);
  return d.toISOString().slice(0, 10);
}

/** Aggregate daily data for a month into week rows (week 1 = days 1–7, week 2 = 8–14, etc.). */
function aggregateDailyIntoWeeks(
  dailyData: { date: string; count: number }[],
  monthStart: string
): { week: number; start: string; count: number }[] {
  const monthStartDate = new Date(monthStart + "T00:00:00");
  const byWeek = new Map<number, { count: number; start: string }>();

  for (const row of dailyData) {
    const d = new Date(row.date + "T00:00:00");
    const dayOfMonth = d.getDate();
    const weekNum = Math.ceil(dayOfMonth / 7);
    const existing = byWeek.get(weekNum);
    if (existing) {
      existing.count += row.count;
    } else {
      const weekStart = new Date(monthStartDate);
      weekStart.setDate((weekNum - 1) * 7 + 1);
      byWeek.set(weekNum, {
        count: row.count,
        start: weekStart.toISOString().slice(0, 10),
      });
    }
  }

  const sorted = Array.from(byWeek.entries()).sort((a, b) => a[0] - b[0]);
  return sorted.map(([week, { start, count }]) => ({ week, start, count }));
}

const MonthlyPage: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState<number>(() => new Date().getFullYear());
  const availableYears = React.useMemo(() => getAvailableYears(), []);
  const { months: apiMonths, monthlySummary: apiSummary, loading: monthlyLoading, error: monthlyError } = useMonthlyStats(selectedYear);

  // Use API months when available and not loading; otherwise fallback to mock by year
  const selectedYearMonthlyData = useMemo(() => {
    if (apiMonths.length > 0) return apiMonths;
    if (selectedYear === 2024) return monthlyData;
    return monthlyDataByYear[selectedYear] ?? [];
  }, [selectedYear, apiMonths]);

  // wire useMonthlyView with the selected year's data so title/totalCount are based on the year
  const {
    selectedMonthStart,
    selectedMonthNumber,
    selectedWeekStart,
    showWeekView,
    title,
    totalCount,
    handleTableClick,
    handleBackToMonths,
  } = useMonthlyView(selectedYearMonthlyData, selectedYear);

  const monthEnd = useMemo(
    () => (selectedMonthStart ? getMonthEndDate(selectedMonthStart) : null),
    [selectedMonthStart]
  );
  const { dailyData: monthDailyData } = useDailyStats(
    showWeekView && selectedMonthStart ? selectedMonthStart : undefined,
    showWeekView && monthEnd ? monthEnd : undefined
  );
  const weeksFromApi = useMemo(() => {
    if (!showWeekView || !selectedMonthStart || !monthDailyData.length)
      return undefined;
    return aggregateDailyIntoWeeks(monthDailyData, selectedMonthStart);
  }, [showWeekView, selectedMonthStart, monthDailyData]);

  // build a summary for the year from API monthlySummary or from selected data
  const computedMonthlySummary = useMemo(() => {
    if (apiSummary) {
      return [
        { label: `Total count (${selectedYear})`, value: String(apiSummary.total ?? "—") },
        { label: "Average monthly count", value: String(apiSummary.average ?? "—") },
        { label: "Highest monthly count", value: String(apiSummary.highest ?? "—") },
        { label: "Lowest monthly count", value: String(apiSummary.lowest ?? "—") },
        { label: "Highest hourly count", value: "—" },
        { label: "Lowest hourly count", value: "—" },
      ];
    }
    const items = selectedYearMonthlyData || [];
    if (!items.length) {
      return mockMonthlySummary;
    }

    const total = items.reduce((s, it) => s + Number(it.count || 0), 0);
    const avg = Math.round(total / items.length);
    const counts = items.map((m) => Number(m.count || 0));
    const highest = Math.max(...counts);
    const lowest = Math.min(...counts);

    return [
      { label: `Total count (${selectedYear})`, value: total.toLocaleString() },
      { label: "Average monthly count", value: avg.toLocaleString() },
      { label: "Highest monthly count", value: highest.toLocaleString() },
      { label: "Lowest monthly count", value: lowest.toLocaleString() },
      { label: "Highest hourly count", value: "—" },
      { label: "Lowest hourly count", value: "—" },
    ];
  }, [selectedYearMonthlyData, selectedYear, apiSummary]);

  // --- compute the four top stats: "current" = calendar current month, "previous" = calendar previous month ---
  const {
    currentMonthCount,
    previousMonthCount,
    momPercent, // number or null
    averageMonthlyCount,
  } = useMemo(() => {
    const items = selectedYearMonthlyData || [];
    if (!items.length) {
      return {
        currentMonthCount: null as number | null,
        previousMonthCount: null as number | null,
        momPercent: null as number | null,
        averageMonthlyCount: null as number | null,
      };
    }

    const currentCalendarMonth = new Date().getMonth() + 1; // 1..12
    const previousCalendarMonth = currentCalendarMonth === 1 ? 12 : currentCalendarMonth - 1;

    const current = Number(items.find((m) => m.month === currentCalendarMonth)?.count ?? 0);
    const prevEntry = items.find((m) => m.month === previousCalendarMonth);
    const previous = prevEntry != null ? Number(prevEntry.count ?? 0) : null;

    let mom: number | null = null;
    if (previous != null) {
      if (previous !== 0) {
        mom = ((current - previous) / previous) * 100;
      } else {
        mom = current > 0 ? 100 : 0;
      }
    }

    const total = items.reduce((s, it) => s + Number(it.count ?? 0), 0);
    const avg = Math.round(total / items.length);

    return {
      currentMonthCount: current,
      previousMonthCount: previous,
      momPercent: mom !== null && Number.isFinite(mom) ? mom : null,
      averageMonthlyCount: avg,
    };
  }, [selectedYearMonthlyData]);

  // prepare the child components to pass into the presentational view
  const section = (
    <MonthlySectionOne
      onTableItemClick={handleTableClick}
      monthsData={selectedYearMonthlyData}
    />
  );

  const weeks =
    selectedMonthStart && selectedMonthNumber != null ? (
      <MonthlyWeeksCard
        monthStart={selectedMonthStart}
        monthNumber={selectedMonthNumber}
        onBack={handleBackToMonths}
        highlightedWeekStart={selectedWeekStart}
        weeksOverride={weeksFromApi}
      />
    ) : null;

  const chart = <MonthlyTrendChart data={selectedYearMonthlyData} />;

  return (
    <>
      {monthlyError ? (
        <p className="text-red-600 text-sm mx-3 mt-2" role="alert">
          Could not load monthly stats.
        </p>
      ) : null}
      <MonthlyPageView
      title={title}
      selectedYear={selectedYear}
      setSelectedYear={setSelectedYear}
      availableYears={availableYears}
      selectedMonthStart={selectedMonthStart}
      selectedMonthNumber={selectedMonthNumber}
      selectedWeekStart={selectedWeekStart}
      showWeekView={showWeekView}
      totalCount={totalCount}
      handleTableClick={handleTableClick}
      handleBackToMonths={handleBackToMonths}
      currentMonthCount={currentMonthCount}
      previousMonthCount={previousMonthCount}
      momPercent={momPercent}
      averageMonthlyCount={averageMonthlyCount}
      computedMonthlySummary={computedMonthlySummary}
      section={section}
      weeks={weeks}
      chart={chart}
    />
    </>
  );
};

// protect page client-side
export default withAuth(MonthlyPage);
