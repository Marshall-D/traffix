// src/hooks/useAdminCount.ts

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/src/utils/supabaseClient";
import getTodayRangeUTC from "../utils/helpers";

export default function useAdminCount(adminId?: string | null) {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCount = useCallback(async () => {
    if (!adminId) return;

    setLoading(true);
    setError(null);

    const { startIso, endIso } = getTodayRangeUTC();

    try {
      // select only `id` and use exact count for better perf
      const { data, error } = await supabase
        .from("count")
        .select("id", { count: "exact" })
        .eq("adminid", adminId)
        .gte("created_at", startIso)
        .lte("created_at", endIso);

      if (error) throw error;

      setCount(data?.length ?? 0);
    } catch (err) {
      setError(err as Error);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [adminId]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return { count, loading, error, refetch: fetchCount } as const;
}
