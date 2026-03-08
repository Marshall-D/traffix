import React, { FC } from "react";
import CircularIcon from "../circularIcon";

interface Props {
  day: string;
  /** Optional comparison text, e.g. "+23% above weekly average". Omit to show nothing after the day. */
  comparisonText?: string | null;
}

const BusiestDay: FC<Props> = ({ day, comparisonText }) => {
  const shortDay = day.slice(0, 3).toUpperCase();

  return (
    <div className="flex flex-row w-full justify-between rounded-2xl p-4 px-8 border-2 border-grey gap-32 shadow-lg hover:bg-grey">
      <div>
        <p className="text-sm text-grey-4 font-semibold">Busiest Day</p>
        <p className="font-semibold text-lg text-black-2">
          {day}
          {comparisonText ? (
            <span className="font-medium text-green text-sm ml-1">{comparisonText}</span>
          ) : null}
        </p>
      </div>
      <div>
        <CircularIcon day={shortDay}></CircularIcon>
      </div>
    </div>
  );
};

export default BusiestDay;
