// src/hooks/useMonthlyView.ts
import { useCallback, useMemo, useState } from "react";
import { formatDate } from "@/src/utils/helpers";
import { monthlyData as defaultMonthlyData } from "@/src/utils/data";

type MonthRow = { month: number; start: string; count: number };

type UseMonthlyViewReturn = {
  selectedMonthStart: string | null;
  selectedMonthNumber: number | null;
  selectedWeekStart: string | null;
  showWeekView: boolean;
  title: string;
  totalCount: number;
  handleTableClick: (
    startOfMonthDate: string,
    monthNumber: number,
    highlightedWeekStart?: string | null
  ) => void;
  handleBackToMonths: () => void;
};

/**
 * monthsData?: optional dataset to base calculations on (year-specific).
 * year?: optional year number used for default title when no month is selected.
 */
export default function useMonthlyView(
  monthsData?: MonthRow[],
  year?: number
): UseMonthlyViewReturn {
  const [selectedMonthStart, setSelectedMonthStart] = useState<string | null>(
    null
  );
  const [showWeekView, setShowWeekView] = useState(false);
  const [selectedMonthNumber, setSelectedMonthNumber] = useState<number | null>(
    null
  );
  const [selectedWeekStart, setSelectedWeekStart] = useState<string | null>(
    null
  );

  // Resolve the dataset we'll base totals on (fallback to built-in 2024 monthlyData)
  const data = useMemo<MonthRow[]>(
    () => (monthsData && monthsData.length ? monthsData : defaultMonthlyData),
    [monthsData]
  );

  const title = useMemo(
    () =>
      selectedMonthStart
        ? `${formatDate(selectedMonthStart)}`
        : year
        ? `${year} Monthly Count Overview`
        : "Monthly Count Overview",
    [selectedMonthStart, year]
  );

  const totalCount = useMemo(
    () => data.reduce((s, m) => s + (Number(m.count ?? 0) || 0), 0),
    [data]
  );

  const handleTableClick = useCallback(
    (
      startOfMonthDate: string,
      monthNumber: number,
      highlightedWeekStart?: string | null
    ) => {
      setSelectedMonthStart(startOfMonthDate);
      setSelectedMonthNumber(monthNumber);
      setSelectedWeekStart(highlightedWeekStart ?? null);
      setShowWeekView(true);
    },
    []
  );

  const handleBackToMonths = useCallback(() => {
    setShowWeekView(false);
    setSelectedMonthNumber(null);
    setSelectedMonthStart(null);
    setSelectedWeekStart(null);
  }, []);

  return {
    selectedMonthStart,
    selectedMonthNumber,
    selectedWeekStart,
    showWeekView,
    title,
    totalCount,
    handleTableClick,
    handleBackToMonths,
  };
}
