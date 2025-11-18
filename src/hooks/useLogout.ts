// src/hooks/useLogout.ts
import { useCallback, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import * as authService from "@/services/authService";

/**
 * Hook that performs logout.
 * - Attempts server logout (optional; no-op if backend doesn't support it)
 * - Always performs client-side signOut immediately (optimistic)
 */
export default function useLogout() {
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(async () => {
    setError(null);
    setLoading(true);

    try {
      // Optimistically sign out locally (fast UX)
      signOut();

      // Try to tell backend to revoke tokens / session (optional, tolerates failure)
      //not yet implemented in backend.
      try {
        await authService.logout();
        // backend responded OK — nothing else to do
      } catch (serverErr) {
        // server logout failed — that's okay; we've already cleared client state.
        // Log it for diagnostics (do not block the user).
        // eslint-disable-next-line no-console
        console.warn("Server logout failed:", serverErr);
      }

      return true;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to logout";
      setError(msg);
      return false;
    } finally {
      setLoading(false);
    }
  }, [signOut]);

  return {
    logout,
    loading,
    error,
  } as const;
}
