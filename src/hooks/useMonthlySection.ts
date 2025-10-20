// src/hooks/useMonthlySection.ts
import { useCallback, useMemo, useState } from "react";
import { monthlyData, WeeklyData as AllWeeklyData } from "@/src/utils/data";

export type MonthItem = {
  month: number;
  start: string;
  count: number;
  // new fields:
  percentChange: number | null; // percentage (e.g. 12.34 for +12.34%)
  trend: "up" | "down" | "neutral";
};

type UseMonthlySectionReturn = {
  months: MonthItem[];
  selectedRow: number | null;
  setSelectedRow: (i: number | null) => void;
  toggleRow: (index: number) => void;
  showModal: boolean;
  openModal: () => void;
  closeModal: () => void;
  selectedDate: Date | null;
  setSelectedDate: (d: Date | null) => void;
  error: string | null;
  handleViewDateClick: (
    onFound: (
      startOfMonthDate: string,
      monthNumber: number,
      highlightedWeekStart?: string | null
    ) => void
  ) => boolean;
};

export default function useMonthlySection(): UseMonthlySectionReturn {
  const months = useMemo<MonthItem[]>(() => {
    // Build canonical list and compute percentChange + trend based on previous month
    // Ensure we use the order of monthlyData as provided (assumed chronological).
    const items = monthlyData.map((m) => ({
      month: Number(m.month),
      start: String(m.start),
      count: Number(m.count ?? 0),
      percentChange: null as number | null,
      trend: "neutral" as "up" | "down" | "neutral",
    }));

    for (let i = 0; i < items.length; i++) {
      const current = items[i];
      const prev = items[i - 1];

      if (!prev || prev.count === 0) {
        // No valid previous to compare to (avoid divide by zero)
        current.percentChange = null;
        current.trend = "neutral";
      } else {
        const change = ((current.count - prev.count) / prev.count) * 100;
        current.percentChange = Number.isFinite(change) ? change : null;
        if (current.percentChange === null) {
          current.trend = "neutral";
        } else if (current.percentChange > 0) {
          current.trend = "up";
        } else if (current.percentChange < 0) {
          current.trend = "down";
        } else {
          current.trend = "neutral";
        }
      }
    }

    return items;
  }, []);

  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openModal = useCallback(() => {
    setError(null);
    setSelectedDate(null);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setError(null);
  }, []);

  const toggleRow = useCallback((index: number) => {
    setSelectedRow((prev) => (prev === index ? null : index));
  }, []);

  const handleViewDateClick = useCallback(
    (
      onFound: (
        startOfMonthDate: string,
        monthNumber: number,
        highlightedWeekStart?: string | null
      ) => void
    ) => {
      setError(null);

      if (!selectedDate) {
        setError("Please select a date.");
        return false;
      }

      // Normalize selected date to midnight (local)
      const selectedDateObj = new Date(selectedDate);
      selectedDateObj.setHours(0, 0, 0, 0);

      // Find monthlyData item whose range contains the selected date
      const found = months.find((m) => {
        const start = new Date(m.start + "T00:00:00");
        start.setHours(0, 0, 0, 0);
        const next = new Date(start);
        next.setMonth(next.getMonth() + 1);
        next.setHours(0, 0, 0, 0);
        return selectedDateObj >= start && selectedDateObj < next;
      });

      if (!found) {
        setError("No data available for this date.");
        return false;
      }

      // compute which week (if any) contains the selected date
      const matchedWeek = AllWeeklyData.find((w) => {
        const weekStart = new Date(w.date + "T00:00:00");
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        return selectedDateObj >= weekStart && selectedDateObj <= weekEnd;
      });

      const highlightedWeekStart = matchedWeek ? matchedWeek.date : null;

      onFound(found.start, found.month, highlightedWeekStart);

      setShowModal(false);
      return true;
    },
    [months, selectedDate]
  );

  return {
    months,
    selectedRow,
    setSelectedRow,
    toggleRow,
    showModal,
    openModal,
    closeModal,
    selectedDate,
    setSelectedDate,
    error,
    handleViewDateClick,
  };
}
