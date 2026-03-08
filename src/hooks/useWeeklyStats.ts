/**
 * Fetches weekly stats from GET /api/v1/stats/weekly?year=YYYY.
 * Used by the admin Weekly page.
 */
import { useCallback, useEffect, useState } from "react";
import { statsService } from "@/services/statsService";
import type { WeekItem, WeeklySummary } from "@/services/statsService";

export default function useWeeklyStats(year?: number) {
  const [weeks, setWeeks] = useState<WeekItem[]>([]);
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchWeekly = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await statsService.getWeekly(year);
    setWeeks(data?.weeks ?? []);
    setWeeklySummary(data?.weeklySummary ?? null);
    setError(err);
    setLoading(false);
  }, [year]);

  useEffect(() => {
    fetchWeekly();
  }, [fetchWeekly]);

  return { weeks, weeklySummary, loading, error, refetch: fetchWeekly };
}
