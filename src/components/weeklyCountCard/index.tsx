// src/components/weeklyCountCard/index.tsx
import React, { FC } from "react";
import { IconButton } from "../iconButton";
import { mdiCalendarMonth } from "@mdi/js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal } from "../modal";
import { Button } from "../button";
import ReactPaginate from "react-paginate";
import { mdiChevronLeft, mdiChevronRight } from "@mdi/js";
import Icon from "@mdi/react";

import useWeeklyCountCard from "../../hooks/useWeeklyCountCard";
import { WeeklyCountCardProps } from "@/src/types";

const WeeklyCountCard: FC<WeeklyCountCardProps> = ({
  onTableItemClick,
  weeklyData,
}) => {
  // NOTE: not providing fetchWeeklyData here — pass it into the hook when integrating with backend
  const {
    showModal,
    openModal,
    closeModal,
    selectedDate,
    handleDateChange,
    currentItems,
    pageCount,
    handlePageClick,
    handleRowClick,
    handleViewDateClick,
    selectedRow,
  } = useWeeklyCountCard({
    weeklyData,
    onTableItemClick,
    // itemsPerPage: 7, // default
  });

  return (
    <div className="flex lg:h-full flex-col w-full rounded-2xl p-8 border-2 border-grey shadow-lg hover:bg-grey">
      <div id="header" className="flex justify-between gap-3 text-grey-2">
        <p className="text-black text-xl font-semibold">Weekly Count</p>
        <div className="flex" onClick={openModal}>
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
        handleClose={closeModal}
      >
        <div className="flex flex-col gap-2 p-12">
          <h2 className="text-xl font-medium mb-4 flex justify-center">
            Select a Date
          </h2>
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
        activeClassName={"active text-white rounded-lg"}
        pageClassName={"page-item"}
        pageLinkClassName={
          "page-link px-3 py-1 text-black hover:bg-grey-3 hover:text-black rounded-lg"
        }
        previousClassName={
          "prev-item text-grey-1 hover:bg-grey-3 hover:text-black rounded-lg"
        }
        nextClassName={
          "next-item text-grey-1 hover:bg-grey-3 hover:text-black rounded-lg"
        }
        disabledClassName={"disabled opacity-50 cursor-not-allowed"}
        activeLinkClassName={"bg-primary text-white px-3 py-1 rounded-lg"}
      />
    </div>
  );
};

export default WeeklyCountCard;
