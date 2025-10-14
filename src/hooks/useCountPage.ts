// src/hooks/useCountPage.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/src/utils/supabaseClient";

export interface ClientData {
  clientid: string;
  [k: string]: any;
}

export type UseCountPageReturn = {
  count: number;
  clientData: ClientData | null;
  loadingCount: boolean;
  loadingAction: boolean;
  showModal: boolean;
  infoMode: boolean;
  error: string | null;

  // actions
  openInfoModal: () => void;
  openConfirmModal: () => void;
  closeModal: () => void;
  increment: () => Promise<void>;
  confirmDecrement: () => Promise<void>;
  signOut: () => void;
  refresh: () => Promise<void>;
};

export default function useCountPage(
  adminid?: string | string[] | undefined
): UseCountPageReturn {
  const [count, setCount] = useState<number>(0);
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [loadingCount, setLoadingCount] = useState<boolean>(false);
  const [loadingAction, setLoadingAction] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [infoMode, setInfoMode] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const adminIdStr = Array.isArray(adminid) ? adminid[0] : adminid;

  // helpers for today's ISO bounds (UTC-safe)
  const todayBounds = useMemo(() => {
    const now = new Date();
    // build YYYY-MM-DD using local date to preserve "resets at midnight" semantics
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const date = `${yyyy}-${mm}-${dd}`;
    const start = `${date}T00:00:00.000Z`;
    const end = `${date}T23:59:59.999Z`;
    return { start, end };
  }, []);

  const loadClientDataFromStorage = useCallback(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("clientData")
          : null;
      if (!raw) return null;
      return JSON.parse(raw) as ClientData;
    } catch (err) {
      console.error("Failed to read clientData from localStorage", err);
      return null;
    }
  }, []);

  const fetchCount = useCallback(async () => {
    if (!adminIdStr) return;
    setLoadingCount(true);
    setError(null);

    try {
      // Request with count metadata. supabase may return count or data length; support both.
      const {
        data,
        error,
        count: supaCount,
      } = await supabase
        .from("count")
        .select("*", { count: "exact" })
        .eq("adminid", adminIdStr)
        .gte("created_at", todayBounds.start)
        .lte("created_at", todayBounds.end);

      if (error) {
        console.error("Failed fetching count:", error);
        setError("Failed to fetch count");
        setCount(0);
      } else {
        if (typeof supaCount === "number") {
          setCount(supaCount);
        } else {
          setCount(Array.isArray(data) ? data.length : 0);
        }
      }
    } catch (err) {
      console.error("Exception fetching count:", err);
      setError("Failed to fetch count");
    } finally {
      setLoadingCount(false);
    }
  }, [adminIdStr, todayBounds]);

  // initialize clientData & fetch count
  useEffect(() => {
    const cd = loadClientDataFromStorage();
    setClientData(cd);
  }, [loadClientDataFromStorage]);

  // fetch count whenever admin id changes
  useEffect(() => {
    if (!adminIdStr) return;
    fetchCount();
  }, [adminIdStr, fetchCount]);

  const openInfoModal = useCallback(() => {
    setInfoMode(true);
    setShowModal(true);
  }, []);

  const openConfirmModal = useCallback(() => {
    setInfoMode(false);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const increment = useCallback(async () => {
    if (!clientData || !adminIdStr) {
      setError("Missing client or admin information.");
      return;
    }
    setLoadingAction(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("count")
        .insert([{ adminid: adminIdStr, clientid: clientData.clientid }]);

      if (error) {
        console.error("Error inserting count entry:", error);
        setError("Failed to create entry");
      } else {
        // optimistic increment; re-fetch is still safe but not required
        setCount((prev) => prev + 1);
      }
    } catch (err) {
      console.error("Exception during increment:", err);
      setError("Failed to create entry");
    } finally {
      setLoadingAction(false);
    }
  }, [adminIdStr, clientData]);

  const confirmDecrement = useCallback(async () => {
    if (!clientData || !adminIdStr) {
      setError("Missing client or admin information.");
      return;
    }
    setLoadingAction(true);
    setError(null);

    try {
      // get most recent entry for today
      const { data, error } = await supabase
        .from("count")
        .select("countid")
        .eq("adminid", adminIdStr)
        .gte("created_at", todayBounds.start)
        .lte("created_at", todayBounds.end)
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching latest entry:", error);
        setError("Failed to find an entry to delete");
        return;
      }

      if (!data || data.length === 0) {
        setError("No entries found to delete");
        return;
      }

      const countid = (data as any)[0].countid;

      const { error: deleteError } = await supabase
        .from("count")
        .delete()
        .eq("countid", countid);

      if (deleteError) {
        console.error("Error deleting count entry:", deleteError);
        setError("Failed to delete entry");
      } else {
        setCount((prev) => Math.max(prev - 1, 0));
        setShowModal(false);
      }
    } catch (err) {
      console.error("Exception during decrement:", err);
      setError("Failed to delete entry");
    } finally {
      setLoadingAction(false);
    }
  }, [adminIdStr, clientData, todayBounds]);

  const signOut = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("clientData");
      }
    } catch (err) {
      console.error("Error clearing clientData:", err);
    }
    // client-side redirect handled by page component (we just clear storage here)
  }, []);

  const refresh = useCallback(async () => {
    await fetchCount();
  }, [fetchCount]);

  return {
    count,
    clientData,
    loadingCount,
    loadingAction,
    showModal,
    infoMode,
    error,
    openInfoModal,
    openConfirmModal,
    closeModal,
    increment,
    confirmDecrement,
    signOut,
    refresh,
  };
}
