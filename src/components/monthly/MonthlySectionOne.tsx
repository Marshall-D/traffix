// src/components/monthly/MonthlySectionOne.tsx
import React, { FC, useCallback } from "react";
import { IconButton } from "../iconButton";
import { mdiCalendarMonth } from "@mdi/js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal } from "../modal";
import { Button } from "../button";
import { formatDate } from "@/src/utils/helpers";
import useMonthlySection from "@/src/hooks/useMonthlySection";

/**
 * Props:
 * - onTableItemClick(startOfMonthDate: string, monthNumber: number, highlightedWeekStart?: string|null)
 */
interface Props {
  onTableItemClick: (
    startOfMonthDate: string,
    monthNumber: number,
    highlightedWeekStart?: string | null
  ) => void;
}

const MonthlySectionOne: FC<Props> = ({ onTableItemClick }) => {
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
  } = useMonthlySection();

  const handleHeaderClick = useCallback(() => {
    openModal();
  }, [openModal]);

  const handleRowClick = useCallback(
    (index: number) => {
      const wasSelected = selectedRow === index;
      // toggle selection
      toggleRow(index);

      // if it was already selected, perform the action (same behavior as original)
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

      {/* Table header */}
      <div
        id="table-header"
        className="flex justify-between gap-3 text-grey-4 my-2 text-xs font-semibold"
      >
        <p className="font-medium">Month</p>
        <p className="font-medium">Start Date</p>
        <p className="font-medium">Count</p>
      </div>
      <hr />

      <div id="table-body" className="mt-4">
        {months.map((row, i) => {
          const isSelected = selectedRow === i;
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
              <p className="w-1/3">{formatDate(row.start)}</p>
              <p className="w-1/4 font-semibold text-right">{row.count}</p>
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
