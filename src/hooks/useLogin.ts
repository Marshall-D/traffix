// src/hooks/useLogin.ts
import { useCallback, useState } from "react";
import * as authService from "@/services/authService";
import type { LoginValues } from "@/src/types/auth";

export default function useLogin() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Returns { ok, message } so the UI can choose to set field-level errors.
   */
  const login = useCallback(
    async (
      values: LoginValues
    ): Promise<{ ok: boolean; message?: string | null }> => {
      setError(null);
      setLoading(true);

      try {
        const result = await authService.login(values);
        if (!result.ok) {
          // service returns message for UI
          setError(result.message ?? "Login failed");
          return { ok: false, message: result.message ?? "Login failed" };
        }

        return { ok: true, message: result.message ?? null };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Login failed";
        setError(message);
        return { ok: false, message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    login,
    setError,
  } as const;
}
