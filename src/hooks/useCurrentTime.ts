// src/hooks/useCurrentTime.ts
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { formatDateSuffix } from "@/src/utils/helpers";

/**
 * useCurrentTime
 * - returns the current Dayjs instance plus preformatted date/time strings
 * - interval is configurable (ms). Default 1000ms to update every second.
 */
export default function useCurrentTime(interval = 1000) {
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(dayjs());
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  const formattedDate = `${now.date()}${formatDateSuffix(
    now.date()
  )} ${now.format("MMMM YYYY")}`;
  const formattedTime = now.format("HH:mm:ss");

  return { now, formattedDate, formattedTime };
}
