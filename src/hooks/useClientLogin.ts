// src/hooks/useClientLogin.ts
import { useCallback, useState } from "react";
import * as clientsService from "@/services/clientsService";

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

        const { data, error: err } = await clientsService.clientLogin(
          adminId,
          values.email,
          values.password
        );

        if (err || !data) {
          setError("Invalid credentials or admin ID.");
          return null;
        }

        try {
          if (typeof window !== "undefined") {
            localStorage.setItem("clientData", JSON.stringify(data));
          }
        } catch (e) {
          console.warn("Failed to write clientData to localStorage", e);
        }

        return data;
      } catch (err) {
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
