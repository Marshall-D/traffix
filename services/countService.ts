/**
 * Count service (stub implementation using localStorage).
 * Replace with REST API calls when backend endpoints are ready.
 */

const STORAGE_KEY_PREFIX = "traffix_counts_";

export type CountEntry = {
  countId: string;
  adminId: string;
  clientId: string;
  created_at: string; // ISO
};

function getStorageKey(adminId: string): string {
  return `${STORAGE_KEY_PREFIX}${adminId}`;
}

function getEntries(adminId: string): CountEntry[] {
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

function saveEntries(adminId: string, entries: CountEntry[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(getStorageKey(adminId), JSON.stringify(entries));
  } catch (e) {
    console.warn("countService: failed to save entries", e);
  }
}

function getDefaultTodayBounds(): { startIso: string; endIso: string } {
  const today = new Date().toISOString().split("T")[0];
  return {
    startIso: `${today}T00:00:00.000Z`,
    endIso: `${today}T23:59:59.999Z`,
  };
}

/**
 * Get today's count for an admin (optionally with custom date range).
 */
export async function getTodayCount(
  adminId: string,
  range?: { startIso: string; endIso: string }
): Promise<{ count: number; error: null } | { count: 0; error: Error }> {
  try {
    const { startIso, endIso } = range ?? getDefaultTodayBounds();
    const entries = getEntries(adminId);
    const inRange = entries.filter(
      (e) => e.created_at >= startIso && e.created_at <= endIso
    );
    return { count: inRange.length, error: null };
  } catch (err) {
    return { count: 0, error: err as Error };
  }
}

/**
 * Add one count entry (increment).
 */
export async function incrementCount(
  adminId: string,
  clientId: string
): Promise<{ data: CountEntry | null; error: Error | null }> {
  try {
    const entries = getEntries(adminId);
    const countId = `cnt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const created_at = new Date().toISOString();
    const entry: CountEntry = { countId, adminId, clientId, created_at };
    entries.push(entry);
    saveEntries(adminId, entries);
    return { data: entry, error: null };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

/**
 * Get the latest count entry for today (for decrement flow).
 */
export async function getLatestEntryForToday(
  adminId: string,
  range?: { startIso: string; endIso: string }
): Promise<{ data: { countId: string } | null; error: Error | null }> {
  try {
    const { startIso, endIso } = range ?? getDefaultTodayBounds();
    const entries = getEntries(adminId);
    const inRange = entries.filter(
      (e) => e.created_at >= startIso && e.created_at <= endIso
    );
    inRange.sort((a, b) => (b.created_at > a.created_at ? 1 : -1));
    const latest = inRange[0];
    return {
      data: latest ? { countId: latest.countId } : null,
      error: null,
    };
  } catch (err) {
    return { data: null, error: err as Error };
  }
}

/**
 * Delete a count entry by id (decrement).
 */
export async function deleteCountEntry(
  adminId: string,
  countId: string
): Promise<{ error: Error | null }> {
  try {
    const entries = getEntries(adminId).filter((e) => e.countId !== countId);
    saveEntries(adminId, entries);
    return { error: null };
  } catch (err) {
    return { error: err as Error };
  }
}
