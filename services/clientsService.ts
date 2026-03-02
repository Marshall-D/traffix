/**
 * Clients service (stub implementation using localStorage).
 * Replace with REST API calls when backend endpoints are ready.
 */

import { Client } from "../src/types";

const STORAGE_KEY_PREFIX = "traffix_clients_";
const AUTH_STORAGE_KEY = "traffix_auth";

function getStorageKey(adminId: string): string {
  return `${STORAGE_KEY_PREFIX}${adminId}`;
}

function getClients(adminId: string): Client[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(getStorageKey(adminId));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveClients(adminId: string, clients: Client[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getStorageKey(adminId), JSON.stringify(clients));
  } catch (e) {
    console.warn("clientsService: failed to save clients", e);
  }
}

/**
 * Returns current admin user from auth storage (traffix_auth).
 * Used so user-management can resolve adminId when not using Supabase.
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
    const parsed = JSON.parse(raw) as { user?: { userId?: string; _id?: string; email?: string } };
    const user = parsed?.user;
    if (!user) return { data: { user: null }, error: null };
    const id = user.userId ?? user._id ?? user.email ?? "";
    return { data: { user: { id } }, error: null };
  } catch (error) {
    return { data: { user: null }, error };
  }
}

/**
 * Fetch clients for a given admin user id.
 */
export async function fetchClientsForUser(
  adminId: string
): Promise<{ data: Client[] | null; error: unknown }> {
  try {
    const data = getClients(adminId);
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Client login: validate email + password for the given admin and return client.
 */
export async function clientLogin(
  adminId: string,
  email: string,
  password: string
): Promise<{ data: Client | null; error: unknown }> {
  try {
    const clients = getClients(adminId);
    const client = clients.find(
      (c) => c.email === email && (c.password ?? "") === password
    ) ?? null;
    return { data: client, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Insert a new client for the given admin id.
 */
export async function addClientForUser(
  adminId: string,
  payload: Omit<Client, "id" | "clientid" | "created_at">
): Promise<{ data: Client | null; error: unknown }> {
  try {
    const clients = getClients(adminId);
    const clientId = `cli_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const created_at = new Date().toISOString();
    const client: Client = {
      id: adminId,
      clientid: clientId,
      email: payload.email,
      firstname: payload.firstname,
      lastname: payload.lastname,
      password: payload.password ?? null,
      created_at,
    };
    clients.push(client);
    saveClients(adminId, clients);
    return { data: client, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Update an existing client by clientid.
 */
export async function updateClientForUser(
  adminId: string,
  clientId: string,
  payload: Partial<Pick<Client, "email" | "firstname" | "lastname" | "password">>
): Promise<{ data: Client | null; error: unknown }> {
  try {
    const clients = getClients(adminId);
    const index = clients.findIndex(
      (c) => (c.clientid ?? c.email) === clientId
    );
    if (index === -1) return { data: null, error: new Error("Client not found") };
    const updated: Client = {
      ...clients[index],
      ...payload,
    };
    clients[index] = updated;
    saveClients(adminId, clients);
    return { data: updated, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

/**
 * Delete a client by clientid.
 */
export async function deleteClientForUser(
  adminId: string,
  clientId: string
): Promise<{ error: unknown }> {
  try {
    const clients = getClients(adminId).filter(
      (c) => (c.clientid ?? c.email) !== clientId
    );
    saveClients(adminId, clients);
    return { error: null };
  } catch (error) {
    return { error };
  }
}

/**
 * Sign out (no-op for stub; kept for API compatibility).
 */
export async function signOut(): Promise<{ error: unknown }> {
  return { error: null };
}
