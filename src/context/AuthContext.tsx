// src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import type { User, LoginValues } from "@/src/types/auth";
import * as authService from "@/services/authService";
import { setAuthToken } from "@/services/apiClient";
import { useRouter } from "next/router";
import ROUTES from "@/src/utils/routes";

type AuthState = {
  user: User | null;
  loading: boolean;
};

type SignInResult = { ok: boolean; message?: string | null };

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (values: LoginValues) => Promise<SignInResult>;
  signOut: () => void;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "traffix_auth"; // stores { token, user }

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });
  const router = useRouter();

  // Restore auth from localStorage on mount
  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEY)
          : null;
      if (raw) {
        const parsed = JSON.parse(raw) as {
          token?: string;
          user?: User | null;
        } | null;
        if (parsed?.token) {
          // set token into apiClient so subsequent requests are authenticated
          setAuthToken(parsed.token);
        }
        setState({ user: parsed?.user ?? null, loading: false });
        return;
      }
    } catch (e) {
      // malformed storage -> clear it
      localStorage.removeItem(STORAGE_KEY);
    }
    setState({ user: null, loading: false });
  }, []);

  const setUser = (user: User | null) => {
    setState((s) => ({ ...s, user }));
    // update persisted storage preserving token if present
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem(STORAGE_KEY)
          : null;
      const parsed = raw
        ? (JSON.parse(raw) as { token?: string; user?: User | null })
        : {};
      const next = { ...(parsed || {}), user };
      if (typeof window !== "undefined")
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      // ignore
    }
  };

  const signIn = async (values: LoginValues): Promise<SignInResult> => {
    // call service which returns { ok, token?, user?, message? }
    const result = await authService.login(values);
    if (!result.ok) {
      return { ok: false, message: result.message ?? "Login failed" };
    }

    // persist token + user in localStorage and in apiClient
    try {
      if (result.token) {
        setAuthToken(result.token);
      }
      const payload = {
        token: result.token ?? null,
        user: result.user ?? null,
      };
      if (typeof window !== "undefined")
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      // ignore persistence failure but still set in-memory
    }

    setState({ user: result.user ?? null, loading: false });
    return { ok: true, message: result.message ?? null };
  };

  const signOut = () => {
    // clear token & user
    setAuthToken(null);
    try {
      if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      // ignore
    }
    setState({ user: null, loading: false });

    // redirect to login page as a convenience
    if (typeof window !== "undefined") {
      router.push(ROUTES.LOGIN_PAGE);
    }
  };

  const value = useMemo(
    () => ({
      user: state.user,
      loading: state.loading,
      signIn,
      signOut,
      setUser,
    }),
    [state.user, state.loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
