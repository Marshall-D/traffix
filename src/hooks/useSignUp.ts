// src/hooks/useSignUp.ts
import { useCallback, useState } from "react";
import * as authService from "@/services/authService";
import type { SignUpValues } from "@/src/types/auth";

export default function useSignUp() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * signUp (hook) — uses authService.signUp (service)
   * Both have the same name ("signUp") but we avoid identifier collision
   * by calling the service through the `authService` namespace.
   */
  const signUp = useCallback(async (values: SignUpValues): Promise<boolean> => {
    setError(null);
    setLoading(true);

    try {
      const result = await authService.signUp(values);
      if (!result.ok) {
        setError(result.message ?? "Sign-up failed");
        return false;
      }

      return true;
    } catch (err: unknown) {
      // axios throws Error with message already processed by interceptor
      const message = err instanceof Error ? err.message : "Sign-up failed";
      setError(message);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, signUp, setError } as const;
}
