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

  // provide raw data to child components
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
  } as const;
}
