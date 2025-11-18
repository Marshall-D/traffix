// src/services/apiClient.ts
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import ROUTES from "@/src/utils/routes";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Axios instance for all API calls
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15_000,
});

/**
 * Request interceptor:
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers = config.headers ?? {};
        (config.headers as Record<string, string>)[
          "Authorization"
        ] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response interceptor:
 * - Build a friendly message from common shapes returned by servers:
 *   { message }, { error }, { msg }, { errors: [...] }, { detail }, or plain string body.
 * - For 401 we clear token and redirect.
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Network error
    if (!error.response) {
      return Promise.reject(new Error("Network error. Please try again."));
    }

    const status = error.response.status;

    if (status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = ROUTES.LOGIN_PAGE;
      }
      return Promise.reject(new Error("Unauthorized. Please login again."));
    }

    // Extract server message from multiple possible shapes
    const data = error.response.data as any;

    let serverMessage: string | null = null;

    if (!data) {
      serverMessage = error.response.statusText || "An error occurred";
    } else if (typeof data === "string") {
      // server returned plain string
      serverMessage = data;
    } else if (typeof data === "object") {
      // common fields
      serverMessage =
        data.msg ||
        data.message ||
        data.error ||
        (Array.isArray(data.errors) &&
          data.errors.length > 0 &&
          (data.errors[0].message || data.errors[0])) ||
        data.detail ||
        null;
    }

    // fallback to statusText or generic
    serverMessage =
      serverMessage || error.response.statusText || "An error occurred";

    // optional: log for debugging
    // console.error("[apiClient] HTTP error", { status, body: data, message: serverMessage });

    return Promise.reject(new Error(String(serverMessage)));
  }
);

/**
 * Helper to set token programmatically
 */
export function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("token", token);
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    localStorage.removeItem("token");
    delete apiClient.defaults.headers.common["Authorization"];
  }
}

export default apiClient;
