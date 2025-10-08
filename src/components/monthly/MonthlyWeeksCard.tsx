// src/components/monthly/MonthlyWeeksCard.tsx
import React, { FC, useMemo, useState, useEffect } from "react";
import { Button } from "../button";
import { WeeklyData as AllWeeklyData } from "@/src/utils/data"; // re-use weekly dataset
import { formatDate } from "@/src/utils/helpers";

/**
 * Props:
 * - monthStart: "YYYY-MM-DD" (start of month)
 * - monthNumber: 1..12
 * - onBack: () => void
 * - highlightedWeekStart?: string | null  <-- NEW: the week start date to highlight (YYYY-MM-DD)
 *
 * Behavior:
 * - shows week rows for the month (from WeeklyData if available; otherwise splits monthly total into 4)
 * - single click selects a row, second click currently clears selection (no navigation)
 */
interface Props {
  monthStart: string;
  monthNumber: number;
  onBack: () => void;
  highlightedWeekStart?: string | null;
}

interface WeekRow {
  week: number;
  start: string;
  count: number;
  weekday?: string;
}

const MonthlyWeeksCard: FC<Props> = ({
  monthStart,
  monthNumber,
  onBack,
  highlightedWeekStart = null,
}) => {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [isClickedOnce, setIsClickedOnce] = useState<number | null>(null);

  // derive weeks: try to find weeks in AllWeeklyData that belong to the month
  const weeks: WeekRow[] = useMemo(() => {
    const matched = AllWeeklyData.filter((w) => {
      const d = new Date(w.date);
      return d.getMonth() + 1 === monthNumber;
    }).map((w) => ({
      week: w.week,
      start: w.date,
      count: w.count,
    }));

    if (matched.length > 0) return matched;

    // fallback: no weekly entries in dataset for this month -> create 4 placeholder weeks
    const monthStartDate = new Date(monthStart + "T00:00:00");
    const placeholders: WeekRow[] = [];
    let totalForMonth = 0;
    const perWeek = Math.round((totalForMonth || 0) / 4);
    for (let i = 0; i < 4; i++) {
      const s = new Date(monthStartDate);
      s.setDate(monthStartDate.getDate() + i * 7);
      const iso = s.toISOString().slice(0, 10);
      placeholders.push({ week: i + 1, start: iso, count: perWeek });
    }
    return placeholders;
  }, [monthNumber, monthStart]);

  // When parent provides a highlightedWeekStart, auto-select that row
  useEffect(() => {
    if (!highlightedWeekStart) {
      setSelectedRow(null);
      setIsClickedOnce(null);
      return;
    }
    const idx = weeks.findIndex((w) => w.start === highlightedWeekStart);
    if (idx >= 0) {
      setSelectedRow(idx);
      setIsClickedOnce(idx);
    } else {
      setSelectedRow(null);
      setIsClickedOnce(null);
    }
  }, [highlightedWeekStart, weeks]);

  const handleRowClick = (index: number, row: WeekRow) => {
    if (isClickedOnce === index) {
      // second click - currently we clear selection (no navigation).
      // If you want a callback to open daily view, add an `onWeekDoubleClick` prop and call it here.
      setIsClickedOnce(null);
      setSelectedRow(null);
    } else {
      setSelectedRow(index);
      setIsClickedOnce(index);
    }
  };

  return (
    <div className="flex lg:h-full flex-col w-full rounded-2xl p-8 border-2 border-grey shadow-lg hover:bg-grey">
      <div
        id="header"
        className="flex justify-between gap-3 text-grey-2 items-center"
      >
        <div>
          <p className="text-black text-xl font-semibold">Weekly Count</p>
          <p className="text-sm text-grey-4">{formatDate(monthStart)}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={onBack}
            size="sm"
            variant="primary"
            className="text-xs"
          >
            Back to monthly view
          </Button>
        </div>
      </div>

      <hr className="mt-4" />

      <div id="table">
        <div
          id="table-header"
          className="flex justify-between gap-3 text-grey-4 my-2 text-xs font-semibold"
        >
          <p>Week</p>
          <p>Start Date</p>
          <p>Count</p>
        </div>
        <hr />

        <div id="table-body" className="mt-4">
          {weeks.map((row, index) => (
            <div
              key={`${row.start}-${index}`}
              className={`flex justify-between text-black-2 text-sm my-6 cursor-pointer py-3 px-4 rounded-md
                ${selectedRow === index ? "bg-primary text-white" : ""}
                hover:bg-grey-3`}
              onClick={() => handleRowClick(index, row)}
            >
              <p className="">{row.week}</p>
              <p className="">{formatDate(row.start)}</p>
              <p className="font-semibold">{row.count}</p>
            </div>
          ))}

          {weeks.length === 0 && (
            <p className="text-grey-4 mt-4">
              No week data available for this month.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonthlyWeeksCard;
