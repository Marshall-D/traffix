// src/hooks/useClientForm.ts
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";

import * as clientsService from "@/services/clientsService";
import { Client } from "../types";
import ROUTES from "../utils/routes";

type FormValues = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
};

function getErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong.";
}

export function useClientForm() {
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);
  const [adminLoginUrl, setAdminLoginUrl] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [editingClientId, setEditingClientId] = useState<string | null>(null);

  // Fetch clients when admin is logged in; build admin login URL
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      let user: { id: string } | null = null;
      try {
        const { data: userData, error: userErr } =
          await clientsService.getCurrentUser();
        const svcUser = userData?.user ?? null;
        if (!userErr && svcUser?.id) {
          user = { id: String(svcUser.id) };
        }
      } catch {
        // ignore
      }

      setCurrentUserId(user?.id ?? null);

      if (typeof window !== "undefined") {
        setAdminLoginUrl(
          user
            ? `${window.location.origin}/login/${user.id}`
            : `${window.location.origin}${ROUTES.LOGIN_PAGE}`
        );
      }

      if (!user) {
        setClients([]);
        return;
      }

      try {
        const { data, error } = await clientsService.fetchClientsForUser(
          user.id
        );
        if (mounted) {
          if (error) {
            toast.error(getErrorMessage(error));
            setClients([]);
          } else {
            setClients(Array.isArray(data) ? data : []);
          }
        }
      } catch (err) {
        if (mounted) {
          toast.error(getErrorMessage(err));
          setClients([]);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
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
      const userId = currentUserId;
      if (!userId) {
        toast.error("Please log in as admin to manage clients.");
        return;
      }

      if (editingClientId) {
        try {
          const { data, error } = await clientsService.updateClientForUser(
            userId,
            editingClientId,
            values
          );
          if (error) {
            toast.error(getErrorMessage(error));
            return;
          }
          if (data) {
            setClients((prev) =>
              prev.map((c) =>
                c.clientid === editingClientId ? data : c
              )
            );
            toast.success("Client updated successfully.");
            resetForm();
            setEditingClientId(null);
          }
        } catch (err) {
          toast.error(getErrorMessage(err));
        }
        return;
      }

      try {
        const { data, error } = await clientsService.addClientForUser(
          userId,
          values
        );
        if (error) {
          toast.error(getErrorMessage(error));
          return;
        }
        if (data) {
          setClients((prev) => [...prev, data]);
          toast.success("Client added successfully.");
          resetForm();
        }
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
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
      const userId = currentUserId;
      if (!userId) {
        toast.error("Please log in as admin to manage clients.");
        return;
      }
      const confirmed =
        typeof window !== "undefined"
          ? window.confirm("Delete this client?")
          : true;
      if (!confirmed) return;

      try {
        const { error } = await clientsService.deleteClientForUser(
          userId,
          clientId
        );
        if (error) {
          toast.error(getErrorMessage(error));
          return;
        }
        setClients((prev) => prev.filter((c) => c.clientid !== clientId));
        toast.success("Client deleted.");
      } catch (err) {
        toast.error(getErrorMessage(err));
      }
    },
    [currentUserId]
  );

  const handleSignOut = useCallback(() => {
    router.push(ROUTES.LOGIN_PAGE);
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
