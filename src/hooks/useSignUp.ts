// src/hooks/useSignUp.ts
import { useCallback, useState } from "react";
import { supabase } from "@/src/utils/supabaseClient";

export type SignUpValues = {
  email: string;
  password: string;
};

export default function useSignUp() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Attempts to sign up a user with Supabase Auth.
   * Returns true on success, false on failure.
   */
  const signUp = useCallback(async (values: SignUpValues): Promise<boolean> => {
    setError(null);
    setLoading(true);

    try {
      // Prefer using Supabase Auth which will handle email confirmation / password hashing
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (signUpError) {
        setError(signUpError.message || "Sign-up failed");
        return false;
      }

      // optionally inspect `data` for next steps (e.g. email confirmation required)
      return true;
    } catch (ex) {
      // eslint-disable-next-line no-console
      console.error("Unexpected signUp error", ex);
      setError("An unexpected error occurred. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, signUp, setError } as const;
}
