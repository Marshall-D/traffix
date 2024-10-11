import React, { FC } from "react";
import { IconButton } from "../iconButton";

import { mdiCalendarMonth } from "@mdi/js";
import { Button } from "../button";

interface Props {
  title?: string;
  value?: string;
}

const HourlySectionOne: FC<Props> = ({ title, value }) => {
  return (
    <div className="flex flex-col w-full  rounded-2xl p-8  border-2 border-grey   shadow-lg hover:bg-grey">
      <div id="header" className="flex justify-between gap-3 text-grey-2 ">
        <p className="font-medium">Daily Count</p>{" "}
        <div className="">
          <Button size="sm" variant="primary" className="text-xs">
            Back to daily view
          </Button>
        </div>
      </div>
      <hr className="mt-4"></hr>
      <div id="table">
        <div
          id="table-header"
          className="flex justify-between gap-3 text-grey-2 mt-4 "
        >
          <p className="font-medium ml-20">Hour</p>{" "}
          <p className="font-medium ">Count</p>{" "}
        </div>
        <hr className=""></hr>
        <div id="table-body">
          <div className="flex justify-between text-sm my-4">
            <p className="ml-16">12:00</p>
            <p>200</p>
          </div>
          <div className="flex justify-between text-sm my-4">
            <p className="ml-16">12:00</p>
            <p>200</p>
          </div>
          <div className="flex justify-between text-sm my-4">
            <p className="ml-16">12:00</p>
            <p>200</p>
          </div>
          <div className="flex justify-between text-sm my-4">
            <p className="ml-16">12:00</p>
            <p>200</p>
          </div>
          <div className="flex justify-between text-sm my-4">
            <p className="ml-16">12:00</p>
            <p>200</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HourlySectionOne;
