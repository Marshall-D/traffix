// src/hooks/useMonthlyView.ts
import { useCallback, useMemo, useState } from "react";
import { formatDate } from "@/src/utils/helpers";
import { monthlyData } from "@/src/utils/data";

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
export default function useMonthlyView(): UseMonthlyViewReturn {
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

  const title = useMemo(
    () =>
      selectedMonthStart
        ? `${formatDate(selectedMonthStart)}`
        : "Monthly Count Overview",
    [selectedMonthStart]
  );

  const totalCount = useMemo(
    () => monthlyData.reduce((s, m) => s + (m.count ?? 0), 0),
    []
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
