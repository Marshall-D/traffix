import React, { FC, useState } from "react";
import { IconButton } from "../iconButton";
import { mdiCalendarMonth } from "@mdi/js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  title?: string;
  value?: string;
  onTableItemClick: () => void;
}

const DailySectionOne: FC<Props> = ({ title, value, onTableItemClick }) => {
  const [showModal, setShowModal] = useState(false); // State to control the modal
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); // Selected date

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
    onTableItemClick(); // Call the prop function
    setShowModal(false); // Close the modal
  };

  return (
    <div className="flex flex-col w-full rounded-2xl p-8 border-2 border-grey shadow-lg hover:bg-grey">
      <div id="header" className="flex justify-between gap-3 text-grey-2">
        <p className="font-medium">Daily Count</p>
        <div className="flex">
          <p className="font-light text-sm">Select date</p>
          <div className="mt-[-7px]">
            <IconButton
              hoverColor="hover:text-grey-1"
              size={0.8}
              path={mdiCalendarMonth}
              onClick={handleCalendarClick} // Open modal on calendar icon click
            />
          </div>
        </div>
      </div>
      <hr className="mt-4" />

      <div id="table">
        <div
          id="table-header"
          className="flex justify-between gap-3 text-grey-2 mt-4"
        >
          <p className="font-medium ml-20">Date</p>
          <p className="font-medium">Count</p>
        </div>
        <hr />

        <div id="table-body">
          {/* Rows with click handler */}
          <div
            className="flex justify-between text-sm my-4"
            onClick={onTableItemClick}
          >
            <p className="ml-16">01/05/2022</p>
            <p>209</p>
          </div>
          <div
            className="flex justify-between text-sm my-4"
            onClick={onTableItemClick}
          >
            <p className="ml-16">02/05/2022</p>
            <p>125</p>
          </div>
          <div
            className="flex justify-between text-sm my-4"
            onClick={onTableItemClick}
          >
            <p className="ml-16">03/05/2022</p>
            <p>145</p>
          </div>
          <div
            className="flex justify-between text-sm my-4"
            onClick={onTableItemClick}
          >
            <p className="ml-16">04/05/2022</p>
            <p>223</p>
          </div>
          <div
            className="flex justify-between text-sm my-4"
            onClick={onTableItemClick}
          >
            <p className="ml-16">05/05/2022</p>
            <p>301</p>
          </div>{" "}
          <div
            className="flex justify-between text-sm my-4"
            onClick={onTableItemClick}
          >
            <p className="ml-16">06/05/2022</p>
            <p>289</p>
          </div>{" "}
          <div
            className="flex justify-between text-sm my-4"
            onClick={onTableItemClick}
          >
            <p className="ml-16">07/05/2022</p>
            <p>179</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-medium mb-4">Select a Date</h2>
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange} // Handle date selection
              inline
            />

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleViewDateClick}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                disabled={!selectedDate} // Disable button if no date is selected
              >
                View Date
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailySectionOne;
