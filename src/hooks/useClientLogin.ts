// src/hooks/useClientLogin.ts
import { useCallback, useState } from "react";
import { supabase } from "@/src/utils/supabaseClient";

export type LoginValues = {
  email: string;
  password: string;
};

export type UseClientLoginResult = {
  loading: boolean;
  error: string | null;
  /**
   * Attempts to authenticate the client.
   * Returns the client row on success, or null on failure.
   */
  signIn: (values: LoginValues, adminId?: string | null) => Promise<any | null>;
};

export default function useClientLogin(): UseClientLoginResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signIn = useCallback(
    async (values: LoginValues, adminId?: string | null) => {
      setError(null);
      setLoading(true);

      try {
        if (!adminId) {
          setError("Missing admin id");
          return null;
        }

        // NOTE: this assumes passwords are stored in plain text (bad).
        // Prefer hashing on the backend and using an auth endpoint.
        const { data, error } = await supabase
          .from("clients")
          .select("*")
          .eq("email", values.email)
          .eq("password", values.password)
          .eq("id", adminId)
          .single();

        if (error || !data) {
          setError("Invalid credentials or admin ID.");
          return null;
        }

        // persist client data (only safe if you know what is stored in `data`)
        try {
          if (typeof window !== "undefined") {
            localStorage.setItem("clientData", JSON.stringify(data));
          }
        } catch (err) {
          // don't block login if storage fails, but log for debugging
          // eslint-disable-next-line no-console
          console.warn("Failed to write clientData to localStorage", err);
        }

        return data;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Unexpected signIn error", err);
        setError("An unexpected error occurred. Please try again.");
        return null;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, error, signIn };
}
