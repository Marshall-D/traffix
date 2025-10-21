// src/hooks/useWeeklyView.ts
import { useCallback, useMemo, useState } from "react";
import {
  WeeklyData,
  weeklySummary,
  dailyData,
  monthySummary,
} from "@/src/utils/data";

export default function useWeeklyView() {
  const [showDailySection, setShowDailySection] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // busiestDay computed from dailyData (memoized)
  const busiestDay = useMemo(() => {
    if (!dailyData || dailyData.length === 0) return null;
    const maxDay = dailyData.reduce((prev, curr) =>
      curr.count > prev.count ? curr : prev
    );
    return maxDay?.day ?? null;
  }, []);

  const handleTableItemClick = useCallback(
    (date: string | null, week: number | null) => {
      setSelectedDate(date);
      setSelectedWeek(week);
      setShowDailySection(Boolean(date && week));
    },
    []
  );

  const closeDailySection = useCallback(() => {
    setShowDailySection(false);
    setSelectedDate(null);
    setSelectedWeek(null);
  }, []);

  // formatted title for header when a week is selected
  const formattedTitle = useMemo(() => {
    if (selectedWeek && selectedDate) {
      try {
        const formattedDate = new Intl.DateTimeFormat("en-GB").format(
          new Date(selectedDate)
        );
        return `Week ${selectedWeek}, ${formattedDate}`;
      } catch {
        return `Week ${selectedWeek}`;
      }
    }

    if (selectedDate === null && !selectedWeek) {
      return "No data available for this date";
    }

    return "Weekly Count Overview";
  }, [selectedWeek, selectedDate]);

  // summary swap: show weeklySummary when viewing daily section, otherwise monthySummary
  const summaryForSidebar = useMemo(
    () => (showDailySection ? weeklySummary : monthySummary),
    [showDailySection]
  );

  /**
   * Top stats for the weekly view
   * - currentWeekCount: last available week's count (based on date)
   * - previousWeekCount: previous week's count (if any)
   * - wowPercent: week-over-week percentage (null if no previous or previous === 0)
   * - averageWeeklyCount: rounded average of available weeks
   */
  const {
    currentWeekCount,
    previousWeekCount,
    wowPercent,
    averageWeeklyCount,
  } = useMemo(() => {
    const arr = Array.isArray(WeeklyData) ? [...WeeklyData] : [];
    if (arr.length === 0) {
      return {
        currentWeekCount: null as number | null,
        previousWeekCount: null as number | null,
        wowPercent: null as number | null,
        averageWeeklyCount: null as number | null,
      };
    }

    // sort by date ascending to find last two weeks reliably
    arr.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const lastIndex = arr.length - 1;
    const current = Number(arr[lastIndex]?.count ?? 0);
    const previous =
      lastIndex > 0 ? Number(arr[lastIndex - 1]?.count ?? 0) : null;

    const percent =
      previous && previous !== 0
        ? ((current - previous) / previous) * 100
        : null;

    const total = arr.reduce((s, it) => s + Number(it.count ?? 0), 0);
    const avg = Math.round(total / arr.length);

    return {
      currentWeekCount: current,
      previousWeekCount: previous,
      wowPercent:
        percent !== null && Number.isFinite(percent) ? Number(percent) : null,
      averageWeeklyCount: avg,
    };
  }, []);

  // provide raw data to child components + computed stats
  return {
    showDailySection,
    selectedWeek,
    selectedDate,
    busiestDay,
    handleTableItemClick,
    closeDailySection,
    formattedTitle,
    summaryForSidebar,
    weeklyData: WeeklyData,
    dailyData,

    // newly exported stats:
    currentWeekCount,
    previousWeekCount,
    wowPercent,
    averageWeeklyCount,
  } as const;
}
