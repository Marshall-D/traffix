// src/services/authService.ts
import { LoginValues, SignUpValues } from "@/src/types/auth";
import apiClient, { setAuthToken } from "./apiClient";

/**
 * Register endpoint wrapper.
 * Returns: { ok: boolean, token?: string | null, message?: string | null }
 */
export async function signUp(values: SignUpValues) {
  try {
    const resp = await apiClient.post("/api/v1/auth/register", {
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      password: values.password,
    });

    // backend controller returns { success, message, user, token, devOtp? }
    const data = resp.data as {
      success?: boolean;
      token?: string;
      message?: string;
    };

    return {
      ok: data.success ?? true,
      token: data.token ?? null,
      message: data.message ?? null,
    };
  } catch (err: unknown) {
    // Let caller handle the error message; keep service thin.
    throw err;
  }
}

export async function login(values: LoginValues) {
  try {
    const resp = await apiClient.post("/api/v1/auth/login", {
      email: values.email,
      password: values.password,
    });

    const data = resp.data as {
      success?: boolean;
      token?: string;
      message?: string;
    };

    if (data.token) setAuthToken(data.token);

    return {
      ok: data.success ?? true,
      token: data.token ?? null,
      message: data.message ?? null,
    };
  } catch (err: unknown) {
    if (err instanceof Error)
      return { ok: false, token: null, message: err.message };
    return { ok: false, token: null, message: "Login failed" };
  }
}
