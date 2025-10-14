// src/hooks/useLogin.ts
import { useCallback, useState } from "react";
import { supabase } from "@/src/utils/supabaseClient";

export type LoginValues = {
  email: string;
  password: string;
};

export default function useLogin() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useCallback(async (values: LoginValues): Promise<boolean> => {
    setError(null);
    setLoading(true);

    try {
      const { error: signInError, data } =
        await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

      if (signInError) {
        // normalize message for UI
        setError(signInError.message ?? "Login failed");
        return false;
      }

      // Optionally persist session or user metadata here (be mindful of sensitive data)
      // Example: localStorage.setItem("supabaseSession", JSON.stringify(data.session));

      return true;
    } catch (ex) {
      // unexpected
      // eslint-disable-next-line no-console
      console.error("Unexpected signIn error", ex);
      setError("An unexpected error occurred. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    signIn,
    setError, // exported for tests and special cases
  } as const;
}
