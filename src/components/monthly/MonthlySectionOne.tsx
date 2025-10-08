// src/components/monthly/MonthlySectionOne.tsx
import React, { FC, useState } from "react";
import { IconButton } from "../iconButton";
import { mdiCalendarMonth } from "@mdi/js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal } from "../modal";
import { Button } from "../button";
import { formatDate } from "@/src/utils/helpers";
import { monthlyData } from "@/src/utils/data";

/**
 * Props:
 * - onTableItemClick(startOfMonthDate: string, monthNumber: number)
 */
interface Props {
  onTableItemClick: (startOfMonthDate: string, monthNumber: number) => void;
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
    // Convert to YYYY-MM-DD (start-of-month)
    const formatted = new Intl.DateTimeFormat("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(selectedDate);
    // Find month item that contains that date (matching startOfMonth)
    const found = monthlyData.find((m) => m.start === formatted);
    if (found) {
      // only call parent handler — do not navigate here
      onTableItemClick(found.start, found.month);
    } else {
      alert("No data available for this date.");
    }
    setShowModal(false);
  };

  const handleRowClick = (index: number) => {
    const item = monthlyData[index];
    // toggle highlight on first click
    setSelectedRow(index === selectedRow ? null : index);

    // if row was already selected (second click), trigger parent handler only
    if (selectedRow === index) {
      onTableItemClick(item.start, item.month);
      // DO NOT navigate here — monthly.tsx will switch to the weeks view
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
            Select a Month Start
          </h2>
          <div className="mx-auto">
            <DatePicker
              selected={selectedDate}
              onChange={setSelectedDate}
              inline
              showMonthYearPicker
              dateFormat="MM/yyyy"
            />
          </div>
          <div>
            <Button onClick={handleViewDateClick} className="w-full">
              View Month
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MonthlySectionOne;
