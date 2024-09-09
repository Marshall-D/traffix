import React, { FC } from "react";

interface Props {
  title?: string;
  value?: string;
}

const CountStatsCard: FC<Props> = ({ title, value }) => {
  return (
    <div className="flex flex-col w-full justify-center  items-center rounded-2xl p-9  border-2 border-grey gap-4 shadow-lg hover:bg-grey">
      <p className="text-sm text-grey-2">{title}</p>{" "}
      <p className="font-medium text-4xl text-black">{value}</p>{" "}
    </div>
  );
};

export default CountStatsCard;
