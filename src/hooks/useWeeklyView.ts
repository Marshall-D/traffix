// src/hooks/useWeeklyView.ts
import { useCallback, useMemo, useState } from "react";
import { WeeklyData, monthySummary } from "@/src/utils/data";
import type { WeekItem, WeeklySummary } from "@/services/statsService";

type WeeklyViewOptions = {
  /** From API GET /api/v1/stats/weekly */
  weeklyData?: WeekItem[] | null;
  weeklySummary?: WeeklySummary | null;
};

export default function useWeeklyView(options?: WeeklyViewOptions) {
  const { weeklyData: apiWeeks = null, weeklySummary: apiSummary = null } = options ?? {};
  const [showDailySection, setShowDailySection] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const weeklyData = apiWeeks != null ? apiWeeks : (WeeklyData as unknown as WeekItem[]);

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

  // Summary for sidebar: caller passes when in daily section (from useDailyStats); otherwise build from API weeklySummary or mock
  const defaultSummaryForSidebar = useMemo(() => {
    if (apiSummary) {
      return [
        { label: "Total Count for last 4 weeks", value: String(apiSummary.totalCount ?? "—") },
        { label: "Average Weekly Count", value: String(apiSummary.averageWeeklyCount ?? "—") },
        { label: "Highest Weekly Count", value: "—" },
        { label: "Lowest Weekly Count", value: "—" },
        { label: "Highest Daily Count", value: "—" },
        { label: "Lowest Daily Count", value: "—" },
      ];
    }
    return monthySummary;
  }, [apiSummary]);

  const currentWeekCount = apiSummary?.currentWeekCount ?? null;
  const previousWeekCount = apiSummary?.previousWeekCount ?? null;
  const wowPercent = apiSummary?.wowPercent ?? null;
  const averageWeeklyCount = apiSummary?.averageWeeklyCount ?? null;

  return {
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
  } as const;
}
