// src/hooks/useMonthlyWeeks.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  WeeklyData as AllWeeklyData,
  monthlyData,
  monthlyDataByYear,
} from "@/src/utils/data";

export interface WeekRow {
  week: number;
  start: string;
  count: number;
  weekday?: string;
}

type UseMonthlyWeeksArgs = {
  monthStart: string; // "YYYY-MM-DD"
  monthNumber: number; // 1..12
  highlightedWeekStart?: string | null;
};

export default function useMonthlyWeeks({
  monthStart,
  monthNumber,
  highlightedWeekStart = null,
}: UseMonthlyWeeksArgs) {
  // derive target year from monthStart (ensure we respect the selected year's month)
  const targetYear = useMemo(() => {
    if (!monthStart) return null;
    // monthStart expected like "2021-03-01" — parse the year portion safely
    const parsed = new Date(monthStart + "T00:00:00");
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed.getFullYear();
  }, [monthStart]);

  // derive weeks for the requested month & year from the weekly dataset
  const weeks = useMemo<WeekRow[]>(() => {
    if (!targetYear) return [];

    // 1) Try to find matching weekly records that match both month and year.
    const matched = AllWeeklyData.filter((w) => {
      const d = new Date(w.date + "T00:00:00");
      return d.getFullYear() === targetYear && d.getMonth() + 1 === monthNumber;
    }).map((w) => ({
      week: w.week,
      start: w.date,
      count: w.count,
    }));

    if (matched.length > 0) return matched;

    // 2) No weekly records for that month/year — synthesize using month's total.
    // Prefer per-year monthly data (monthlyDataByYear), fallback to legacy monthlyData (2024)
    const yearData = monthlyDataByYear[targetYear];
    const monthEntry =
      (yearData &&
        yearData.find((m) => Number(m.month) === Number(monthNumber))) ??
      monthlyData.find((m) => Number(m.month) === Number(monthNumber));

    const totalForMonth = monthEntry ? Number(monthEntry.count ?? 0) : 0;
    const perWeek = Math.round(totalForMonth / 4) || 0;

    // Build 4 placeholder weeks using the provided monthStart (preserves year/month)
    const monthStartDate = new Date(monthStart + "T00:00:00");
    // If monthStart was invalid, fallback to first day of target year/month
    if (Number.isNaN(monthStartDate.getTime())) {
      const fallback = new Date(targetYear, monthNumber - 1, 1);
      // eslint-disable-next-line no-param-reassign
      monthStart = fallback.toISOString().slice(0, 10);
    }

    const placeholders: WeekRow[] = [];
    for (let i = 0; i < 4; i++) {
      const s = new Date(monthStart + "T00:00:00");
      s.setDate(s.getDate() + i * 7);
      // Ensure we keep the local date (ISO yyyy-mm-dd)
      const iso = s.toISOString().slice(0, 10);
      placeholders.push({ week: i + 1, start: iso, count: perWeek });
    }
    return placeholders;
  }, [monthNumber, monthStart, targetYear]);

  // index of selected row (in the `weeks` array), or null if none
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  // Auto-select the highlightedWeekStart (if provided). If it's not found, clear selection.
  useEffect(() => {
    if (!highlightedWeekStart) {
      setSelectedRow(null);
      return;
    }
    const idx = weeks.findIndex((w) => w.start === highlightedWeekStart);
    setSelectedRow(idx >= 0 ? idx : null);
  }, [highlightedWeekStart, weeks]);

  // Toggle selection for a row
  const toggleRow = useCallback((index: number) => {
    setSelectedRow((prev) => (prev === index ? null : index));
  }, []);

  const clearSelection = useCallback(() => setSelectedRow(null), []);

  // convenience: selected week data
  const selectedWeek = useMemo(() => {
    if (selectedRow == null) return null;
    return weeks[selectedRow] ?? null;
  }, [selectedRow, weeks]);

  return {
    weeks,
    selectedRow,
    selectedWeek,
    toggleRow,
    clearSelection,
  } as const;
}
