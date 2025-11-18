// src/services/apiClient.ts
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import ROUTES from "@/src/utils/routes";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15_000,
});

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

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // network-level
    if (!error.response) {
      return Promise.reject(new Error("Network error. Please try again."));
    }

    const status = error.response.status;
    const data = error.response.data as any;

    // extract canonical message (server should return { message, success, errors? })
    let serverMessage: string | null = null;
    if (data) {
      if (typeof data === "string") serverMessage = data;
      else serverMessage = data.message || data.msg || data.error || null;
    }
    serverMessage =
      serverMessage || error.response.statusText || "An error occurred";

    // IMPORTANT: do NOT auto-redirect on 401 here.
    // Instead return a rejected Error and let the page decide what to do.
    // (If you want an automatic redirect specifically for token-expiry only,
    //  have the server include a specific flag in the response and check it here.)
    return Promise.reject(new Error(String(serverMessage)));
  }
);

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
