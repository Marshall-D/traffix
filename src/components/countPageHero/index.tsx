// src/components/countPageHero.tsx
import useCurrentTime from "@/src/hooks/useCurrentTime";
import React, { useEffect, useState } from "react";

const CountPageHero: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { formattedDate, formattedTime } = useCurrentTime();

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col items-center gap-2 ">
      <p>{mounted ? formattedDate : "\u00A0"}</p>
      <p>{mounted ? formattedTime : "\u00A0"}</p>
    </div>
  );
};

export default CountPageHero;
