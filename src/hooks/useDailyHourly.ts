/**
 * Fetches hourly stats for a given date from GET /api/v1/stats/daily/:date/hourly.
 * Used by the admin Daily page when a date is selected.
 */
import { useCallback, useEffect, useState } from "react";
import { statsService } from "@/services/statsService";
import type { HourlyItem } from "@/services/statsService";

export default function useDailyHourly(date: string | null) {
  const [hourlyData, setHourlyData] = useState<HourlyItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const fetchHourly = useCallback(async (d: string) => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await statsService.getDailyHourly(d);
    setHourlyData(data?.hourlyData ?? []);
    setError(err);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!date) {
      setHourlyData([]);
      setError(null);
      return;
    }
    fetchHourly(date);
  }, [date, fetchHourly]);

  return { hourlyData, loading, error };
}
