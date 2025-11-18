// src/services/authService.ts
import { SignUpValues } from "@/src/types/auth";
import apiClient, { setAuthToken } from "./apiClient";

/**
 * Register endpoint wrapper.
 * Returns: { success: boolean, token?: string, message?: string }
 */
export async function signUp(values: SignUpValues) {
  // backend expects firstName, lastName, email, password
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

    if (data.token) {
      // persist token for future requests
      setAuthToken(data.token);
    }

    return {
      ok: data.success ?? true,
      token: data.token ?? null,
      message: data.message ?? null,
    };
  } catch (err: unknown) {
    // caller will handle error message
    throw err;
  }
}
