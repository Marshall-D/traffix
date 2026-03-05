/**
 * Count service – backend REST API.
 * GET /api/v1/counts/today, POST /api/v1/counts (increment), POST /api/v1/counts/decrement.
 * No auth required; frontend sends adminId / clientId.
 * Count resets every day (UTC on server; optional date param YYYY-MM-DD).
 */

import apiClient from "./apiClient";

export type CountEntry = {
  countId: string;
  adminId: string;
  clientId: string;
  created_at: string;
};

/** YYYY-MM-DD for today in local time (for optional date query/body). */
function getTodayDateString(): string {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * GET /api/v1/counts/today?adminId=...&date=YYYY-MM-DD
 * Today's count for that admin. date optional (default: server UTC today).
 */
export async function getTodayCount(
  adminId: string,
  options?: { date?: string }
): Promise<{ count: number; error: null } | { count: 0; error: Error }> {
  try {
    const params: Record<string, string> = { adminId };
    if (options?.date) params.date = options.date;
    const res = await apiClient.get("/api/v1/counts/today", { params });
    const data = res.data as { success?: boolean; count?: number };
    const count = typeof data?.count === "number" ? data.count : 0;
    return { count, error: null };
  } catch (err) {
    return { count: 0, error: err instanceof Error ? err : new Error(String(err)) };
  }
}

/**
 * POST /api/v1/counts – increment (create one count).
 * Body: { adminId, clientId }. Response 201: { success, countId, adminId, clientId, created_at }.
 */
export async function incrementCount(
  adminId: string,
  clientId: string
): Promise<{ data: CountEntry | null; error: Error | null }> {
  try {
    const res = await apiClient.post("/api/v1/counts", { adminId, clientId });
    const data = res.data as {
      countId?: string;
      adminId?: string;
      clientId?: string;
      created_at?: string;
    };
    if (res.status === 201 && data?.countId) {
      return {
        data: {
          countId: String(data.countId),
          adminId: String(data.adminId ?? adminId),
          clientId: String(data.clientId ?? clientId),
          created_at: data.created_at ?? new Date().toISOString(),
        },
        error: null,
      };
    }
    return { data: null, error: new Error("Invalid response") };
  } catch (err) {
    return {
      data: null,
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
}

/**
 * POST /api/v1/counts/decrement – delete latest count for that day.
 * Body: { adminId, clientId, date? }. date = YYYY-MM-DD optional (default: today UTC).
 * 404: No count entry to decrement for this day.
 */
export async function decrementCount(
  adminId: string,
  clientId: string,
  date?: string
): Promise<{ error: Error | null }> {
  try {
    const body: { adminId: string; clientId: string; date?: string } = {
      adminId,
      clientId,
    };
    if (date) body.date = date;
    await apiClient.post("/api/v1/counts/decrement", body);
    return { error: null };
  } catch (err) {
    return {
      error: err instanceof Error ? err : new Error(String(err)),
    };
  }
}
