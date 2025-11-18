// src/services/apiClient.ts
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import ROUTES from "@/src/utils/routes";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

// const API_BASE = "https://traffix-backend-0wh6.onrender.com";
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
 * - typed as InternalAxiosRequestConfig to satisfy axios types
 * - ensure headers exist before writing Authorization
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        // ensure headers exists and is an object
        // InternalAxiosRequestConfig.headers is non-nullable, but runtime could be undefined
        config.headers = config.headers ?? {};
        // config.headers has complex types in Axios; cast to Record<string, string> to set our header
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
 * - centralizes handling of network errors and 401
 * - returns a rejected Error with friendly message
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (!error.response) {
      return Promise.reject(new Error("Network error. Please try again."));
    }

    const status = error.response.status;

    if (status === 401) {
      // Clear token and redirect to login on client
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = ROUTES.LOGIN_PAGE;
      }
      return Promise.reject(new Error("Unauthorized. Please login again."));
    }

    // Prefer server message if present
    const serverMessage =
      (error.response.data &&
        (error.response.data.message || error.response.data.error)) ||
      error.response.statusText ||
      "An error occurred";

    return Promise.reject(new Error(serverMessage));
  }
);

/**
 * Helper to set token programmatically (e.g. after login/signup)
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
