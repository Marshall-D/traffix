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

  // YYYY-MM-DD for today (local); backend uses UTC for the day
  const todayDateStr = useMemo(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
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
        date: todayDateStr,
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
  }, [adminIdStr, todayDateStr]);

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

    const clientId = clientData.clientid ?? (clientData as any).clientId;
    if (!clientId) {
      toast.error("Missing client id.");
      setLoadingAction(false);
      return;
    }

    try {
      const { error: decError } = await countService.decrementCount(
        adminIdStr,
        clientId,
        todayDateStr
      );

      if (decError) {
        const msg = decError.message || "Failed to delete entry";
        setError(msg);
        toast.error(msg);
      } else {
        setCount((prev) => Math.max(prev - 1, 0));
        setShowModal(false);
        toast.success("Entry removed");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete entry";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoadingAction(false);
    }
  }, [adminIdStr, clientData, todayDateStr]);

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
