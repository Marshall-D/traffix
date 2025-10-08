// src/hooks/useDailyView.ts
import { useCallback, useState } from "react";

export default function useDailyView(initialDate: string | null = null) {
  const [showHourlySection, setShowHourlySection] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(initialDate);

  // preserve previous behavior: clicking a table item sets the date AND toggles the hourly view
  const handleTableItemClick = useCallback((date: string) => {
    setSelectedDate(date);
    setShowHourlySection((prev) => !prev);
  }, []);

  // used by the HourlySectionOne back action
  const handleBackFromHourly = useCallback(() => {
    setShowHourlySection(false);
  }, []);

  return {
    showHourlySection,
    selectedDate,
    handleTableItemClick,
    handleBackFromHourly,
    // exposing setter for tests or advanced scenarios — optional to use
    setSelectedDate,
  } as const;
}
