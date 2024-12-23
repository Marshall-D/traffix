import React, { FC, useState } from "react";
import { IconButton } from "../iconButton";
import { mdiCalendarMonth } from "@mdi/js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal } from "../modal";
import { Button } from "../button";

interface Props {
  onTableItemClick: (date: string) => void; // Updated to accept a date parameter
}

const DailySectionOne: FC<Props> = ({ onTableItemClick }) => {
  const [showModal, setShowModal] = useState(false); // State to control the modal
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Selected date

  const [selectedRow, setSelectedRow] = useState(0); // State to track selected row
  const [isClickedOnce, setIsClickedOnce] = useState<number | null>(null); // Track if row has been clicked once

  // Function to handle calendar icon click and show modal
  const handleCalendarClick = () => {
    setShowModal(true);
  };

  // Function to handle the date selection
  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  // Function to handle "View Date" button click
  const handleViewDateClick = () => {
    if (selectedDate) {
      // Convert selectedDate to "YYYY-MM-DD" format
      const formattedStringDate = new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(selectedDate);

      // const formattedDate = formatDate(formattedStringDate); // Pass the formatted string to the helper
      onTableItemClick(formattedStringDate); // Pass the formatted date to the parent
    }
    setShowModal(false); // Close the modal
  };

  // Function to handle row click
  const handleRowClick = (index: number, date: string) => {
    if (isClickedOnce === index) {
      // If the row is clicked for the second time, perform the action
      onTableItemClick(date); // Pass the clicked date to the parent
      setIsClickedOnce(null); // Reset the "clicked once" state
    } else {
      // If it's the first click, just select the row
      setSelectedRow(index);
      setIsClickedOnce(index);
    }
  };

  const data = [
    { date: "2024-05-01", count: 209 },
    { date: "2024-05-02", count: 125 },
    { date: "2024-05-03", count: 145 },
    { date: "2024-05-04", count: 223 },
    { date: "2024-05-05", count: 301 },
    { date: "2024-05-06", count: 289 },
    { date: "2024-05-07", count: 179 },
  ];

  return (
    <div className="flex lg:h-full flex-col w-full rounded-2xl p-8 border-2 border-grey shadow-lg hover:bg-grey">
      <div id="header" className="flex justify-between gap-3 text-grey-2">
        <p className="font-medium">Daily Count</p>
        <div className="flex" onClick={handleCalendarClick}>
          <p className="font-light text-sm cursor-pointer">Select date</p>
          <div className="mt-[-7px]">
            <IconButton
              hoverColor="hover:text-grey-1"
              size={0.8}
              path={mdiCalendarMonth}
            />
          </div>
        </div>
      </div>
      <hr className="mt-4" />

      <div id="table">
        <div
          id="table-header"
          className="flex justify-between gap-3  text-grey-4 my-2 text-xs font-semibold"
        >
          <p className="font-medium ">Date</p>
          <p className="font-medium">Count</p>
        </div>
        <hr />

        <div id="table-body">
          {data.map((row, index) => (
            <div
              key={index}
              className={`flex justify-between text-sm my-4 cursor-pointer p-2 rounded-md
    ${selectedRow === index ? "bg-primary" : ""} 
    ${selectedRow === index && "hover:text-primary text-white"}
    hover:${selectedRow === index ? "bg-grey" : "text-primary"}`}
              onClick={() => handleRowClick(index, row.date)}
            >
              <p className="">{row.date}</p>
              <p className="">{row.count}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={showModal}
        bgColor="red"
        maxWidth="max-w-3xl"
        handleClose={() => {
          setShowModal(false);
        }}
      >
        <div className="flex flex-col gap-2 p-12">
          <h2 className="text-xl font-medium mb-4 flex justify-center">
            Select a Date
          </h2>
          {/* DatePicker with Tailwind styling */}
          <div className="shadow-[0.5px_0.5px_10px_0.5px_rgba(0,0,0,0.3)] rounded-lg">
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              inline
              calendarClassName="!border-none !shadow-none"
            />
          </div>

          <div className="mt-4">
            <Button onClick={handleViewDateClick} className="w-full">
              View Date
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DailySectionOne;
