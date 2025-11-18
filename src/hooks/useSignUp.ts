// src/hooks/useSignUp.ts
import { useCallback, useState } from "react";
import * as authService from "@/services/authService";
import type { SignUpValues } from "@/src/types/auth";

export default function useSignUp() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * signUp (hook) — uses authService.signUp (service)
   * Returns an object with ok + optional message so the caller can decide next steps.
   */
  const signUp = useCallback(
    async (
      values: SignUpValues
    ): Promise<{ ok: boolean; message?: string | null }> => {
      setError(null);
      setLoading(true);

      try {
        const result = await authService.signUp(values);

        if (!result.ok) {
          const msg = result.message ?? "Sign-up failed";
          setError(msg);
          return { ok: false, message: msg };
        }

        // success — do not auto-persist token here (caller decides).
        return { ok: true, message: result.message ?? "Account created." };
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Sign-up failed";
        setError(message);
        return { ok: false, message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, error, signUp, setError } as const;
}
