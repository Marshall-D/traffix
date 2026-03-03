/**
 * Clients service – uses backend REST API.
 * GET/POST/PATCH /api/v1/clients (admin JWT), POST /api/v1/auth/client-login (no JWT).
 */

import { Role } from "@/src/constants/roles";
import { Client } from "../src/types";
import apiClient from "./apiClient";

const AUTH_STORAGE_KEY = "traffix_auth";

/** Map backend response (firstName, lastName) to frontend Client (firstname, lastname). */
function toClient(raw: Record<string, unknown>): Client {
  const roleVal = raw.role;
  const role =
    roleVal === Role.Admin || roleVal === Role.Client
      ? roleVal
      : undefined;
  return {
    id: String(raw.id ?? raw.admin ?? ""),
    clientid: raw.clientid != null ? String(raw.clientid) : undefined,
    email: String(raw.email ?? ""),
    firstname: String((raw.firstname ?? raw.firstName) ?? ""),
    lastname: String((raw.lastname ?? raw.lastName) ?? ""),
    password: raw.password != null ? String(raw.password) : undefined,
    role: role ?? Role.Client,
    created_at: raw.created_at != null ? String(raw.created_at) : undefined,
  };
}

/**
 * Returns current admin user from auth storage (traffix_auth).
 * Used so user-management can resolve adminId.
 */
export async function getCurrentUser(): Promise<{
  data: { user: { id: string } | null };
  error: unknown;
}> {
  try {
    if (typeof window === "undefined") {
      return { data: { user: null }, error: null };
    }
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return { data: { user: null }, error: null };
    const parsed = JSON.parse(raw) as {
      user?: { userId?: string; _id?: string; email?: string };
    };
    const user = parsed?.user;
    if (!user) return { data: { user: null }, error: null };
    const id = user.userId ?? user._id ?? user.email ?? "";
    return { data: { user: { id } }, error: null };
  } catch (error) {
    return { data: { user: null }, error };
  }
}

/**
 * Client login: POST /api/v1/auth/client-login
 * Body: email, password, adminId. No auth header required.
 */
export async function clientLogin(
  adminId: string,
  email: string,
  password: string
): Promise<{ data: Client | null; error: unknown }> {
  try {
    const res = await apiClient.post("/api/v1/auth/client-login", {
      email: email.trim(),
      password,
      adminId,
    });
    console.log("[client-login] backend response:", res.data);
    const body = res.data as { client?: Record<string, unknown> };
    const clientRaw = body?.client ?? body;
    if (!clientRaw || typeof clientRaw !== "object") {
      return { data: null, error: new Error("Invalid response") };
    }
    return {
      data: toClient(clientRaw as Record<string, unknown>),
      error: null,
    };
  } catch (err: unknown) {
    return { data: null, error: err };
  }
}

/**
 * List clients: GET /api/v1/clients (admin from JWT).
 */
export async function fetchClientsForUser(
  _adminId: string
): Promise<{ data: Client[] | null; error: unknown }> {
  try {
    const res = await apiClient.get("/api/v1/clients");
    const body = res.data as { clients?: unknown[] };
    const arr = Array.isArray(body?.clients) ? body.clients : [];
    const data = arr.map((c) => toClient((c ?? {}) as Record<string, unknown>));
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err };
  }
}

/**
 * Create client: POST /api/v1/clients
 * Body: email, firstName, lastName, password. Admin from JWT.
 */
export async function addClientForUser(
  _adminId: string,
  payload: Omit<Client, "id" | "clientid" | "created_at">
): Promise<{ data: Client | null; error: unknown }> {
  try {
    const res = await apiClient.post("/api/v1/clients", {
      email: payload.email.trim(),
      firstName: payload.firstname,
      lastName: payload.lastname,
      password: payload.password ?? undefined,
      role: Role.Client,
    });
    const body = res.data as { client?: Record<string, unknown> };
    const raw = body?.client ?? body;
    const data = toClient((raw ?? {}) as Record<string, unknown>);
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err };
  }
}

/**
 * Update client: PATCH /api/v1/clients/:clientId
 * Body: optional email, firstName, lastName, password.
 */
export async function updateClientForUser(
  _adminId: string,
  clientId: string,
  payload: Partial<Pick<Client, "email" | "firstname" | "lastname" | "password">>
): Promise<{ data: Client | null; error: unknown }> {
  try {
    const body: Record<string, unknown> = {};
    if (payload.email !== undefined) body.email = payload.email.trim();
    if (payload.firstname !== undefined) body.firstName = payload.firstname;
    if (payload.lastname !== undefined) body.lastName = payload.lastname;
    if (
      payload.password !== undefined &&
      payload.password !== null &&
      String(payload.password).length > 0
    ) {
      body.password = payload.password;
    }

    const res = await apiClient.patch(
      `/api/v1/clients/${encodeURIComponent(clientId)}`,
      body
    );
    const resBody = res.data as { client?: Record<string, unknown> };
    const raw = resBody?.client ?? resBody;
    const data = toClient((raw ?? {}) as Record<string, unknown>);
    return { data, error: null };
  } catch (err: unknown) {
    return { data: null, error: err };
  }
}

/**
 * Delete client: DELETE /api/v1/clients/:clientId
 * Backend may not implement this yet; caller will see error if 404.
 */
export async function deleteClientForUser(
  _adminId: string,
  clientId: string
): Promise<{ error: unknown }> {
  try {
    await apiClient.delete(
      `/api/v1/clients/${encodeURIComponent(clientId)}`
    );
    return { error: null };
  } catch (err: unknown) {
    return { error: err };
  }
}

export async function signOut(): Promise<{ error: unknown }> {
  return { error: null };
}
