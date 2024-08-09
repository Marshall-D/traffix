import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

const formatDateSuffix = (day: number): string => {
  if (day > 3 && day < 21) return "th"; // exceptions for 11th, 12th, 13th
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

const CountPageHero: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<dayjs.Dayjs>(dayjs());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(dayjs());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = `${currentTime.date()}${formatDateSuffix(
    currentTime.date()
  )} ${currentTime.format("MMMM YYYY")}`;
  const formattedTime = currentTime.format("HH:mm:ss");

  return (
    <div className="flex flex-col items-center gap-2 ">
      <p>{formattedDate}</p>
      <p>{formattedTime}</p>
    </div>
  );
};

export default CountPageHero;
