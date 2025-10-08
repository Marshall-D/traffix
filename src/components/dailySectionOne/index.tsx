// src/components/dailySectionOne/index.tsx
import React, { FC } from "react";
import { IconButton } from "../iconButton";
import { mdiCalendarMonth } from "@mdi/js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Modal } from "../modal";
import { Button } from "../button";
import useDailySection from "@/src/hooks/useDailySection";
import { dailyData as sampleDailyData } from "@/src/utils/data";

interface Props {
  onTableItemClick: (date: string) => void;
}

const cx = (...parts: Array<string | false | undefined>) =>
  parts.filter(Boolean).join(" ");

const DailySectionOne: FC<Props> = ({ onTableItemClick }) => {
  const {
    showModal,
    setShowModal,
    selectedDate,
    selectedRow,
    isClickedOnce,
    handleCalendarClick,
    handleDateChange,
    handleViewDateClick,
    handleRowClick,
  } = useDailySection(onTableItemClick);

  const data = sampleDailyData; // reuse the data you already have in utils/data.ts

  return (
    <div className="flex lg:h-full flex-col w-full rounded-2xl p-8 border-2 border-grey shadow-lg hover:bg-grey">
      <div id="header" className="flex justify-between gap-3 text-grey-2">
        <p className="text-black text-xl font-semibold">Daily Count</p>
        <div className="flex items-center gap-2">
          <p
            className="font-semibold text-xs text-grey-4 cursor-pointer mt-0.5"
            onClick={handleCalendarClick}
          >
            Select Date Range
          </p>

          <IconButton
            hoverColor="hover:text-grey-1"
            size={0.8}
            path={mdiCalendarMonth}
            iconColor="text-grey-4"
            onClick={handleCalendarClick}
          />
        </div>
      </div>

      <hr className="mt-4" />

      <div id="table">
        <div
          id="table-header"
          className="flex justify-between gap-3 text-grey-4 my-2 text-xs font-semibold"
        >
          <p className="font-medium ">Date</p>
          <p className="font-medium">Count</p>
        </div>
        <hr />

        <div id="table-body">
          {data.map((row, index) => {
            const isSelected = selectedRow === index;
            const base =
              "flex justify-between text-sm text-black-2 my-8 cursor-pointer p-2 rounded-md";
            const selectedClasses = isSelected
              ? "bg-primary hover:bg-grey text-white hover:text-white"
              : "hover:text-primary";
            const rowClass = cx(base, selectedClasses);

            return (
              <div
                key={index}
                className={rowClass}
                onClick={() => handleRowClick(index, row.date)}
              >
                <p>{row.date}</p>
                <p className="font-semibold">{row.count}</p>
              </div>
            );
          })}
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
