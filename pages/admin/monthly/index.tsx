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
  monthlySummary,
  monthlyDataByYear,
  AVAILABLE_YEARS,
} from "@/src/utils/data";
import useMonthlyView from "@/src/hooks/useMonthlyView";

const MonthlyPage: React.FC = () => {
  // NOTE: we'll pass the year-specific dataset to the hook so title/totalCount are correct
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  // determine the months dataset for the selected year
  const selectedYearMonthlyData = useMemo(() => {
    if (selectedYear === 2024) return monthlyData;
    return monthlyDataByYear[selectedYear] ?? [];
  }, [selectedYear]);

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

  // build a summary for the year from the selected data (fallbacks preserved)
  const computedMonthlySummary = useMemo(() => {
    const items = selectedYearMonthlyData || [];
    if (!items.length) {
      return monthlySummary;
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
      { label: "Highest hourly count", value: "55" },
      { label: "Lowest hourly count", value: "8" },
    ];
  }, [selectedYearMonthlyData, selectedYear]);

  // --- compute the four top stats based on the selected year's data ---
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

    // Use the last available month in the dataset as "current"
    const lastIndex = items.length - 1;
    const current = Number(items[lastIndex]?.count ?? 0);
    const previous =
      lastIndex > 0 ? Number(items[lastIndex - 1]?.count ?? 0) : null;

    const mom =
      previous && previous !== 0
        ? ((current - previous) / previous) * 100
        : null;

    const total = items.reduce((s, it) => s + Number(it.count ?? 0), 0);
    const avg = Math.round(total / items.length);

    return {
      currentMonthCount: current,
      previousMonthCount: previous,
      momPercent: mom !== null && Number.isFinite(mom) ? Number(mom) : null,
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
      />
    ) : null;

  const chart = <MonthlyTrendChart data={selectedYearMonthlyData} />;

  return (
    <MonthlyPageView
      title={title}
      selectedYear={selectedYear}
      setSelectedYear={setSelectedYear}
      availableYears={AVAILABLE_YEARS}
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
  );
};

// protect page client-side
export default withAuth(MonthlyPage);
