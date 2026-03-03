/**
 * Returns client session display info from localStorage (clientData).
 * Used by CountPageHeader to pass displayName and roleLabel to ProfileCard.
 */

import { ROLE_LABELS } from "@/src/constants/roles";
import { Role } from "@/src/constants/roles";
import { useEffect, useState } from "react";

const CLIENT_DATA_KEY = "clientData";

export interface ClientSessionDisplay {
  displayName: string;
  roleLabel: string;
}

export function useClientSession(): ClientSessionDisplay | null {
  const [session, setSession] = useState<ClientSessionDisplay | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(CLIENT_DATA_KEY);
      if (!raw) {
        setSession(null);
        return;
      }
      const data = JSON.parse(raw) as {
        firstname?: string;
        lastname?: string;
        email?: string;
        role?: Role;
      };
      const first = data.firstname ?? "";
      const last = data.lastname ?? "";
      const displayName =
        [first, last].filter(Boolean).join(" ").trim() || data.email || "Client";
      const roleLabel =
        data.role === Role.Admin || data.role === Role.Client
          ? ROLE_LABELS[data.role]
          : ROLE_LABELS[Role.Client];
      setSession({ displayName, roleLabel });
    } catch {
      setSession(null);
    }
  }, []);

  return session;
}
