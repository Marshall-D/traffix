// src/components/countPageHero.tsx
import useCurrentTime from "@/src/hooks/useCurrentTime";
import React from "react";

const CountPageHero: React.FC = () => {
  const { formattedDate, formattedTime } = useCurrentTime();

  return (
    <div className="flex flex-col items-center gap-2 ">
      <p>{formattedDate}</p>
      <p>{formattedTime}</p>
    </div>
  );
};

export default CountPageHero;
