import React, { FC } from "react";
import CircularIcon from "../circularIcon";

interface Props {
  // title?: string;
  // value?: string;
}

const BusiestDay: FC<Props> = ({}) => {
  return (
    <div className="flex flex-row w-full justify-between  rounded-2xl p-4 px-8  border-2 border-grey gap-32 shadow-lg hover:bg-grey">
      <div>
        {" "}
        <p className="text-sm text-grey-4  font-semibold ">Busiest Day</p>{" "}
        <p className="font-semibold text-lg text-black-2">
          Monday <span className="font-medium text-green text-sm"> +55%</span>
        </p>{" "}
      </div>
      <div>
        {" "}
        <CircularIcon></CircularIcon>
      </div>
    </div>
  );
};

export default BusiestDay;
