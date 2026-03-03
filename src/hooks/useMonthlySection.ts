// src/hooks/useMonthlySection.ts
import { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { monthlyData, WeeklyData as AllWeeklyData } from "@/src/utils/data";

export type MonthItem = {
  month: number;
  start: string;
  count: number;
  percentChange: number | null;
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

/**
 * Optional parameter `initialMonths` allows callers (parent components)
 * to supply a year-specific months array. If omitted, fallback to the default
 * `monthlyData` export (which is your 2024 data).
 */
export default function useMonthlySection(
  initialMonths?: { month: number; start: string; count: number }[]
): UseMonthlySectionReturn {
  const months = useMemo<MonthItem[]>(() => {
    const base =
      (initialMonths && initialMonths.length ? initialMonths : monthlyData) ||
      [];
    const items: MonthItem[] = base.map((m) => ({
      month: Number(m.month),
      start: String(m.start),
      count: Number(m.count ?? 0),
      percentChange: null,
      trend: "neutral",
    }));

    for (let i = 0; i < items.length; i++) {
      const current = items[i];
      const prev = items[i - 1];

      if (!prev || prev.count === 0) {
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
  }, [initialMonths]);

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

      // Find monthly item whose range contains the selected date
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
        toast.error("No data available for this date.");
        return false;
      }

      // --- find a matching weekly row in AllWeeklyData but only for the same YEAR ---
      const targetYear = selectedDateObj.getFullYear();

      const matchedWeek = AllWeeklyData.find((w) => {
        const weekStart = new Date(w.date + "T00:00:00");
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        // require same year as the selected date to avoid cross-year matches
        if (weekStart.getFullYear() !== targetYear) return false;

        return selectedDateObj >= weekStart && selectedDateObj <= weekEnd;
      });

      let highlightedWeekStart: string | null = null;

      if (matchedWeek) {
        highlightedWeekStart = matchedWeek.date;
      } else {
        // If no weekly row exists for that year/month, synthesize a week-start
        // from the found month's start and the selected date so the UI can highlight
        // the correct week within the chosen year.
        try {
          const monthStart = new Date(found.start + "T00:00:00");
          monthStart.setHours(0, 0, 0, 0);

          // If selectedDate is not within the found month-range for safety, do not set highlight
          const nextMonth = new Date(monthStart);
          nextMonth.setMonth(nextMonth.getMonth() + 1);
          nextMonth.setHours(0, 0, 0, 0);
          if (selectedDateObj < monthStart || selectedDateObj >= nextMonth) {
            highlightedWeekStart = null;
          } else {
            const diffDays = Math.floor(
              (selectedDateObj.getTime() - monthStart.getTime()) /
                (24 * 60 * 60 * 1000)
            );
            const weekIndex = Math.floor(diffDays / 7); // 0-based
            const weekStartDate = new Date(monthStart);
            weekStartDate.setDate(monthStart.getDate() + weekIndex * 7);
            highlightedWeekStart = weekStartDate.toISOString().slice(0, 10);
          }
        } catch (ex) {
          // on any error, fall back to null (no highlight)
          // eslint-disable-next-line no-console
          console.warn("Failed to synthesize highlighted week start", ex);
          highlightedWeekStart = null;
        }
      }

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
