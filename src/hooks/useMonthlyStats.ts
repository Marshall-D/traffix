/**
 * Fetches monthly stats from GET /api/v1/stats/monthly?year=YYYY.
 * Used by the admin Monthly page.
 */
import { useCallback, useEffect, useState } from "react";
import { statsService } from "@/services/statsService";
import type { MonthItem, MonthlySummary } from "@/services/statsService";

export default function useMonthlyStats(year?: number) {
  const [months, setMonths] = useState<MonthItem[]>([]);
  const [monthlySummary, setMonthlySummary] = useState<MonthlySummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  const fetchMonthly = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await statsService.getMonthly(year);
    setMonths(data?.months ?? []);
    setMonthlySummary(data?.monthlySummary ?? null);
    setError(err);
    setLoading(false);
  }, [year]);

  useEffect(() => {
    fetchMonthly();
  }, [fetchMonthly]);

  return { months, monthlySummary, loading, error, refetch: fetchMonthly };
}
