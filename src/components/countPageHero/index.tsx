import classNames from "classnames";
import React, { FC } from "react";
import dayjs from "dayjs";

interface Props {
  label?: string;
}

const CountPageHero: FC<Props> = ({ label }) => {
  return (
    <div className="flex flex-col items-center gap-2 ">
      <p> {dayjs(new Date()).format(" DD MMM YYYY ")}</p>
      <p> {dayjs(new Date()).format("h:mm A ")}</p>
    </div>
  );
};

export default CountPageHero;
