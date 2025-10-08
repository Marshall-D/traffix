import React, { FC, useState } from "react";
import { IconButton } from "../iconButton";
import { mdiCalendarMonth } from "@mdi/js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal } from "../modal";
import { Button } from "../button";
import ReactPaginate from "react-paginate";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import Icon from "@mdi/react";

interface WeeklyData {
  date: string; // Start date of the week
  count: number; // Total count for the week
  week: number; // Week number
}

interface Props {
  onTableItemClick: (date: string | null, week: number | null) => void;
  // Accept both date and week as parameters, or `null` for "no data" case
  weeklyData: WeeklyData[]; // Array of weekly data
}

const WeeklyCountCard: FC<Props> = ({ onTableItemClick, weeklyData }) => {
  const [currentPage, setCurrentPage] = useState(0);

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

  // };
  const handleViewDateClick = () => {
    if (selectedDate) {
      // Format the selected date to match the weeklyData's date format
      const formattedStringDate = new Intl.DateTimeFormat("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(selectedDate);

      // Check if the date falls in the range of any week
      const matchedWeekData = weeklyData.find((item) => {
        // Get the start and end dates of the week based on item's date
        const weekStartDate = new Date(item.date); // Starting date of the week
        const weekEndDate = new Date(weekStartDate);
        weekEndDate.setDate(weekEndDate.getDate() + 6); // Adding 6 days to get the week range

        const selectedDateObj = new Date(formattedStringDate);

        // Check if the selected date falls within the range
        return (
          selectedDateObj >= weekStartDate && selectedDateObj <= weekEndDate
        );
      });

      if (matchedWeekData) {
        // If the date falls in the range of any week, pass it to the parent
        onTableItemClick(formattedStringDate, matchedWeekData.week);
        setShowModal(false); // Close the modal
      } else {
        // If no week matches the selected date
        alert("No data available for this date.");
      }
    } else {
      // Handle case when no date is selected
      alert("Please select a date.");
    }
  };

  // Function to handle row click
  const handleRowClick = (index: number, date: string) => {
    const matchedWeekData = weeklyData.find((item) => item.date === date);

    if (isClickedOnce === index) {
      if (matchedWeekData) {
        // If the row is clicked for the second time, pass both date and week to the parent
        onTableItemClick(date, matchedWeekData.week);
      } else {
        // Handle case where no data matches (shouldn't happen for rows in the table)
        onTableItemClick(null, null);
      }
      setIsClickedOnce(null); // Reset the "clicked once" state
    } else {
      // If it's the first click, just select the row
      setSelectedRow(index);
      setIsClickedOnce(index);
    }
  };

  // Set the number of items per page
  const itemsPerPage = 7;
  // Calculate the items for the current page
  const offset = currentPage * itemsPerPage;
  const currentItems = weeklyData.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(weeklyData.length / itemsPerPage);
  // Handle page change
  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected);
  };
  return (
    <div className="flex lg:h-full flex-col w-full rounded-2xl p-8 border-2 border-grey shadow-lg hover:bg-grey">
      <div id="header" className="flex justify-between gap-3 text-grey-2">
        <p className="text-black text-xl font-semibold">Weekly Count</p>
        <div className="flex" onClick={handleCalendarClick}>
          <p className="font-semibold text-xs text-grey-4 cursor-pointer mt-0.5">
            Select Week
          </p>
          <div className="mt-[-7px]">
            <IconButton
              hoverColor="hover:text-grey-1"
              size={0.8}
              path={mdiCalendarMonth}
              iconColor="text-grey-4"
            />
          </div>
        </div>
      </div>
      <hr className="mt-4" />

      <div id="table">
        <div
          id="table-header"
          className="flex justify-between gap-3 text-grey-4 my-2 text-xs font-semibold"
        >
          <p>Week</p>

          <p>Date</p>
          <p>Count</p>
        </div>
        <hr />

        <div id="table-body">
          {currentItems.map((row, index) => (
            <div
              key={index}
              className={`flex justify-between text-black-2 text-sm my-8 cursor-pointer py-2 px-4 rounded-md
    ${selectedRow === index ? "bg-primary" : ""} 
    ${selectedRow === index && "hover:text-primary text-white"}
    hover:${selectedRow === index ? "bg-grey" : "text-primary"}`}
              onClick={() => handleRowClick(index, row.date)}
            >
              <p className="">{row.week}</p>
              <p className="">{row.date}</p>
              <p className="font-semibold">{row.count}</p>
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
      {/* Pagination Component */}
      <ReactPaginate
        previousLabel={<Icon path={mdiChevronLeft} size={0.7} />}
        nextLabel={<Icon path={mdiChevronRight} size={0.7} />}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        onPageChange={handlePageClick}
        containerClassName={
          "pagination flex justify-center items-center mt-4 space-x-2"
        }
        activeClassName={"active text-white rounded-lg"} // Active page styling
        pageClassName={"page-item"} // Wrapper for page link
        pageLinkClassName={
          "page-link px-3 py-1 text-black hover:bg-grey-3 hover:text-black rounded-lg"
        } // Added hover styles
        previousClassName={
          "prev-item text-grey-1 hover:bg-grey-3 hover:text-black rounded-lg"
        } // Added hover styles for prev arrow
        nextClassName={
          "next-item text-grey-1 hover:bg-grey-3 hover:text-black rounded-lg"
        } // Added hover styles for next arrow
        disabledClassName={"disabled opacity-50 cursor-not-allowed"} // Disabled styles
        activeLinkClassName={"bg-primary text-white px-3 py-1 rounded-lg"} // Active link styling
      />
    </div>
  );
};

export default WeeklyCountCard;
