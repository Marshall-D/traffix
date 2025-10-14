// src/hooks/useMonthlyWeeks.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { WeeklyData as AllWeeklyData, monthlyData } from "@/src/utils/data";

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
  // derive weeks for the requested month from the weekly dataset
  const weeks = useMemo<WeekRow[]>(() => {
    const matched = AllWeeklyData.filter((w) => {
      const d = new Date(w.date);
      return d.getMonth() + 1 === monthNumber;
    }).map((w) => ({
      week: w.week,
      start: w.date,
      count: w.count,
    }));

    if (matched.length > 0) return matched;

    // fallback: synthesize 4 weeks using the monthly total (if available)
    const monthEntry = monthlyData.find(
      (m) => Number(m.month) === Number(monthNumber)
    );
    const totalForMonth = monthEntry ? Number(monthEntry.count ?? 0) : 0;
    const perWeek = Math.round((totalForMonth || 0) / 4);

    const monthStartDate = new Date(monthStart + "T00:00:00");
    const placeholders: WeekRow[] = [];
    for (let i = 0; i < 4; i++) {
      const s = new Date(monthStartDate);
      s.setDate(monthStartDate.getDate() + i * 7);
      const iso = s.toISOString().slice(0, 10);
      placeholders.push({ week: i + 1, start: iso, count: perWeek });
    }
    return placeholders;
  }, [monthNumber, monthStart]);

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
