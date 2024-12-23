import React, { FC } from "react";

interface Props {
  count?: number;
}

const TodaysCount: FC<Props> = ({ count }) => {
  return (
    <div className="flex flex-row w-full  rounded-2xl p-4 px-8 border-2 border-grey gap-32 shadow-lg hover:bg-grey">
      <div>
        <p className="text-sm text-grey-4 font-semibold">Todays Count</p>
        <p className="font-semibold text-lg text-black-2">
          {count}{" "}
          <span className="font-medium text-green text-sm">
            +55% more than same time yesterday
          </span>
        </p>
      </div>
    </div>
  );
};

export default TodaysCount;
