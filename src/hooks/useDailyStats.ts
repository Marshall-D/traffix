/**
 * Fetches daily stats from GET /api/v1/stats/daily (optional from/to).
 * Used by the admin Daily page for table + summary.
 */
import { useCallback, useEffect, useState } from "react";
import {
  statsService,
  type DailyDataItem,
  type DailySummary,
} from "@/services/statsService";

export type { DailyDataItem, DailySummary };

export default function useDailyStats(from?: string, to?: string) {
  const [dailyData, setDailyData] = useState<DailyDataItem[]>([]);
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchDaily = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await statsService.getDaily(
      from,
      to
    );
    setDailyData(data?.dailyData ?? []);
    setDailySummary(data?.dailySummary ?? null);
    setError(err);
    setLoading(false);
  }, [from, to]);

  useEffect(() => {
    fetchDaily();
  }, [fetchDaily]);

  return { dailyData, dailySummary, loading, error, refetch: fetchDaily };
}
