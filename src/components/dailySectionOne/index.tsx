import React, { FC } from "react";
import { IconButton } from "../iconButton";
import { mdiCalendarMonth } from "@mdi/js";

interface Props {
  title?: string;
  value?: string;
  onTableItemClick: () => void; // Add this prop
}

const DailySectionOne: FC<Props> = ({ title, value, onTableItemClick }) => {
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
            <p className="ml-16">12/22/2022</p>
            <p>200</p>
          </div>
          <div
            className="flex justify-between text-sm my-4"
            onClick={onTableItemClick}
          >
            <p className="ml-16">12/22/2022</p>
            <p>200</p>
          </div>
          <div
            className="flex justify-between text-sm my-4"
            onClick={onTableItemClick}
          >
            <p className="ml-16">12/22/2022</p>
            <p>200</p>
          </div>
          <div
            className="flex justify-between text-sm my-4"
            onClick={onTableItemClick}
          >
            <p className="ml-16">12/22/2022</p>
            <p>200</p>
          </div>
          <div
            className="flex justify-between text-sm my-4"
            onClick={onTableItemClick}
          >
            <p className="ml-16">12/22/2022</p>
            <p>200</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailySectionOne;
