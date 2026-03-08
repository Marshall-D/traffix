// src/hooks/useAdminCount.ts

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as countService from "@/services/countService";

/** YYYY-MM-DD for today in client local time (so backend returns count for that day). */
function getTodayDateString(): string {
  const n = new Date();
  return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, "0")}-${String(n.getDate()).padStart(2, "0")}`;
}

export default function useAdminCount(adminId?: string | null) {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCount = useCallback(async () => {
    if (!adminId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await countService.getTodayCount(adminId, {
        date: getTodayDateString(),
      });

      if (result.error) throw result.error;

      setCount(result.count);
    } catch (err) {
      setError(err as Error);
      setCount(0);
      toast.error("Could not load count");
    } finally {
      setLoading(false);
    }
  }, [adminId]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return { count, loading, error, refetch: fetchCount } as const;
}
