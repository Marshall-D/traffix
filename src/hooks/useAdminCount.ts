// src/hooks/useAdminCount.ts

import { useCallback, useEffect, useState } from "react";
import * as countService from "@/services/countService";

export default function useAdminCount(adminId?: string | null) {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchCount = useCallback(async () => {
    if (!adminId) return;

    setLoading(true);
    setError(null);

    try {
      const result = await countService.getTodayCount(adminId);

      if (result.error) throw result.error;

      setCount(result.count);
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
