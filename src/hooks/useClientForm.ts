// src/hooks/useClientForm.ts
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";

import * as clientsService from "@/services/clientsService"; // still attempted first
import { Client } from "../types";
import ROUTES from "../utils/routes";

type FormValues = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
};

const LOCAL_CLIENTS_KEY = (userId: string) => `clients_${userId}`;

export function useClientForm() {
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);
  const [adminLoginUrl, setAdminLoginUrl] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);

  // Helper: read clients from localStorage for given user id
  const readLocalClients = (userId: string) => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem(LOCAL_CLIENTS_KEY(userId))
          : null;
      return raw ? (JSON.parse(raw) as Client[]) : [];
    } catch (err) {
      console.error("Failed to read local clients:", err);
      return [];
    }
  };

  // Helper: write clients to localStorage for given user id
  const writeLocalClients = (userId: string, list: Client[]) => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(LOCAL_CLIENTS_KEY(userId), JSON.stringify(list));
      }
    } catch (err) {
      console.error("Failed to save local clients:", err);
    }
  };

  // Fetch clients and build admin Login URL
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      // Attempt to get current user from service; fall back to local user if not available
      let user: { id: string } | null = null;
      try {
        const { data: userData, error: userErr } =
          await clientsService.getCurrentUser();
        const svcUser = userData?.user ?? null;
        if (!userErr && svcUser) {
          user = { id: String(svcUser.id) };
        }
      } catch (err) {
        // service not available / error — ignore and fallback
        console.warn(
          "clientsService.getCurrentUser not available, using local fallback"
        );
      }

      if (!user) {
        // local fallback
        user = { id: "local-admin" }; // deterministic id for localStorage key
      }

      // set user id so other operations can reuse it
      setCurrentUserId(user.id);

      // Set adminLoginUrl using user id
      if (typeof window !== "undefined") {
        setAdminLoginUrl(`${window.location.origin}/login/${user.id}`);
      }

      // Try to fetch from service; otherwise read from localStorage
      let fetchedClients: Client[] = [];
      try {
        const { data, error } = await clientsService.fetchClientsForUser(
          user.id
        );
        if (!error && data) {
          fetchedClients = data;
        } else {
          fetchedClients = readLocalClients(user.id);
        }
      } catch (err) {
        // service not available — fall back to localStorage
        fetchedClients = readLocalClients(user.id);
      }

      if (mounted) {
        setClients(fetchedClients ?? []);
      }
    };

    load();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Formik for the Add/Edit Client form
  const formik = useFormik<FormValues>({
    initialValues: {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().required("Required"),
      firstname: Yup.string().required("Required"),
      lastname: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      // ensure we have a user id (fallback to local-admin)
      const userId = currentUserId ?? "local-admin";

      // If editing, attempt update flow
      if (editingClientId) {
        // try service update first
        try {
          // attempt a service update method - name may vary in your service
          // we try updateClientForUser(userId, editingClientId, values)
          if ((clientsService as any).updateClientForUser) {
            const { data, error } = await (
              clientsService as any
            ).updateClientForUser(userId, editingClientId, values);
            if (!error && data) {
              // <-- FIX: build 'next', write to localStorage, and return 'next' from setClients
              setClients((prev) => {
                const next = prev.map((c) =>
                  c.clientid === editingClientId ? data : c
                );
                writeLocalClients(userId, next); // pass the array, not a function
                return next; // return new state array
              });
              resetForm();
              setEditingClientId(null);
              return;
            }
          }
        } catch (err) {
          // service not available — fallback to local update below
        }

        // Local fallback: update local state & localStorage
        setClients((prev) => {
          const next = prev.map((c) =>
            c.clientid === editingClientId ? { ...c, ...values } : c
          );
          writeLocalClients(userId, next); // <-- FIX: pass array here
          return next; // <-- return next array
        });
        resetForm();
        setEditingClientId(null);
        return;
      }

      // Not editing -> create new client
      // Try to add via service; if not available, add to localStorage
      try {
        const { data, error } = await clientsService.addClientForUser(
          userId,
          values
        );
        if (!error && data) {
          setClients((prev) => {
            const next = [...prev, data];
            writeLocalClients(userId, next);
            return next;
          });
          resetForm();
          return;
        }
      } catch (err) {
        // service not available — fallback below
      }

      // Fallback: create a client object locally and persist to localStorage
      const newClient: Client = {
        id: `local_${Date.now()}`,
        clientid: `local_${Date.now()}`,
        email: values.email,
        password: values.password,
        firstname: values.firstname,
        lastname: values.lastname,
      };

      setClients((prev) => {
        const next = [...prev, newClient];
        writeLocalClients(userId, next);
        return next;
      });
      resetForm();
    },
  });

  // Initiate edit: populate form with client data and set editing id
  const initiateEdit = useCallback(
    (client: Client) => {
      formik.setValues({
        firstname: client.firstname ?? "",
        lastname: client.lastname ?? "",
        email: client.email ?? "",
        password: client.password ?? "",
      });
      setEditingClientId(client.clientid ?? client.email ?? null);
      // scroll to form (optional)
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [formik]
  );

  const cancelEdit = useCallback(() => {
    formik.resetForm();
    setEditingClientId(null);
  }, [formik]);

  // Delete client
  const deleteClient = useCallback(
    async (clientId: string) => {
      if (!clientId) return;
      const userId = currentUserId ?? "local-admin";
      const confirmed =
        typeof window !== "undefined"
          ? window.confirm("Delete this client?")
          : true;
      if (!confirmed) return;

      // try service delete first (name may vary)
      try {
        if ((clientsService as any).deleteClientForUser) {
          const { error } = await (clientsService as any).deleteClientForUser(
            userId,
            clientId
          );
          if (!error) {
            setClients((prev) => {
              const next = prev.filter((c) => c.clientid !== clientId);
              writeLocalClients(userId, next);
              return next;
            });
            return;
          }
        }
      } catch (err) {
        // ignore and fallback
      }

      // fallback: remove from local state & storage
      setClients((prev) => {
        const next = prev.filter((c) => c.clientid !== clientId);
        writeLocalClients(userId, next);
        return next;
      });
    },
    [currentUserId]
  );

  const handleSignOut = useCallback(async () => {
    // try service sign out; otherwise clear local storage for fallback user and redirect
    try {
      const { error } = await clientsService.signOut();
      if (!error) {
        router.push(ROUTES.LOGIN_PAGE);
        return;
      }
    } catch (err) {
      // fallback behaviour
      // clear local fallback and redirect
      try {
        if (typeof window !== "undefined") {
          // remove local-admin clients and any other local keys you used
          localStorage.removeItem(LOCAL_CLIENTS_KEY("local-admin"));
        }
      } catch (e) {
        // ignore
      }
      router.push(ROUTES.LOGIN_PAGE);
    }
  }, [router]);

  return {
    clients,
    adminLoginUrl,
    formik,
    handleSignOut,
    setClients,
    // new exports
    deleteClient,
    initiateEdit,
    cancelEdit,
    editingClientId,
  };
}

export default useClientForm;
