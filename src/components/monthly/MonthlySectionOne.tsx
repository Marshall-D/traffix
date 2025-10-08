// src/components/monthly/MonthlySectionOne.tsx
import React, { FC, useState } from "react";
import { IconButton } from "../iconButton";
import { mdiCalendarMonth } from "@mdi/js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal } from "../modal";
import { Button } from "../button";
import { formatDate } from "@/src/utils/helpers";
import { monthlyData, WeeklyData as AllWeeklyData } from "@/src/utils/data";

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
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const handleViewDateClick = () => {
    if (!selectedDate) {
      alert("Please select a date.");
      return;
    }

    // Normalize selected date to midnight to avoid TZ issues
    const selectedDateObj = new Date(selectedDate);
    selectedDateObj.setHours(0, 0, 0, 0);

    // Find monthlyData item whose range contains the selected date
    const found = monthlyData.find((m) => {
      const start = new Date(m.start + "T00:00:00");
      start.setHours(0, 0, 0, 0);
      const next = new Date(start);
      next.setMonth(next.getMonth() + 1); // next month start
      next.setHours(0, 0, 0, 0);
      return selectedDateObj >= start && selectedDateObj < next;
    });

    if (found) {
      // --- compute which week (if any) contains the selected date ---
      const matchedWeek = AllWeeklyData.find((w) => {
        const weekStart = new Date(w.date + "T00:00:00");
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        return selectedDateObj >= weekStart && selectedDateObj <= weekEnd;
      });

      const highlightedWeekStart = matchedWeek ? matchedWeek.date : null;

      // call parent handler — monthly.tsx will switch to the weeks view and pass highlightedWeekStart
      onTableItemClick(found.start, found.month, highlightedWeekStart);
    } else {
      alert("No data available for this date.");
    }
    setShowModal(false);
  };

  const handleRowClick = (index: number) => {
    const item = monthlyData[index];
    setSelectedRow(index === selectedRow ? null : index);

    // if row was already selected (second click), trigger parent handler only
    if (selectedRow === index) {
      onTableItemClick(item.start, item.month, null);
      // monthly.tsx will switch to the weeks view
    }
  };

  return (
    <div className="flex lg:h-full flex-col w-full rounded-2xl p-8 border-2 border-grey shadow-lg hover:bg-grey">
      <div id="header" className="flex justify-between gap-3 text-grey-2">
        <p className="text-black text-xl font-semibold">Monthly Count</p>
        <div className="flex" onClick={() => setShowModal(true)}>
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
        {monthlyData.map((row, i) => (
          <div
            key={row.month}
            className={`flex justify-between items-center text-sm text-black-2 my-4 cursor-pointer p-3 rounded-md
              ${selectedRow === i ? "bg-primary text-white" : ""}
              hover:bg-grey-3`}
            onClick={() => handleRowClick(i)}
          >
            <p className="w-1/4">{row.month}</p>
            <p className="w-1/3">{formatDate(row.start)}</p>
            <p className="w-1/4 font-semibold text-right">{row.count}</p>
          </div>
        ))}
      </div>

      {/* Calendar Modal */}
      <Modal
        isOpen={showModal}
        bgColor="white"
        maxWidth="max-w-3xl"
        handleClose={() => setShowModal(false)}
      >
        <div className="flex flex-col gap-4 p-8">
          <h2 className="text-xl font-medium mb-2 text-center">
            Select a Date
          </h2>
          <div className="mx-auto">
            {/* <-- removed showMonthYearPicker so calendar shows days & months like weekly modal */}
            <DatePicker
              selected={selectedDate}
              onChange={(date: Date | null) => {
                setSelectedDate(date);
              }}
              inline
              // leaving default dateFormat so users see days; you can change to "dd/MM/yyyy" if you prefer
            />
          </div>
          <div>
            <Button onClick={handleViewDateClick} className="w-full">
              View Date
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MonthlySectionOne;
