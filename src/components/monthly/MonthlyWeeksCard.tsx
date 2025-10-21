// src/components/monthly/MonthlyWeeksCard.tsx
import React, { FC, useCallback } from "react";
import { Button } from "../button";
import { formatDate } from "@/src/utils/helpers";
import useMonthlyWeeks, { WeekRow } from "@/src/hooks/useMonthlyWeeks";

interface Props {
  monthStart: string; // "YYYY-MM-DD"
  monthNumber: number; // 1..12
  onBack: () => void;
  highlightedWeekStart?: string | null;
}

const MonthlyWeeksCard: FC<Props> = ({
  monthStart,
  monthNumber,
  onBack,
  highlightedWeekStart = null,
}) => {
  const { weeks, selectedRow, toggleRow } = useMonthlyWeeks({
    monthStart,
    monthNumber,
    highlightedWeekStart,
  });

  const onRowKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleRow(index);
      }
    },
    [toggleRow]
  );

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

      <div id="table" className="mt-4">
        <div
          id="table-header"
          className="flex justify-between gap-3 text-grey-4 my-2 text-xs font-semibold"
        >
          {/* widths chosen to match row layout below */}
          <p className="w-1/6">Week</p>
          <p className="w-1/3">Start Date</p>
          <p className="w-1/4 text-right">Count</p>
          <p className="w-1/6 text-right">% Change</p>
        </div>
        <hr />

        <div id="table-body" className="mt-4">
          {weeks.map((row: WeekRow, index) => {
            const isSelected = selectedRow === index;
            const pct = row.percentChange;
            const pctDisplay =
              pct === null || pct === undefined
                ? "—"
                : `${Math.abs(Number(pct.toFixed(2))).toLocaleString()}%`;

            const pctColorClass =
              pct === null
                ? "text-grey-400"
                : pct > 0
                ? "text-green-500"
                : pct < 0
                ? "text-red-500"
                : "text-black";

            return (
              <div
                key={`${row.start}-${index}`}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                aria-selected={isSelected}
                onKeyDown={(e) => onRowKeyDown(e, index)}
                onClick={() => toggleRow(index)}
                className={`flex justify-between items-center text-black-2 text-sm my-6 cursor-pointer py-3 px-4 rounded-md
                  ${isSelected ? "bg-primary text-white" : ""}
                  hover:bg-grey-3`}
              >
                {/* Use the same widths as headers so everything lines up vertically */}
                <p className="w-1/6">{row.week}</p>

                <p className="w-1/3">{formatDate(row.start)}</p>

                <p className="w-1/4 text-right font-semibold">
                  {row.count.toLocaleString()}
                </p>

                <p
                  className={`w-1/6 text-right ${
                    pct === null ? "text-grey-400" : pctColorClass
                  }`}
                >
                  {pct === null ? "—" : pct > 0 ? "+" : pct < 0 ? "-" : ""}
                  {pct === null ? "" : pctDisplay}
                </p>
              </div>
            );
          })}

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
