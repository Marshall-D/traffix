// src/hooks/useMonthlySection.ts
import { useCallback, useMemo, useState } from "react";
import { monthlyData, WeeklyData as AllWeeklyData } from "@/src/utils/data";

export type MonthItem = {
  month: number;
  start: string;
  count: number;
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
  /**
   * Attempts to resolve the currently selectedDate into a month/week and calls
   * the provided `onFound` callback with (monthStart, monthNumber, highlightedWeekStart|null).
   *
   * Returns `true` if a month was found and `onFound` was called, `false` otherwise.
   */
  handleViewDateClick: (
    onFound: (
      startOfMonthDate: string,
      monthNumber: number,
      highlightedWeekStart?: string | null
    ) => void
  ) => boolean;
};

export default function useMonthlySection(): UseMonthlySectionReturn {
  const months = useMemo(() => {
    // Use the monthlyData provided by the utils file as the canonical list
    return monthlyData.map((m) => ({
      month: Number(m.month),
      start: String(m.start),
      count: Number(m.count ?? 0),
    }));
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

      // Normalize selected date to midnight (local) - keep behavior consistent with existing code.
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

      // call out to parent
      onFound(found.start, found.month, highlightedWeekStart);

      // close modal on success (parent may navigate)
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
