// src/hooks/useCountPage.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import * as countService from "@/services/countService";

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
      const result = await countService.getTodayCount(adminIdStr, {
        startIso: todayBounds.start,
        endIso: todayBounds.end,
      });

      if (result.error) {
        console.error("Failed fetching count:", result.error);
        setError("Failed to fetch count");
        setCount(0);
      } else {
        setCount(result.count);
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
      toast.error("Missing client or admin information.");
      return;
    }
    setLoadingAction(true);
    setError(null);

    try {
      const clientId = clientData.clientid ?? (clientData as any).clientId;
      const { data, error } = await countService.incrementCount(
        adminIdStr,
        clientId
      );

      if (error) {
        console.error("Error inserting count entry:", error);
        setError("Failed to create entry");
        toast.error("Failed to create entry");
      } else if (data) {
        setCount((prev) => prev + 1);
        toast.success("Entry added");
      }
    } catch (err) {
      console.error("Exception during increment:", err);
      setError("Failed to create entry");
      toast.error("Failed to create entry");
    } finally {
      setLoadingAction(false);
    }
  }, [adminIdStr, clientData]);

  const confirmDecrement = useCallback(async () => {
    if (!clientData || !adminIdStr) {
      setError("Missing client or admin information.");
      toast.error("Missing client or admin information.");
      return;
    }
    setLoadingAction(true);
    setError(null);

    try {
      const { data, error } = await countService.getLatestEntryForToday(
        adminIdStr,
        { startIso: todayBounds.start, endIso: todayBounds.end }
      );

      if (error) {
        console.error("Error fetching latest entry:", error);
        setError("Failed to find an entry to delete");
        toast.error("Failed to find an entry to delete");
        return;
      }

      if (!data?.countId) {
        setError("No entries found to delete");
        toast.error("No entries found to delete");
        return;
      }

      const { error: deleteError } = await countService.deleteCountEntry(
        adminIdStr,
        data.countId
      );

      if (deleteError) {
        console.error("Error deleting count entry:", deleteError);
        setError("Failed to delete entry");
        toast.error("Failed to delete entry");
      } else {
        setCount((prev) => Math.max(prev - 1, 0));
        setShowModal(false);
        toast.success("Entry removed");
      }
    } catch (err) {
      console.error("Exception during decrement:", err);
      setError("Failed to delete entry");
      toast.error("Failed to delete entry");
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
