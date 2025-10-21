// src/components/monthly/MonthlySectionOne.tsx
import React, { FC, useCallback } from "react";
import { IconButton } from "../iconButton";
import { mdiCalendarMonth } from "@mdi/js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal } from "../modal";
import { Button } from "../button";
import { formatDate } from "@/src/utils/helpers";
import useMonthlySection, { MonthItem } from "@/src/hooks/useMonthlySection";

/**
 * Props:
 * - onTableItemClick(startOfMonthDate: string, monthNumber: number, highlightedWeekStart?: string|null)
 * - monthsData?: optional array of months to render (year-specific)
 */
interface Props {
  onTableItemClick: (
    startOfMonthDate: string,
    monthNumber: number,
    highlightedWeekStart?: string | null
  ) => void;
  monthsData?: { month: number; start: string; count: number }[]; // optional override
}

const UpArrow = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    aria-hidden
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fill="currentColor" d="M12 5l7 7h-4v7h-6v-7H5l7-7z" />
  </svg>
);

const DownArrow = (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    aria-hidden
    xmlns="http://www.w3.org/2000/svg"
  >
    <path fill="currentColor" d="M12 19l-7-7h4V5h6v7h4l-7 7z" />
  </svg>
);

const MonthlySectionOne: FC<Props> = ({ onTableItemClick, monthsData }) => {
  // pass the monthsData into the hook (if provided)
  const {
    months,
    selectedRow,
    toggleRow,
    showModal,
    openModal,
    closeModal,
    selectedDate,
    setSelectedDate,
    error,
    handleViewDateClick,
  } = useMonthlySection(monthsData);

  const handleHeaderClick = useCallback(() => {
    openModal();
  }, [openModal]);

  const handleRowClick = useCallback(
    (index: number) => {
      const wasSelected = selectedRow === index;
      toggleRow(index);

      if (wasSelected) {
        const item = months[index];
        onTableItemClick(item.start, item.month, null);
      }
    },
    [selectedRow, toggleRow, months, onTableItemClick]
  );

  const handleRowKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleRowClick(index);
      }
    },
    [handleRowClick]
  );

  const onViewDate = useCallback(() => {
    handleViewDateClick(onTableItemClick);
  }, [handleViewDateClick, onTableItemClick]);

  return (
    <div className="flex lg:h-full flex-col w-full rounded-2xl p-8 border-2 border-grey shadow-lg hover:bg-grey">
      <div id="header" className="flex justify-between gap-3 text-grey-2">
        <p className="text-black text-xl font-semibold">Monthly Count</p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleHeaderClick}
            className="flex items-center focus:outline-none"
            aria-label="Select date"
          >
            <p className="font-semibold text-xs text-grey-4 cursor-pointer mt-0.5">
              Select Date
            </p>
            <div className="mt-[-7px]">
              <IconButton
                size={0.8}
                path={mdiCalendarMonth}
                iconColor="text-grey-4"
              />
            </div>
          </button>
        </div>
      </div>

      <hr className="mt-4" />

      {/* New table header with 4 columns */}
      <div
        id="table-header"
        className="flex justify-between gap-3 text-grey-4 my-2 text-xs font-semibold"
      >
        <p className="w-1/4">Month</p>
        <p className="w-1/4 text-right">Total Count</p>
        <p className="w-1/4 text-right">% Change</p>
        <p className="w-1/6 text-center">Trend</p>
      </div>
      <hr />

      <div id="table-body" className="mt-4">
        {months.map((row: MonthItem, i) => {
          const isSelected = selectedRow === i;
          const pct = row.percentChange;
          const trend = row.trend;
          const pctDisplay =
            pct === null || pct === undefined
              ? "—"
              : `${Math.abs(Number(pct.toFixed(2))).toLocaleString()}%`;
          const pctColorClass =
            trend === "up"
              ? "text-green-500"
              : trend === "down"
              ? "text-red-500"
              : "text-black";
          const arrowNode =
            trend === "up" ? (
              <span className="inline-flex items-center text-green-500">
                {UpArrow}
              </span>
            ) : trend === "down" ? (
              <span className="inline-flex items-center text-red-500">
                {DownArrow}
              </span>
            ) : (
              <span
                className="inline-flex items-center text-grey-400"
                aria-hidden
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  aria-hidden
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="12" cy="12" r="2" fill="currentColor" />
                </svg>
              </span>
            );

          return (
            <div
              key={row.month}
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              onKeyDown={(e) => handleRowKeyDown(e, i)}
              onClick={() => handleRowClick(i)}
              className={`flex justify-between items-center text-sm text-black-2 my-4 cursor-pointer p-3 rounded-md
                ${isSelected ? "bg-primary text-white" : ""}
                hover:bg-grey-3`}
            >
              <p className="w-1/4">{row.month}</p>

              <p className="w-1/4 text-right font-semibold">
                {row.count.toLocaleString()}
              </p>

              <p
                className={`w-1/4 text-right ${
                  pct === null ? "text-grey-400" : pctColorClass
                }`}
              >
                {pct === null ? "—" : pct > 0 ? "+" : pct < 0 ? "-" : ""}
                {pct === null ? "" : pctDisplay}
              </p>

              <div className="w-1/6 flex justify-center items-center">
                {arrowNode}
              </div>
            </div>
          );
        })}
      </div>

      {/* Calendar Modal */}
      <Modal
        isOpen={showModal}
        bgColor="white"
        maxWidth="max-w-3xl"
        handleClose={closeModal}
      >
        <div className="flex flex-col gap-4 p-8">
          <h2 className="text-xl font-medium mb-2 text-center">
            Select a Date
          </h2>

          <div className="mx-auto">
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => {
                setSelectedDate(date);
              }}
              inline
            />
          </div>

          {error && (
            <div role="alert" className="text-sm text-red-600 text-center">
              {error}
            </div>
          )}

          <div>
            <Button onClick={onViewDate} className="w-full">
              View Date
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MonthlySectionOne;
