// src/hooks/useClientForm.ts
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";

import * as clientsService from "@/src/services/clientsService";
import { Client } from "../types";

type FormValues = {
  email: string;
  password: string;
  firstname: string;
  lastname: string;
};

export function useClientForm() {
  const router = useRouter();

  const [clients, setClients] = useState<Client[]>([]);
  const [adminLoginUrl, setAdminLoginUrl] = useState<string | null>(null);

  // Fetch clients and build admin Login URL
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const { data: userData, error: userErr } =
        await clientsService.getCurrentUser();
      const user = userData?.user ?? null;

      if (userErr || !user) {
        // couldn't fetch user — keep silence and return (component may show nothing)
        console.error("Error fetching user:", userErr?.message ?? userErr);
        return;
      }

      // Set dynamic login url
      if (typeof window !== "undefined") {
        setAdminLoginUrl(`${window.location.origin}/login/${user.id}`);
      }

      // Fetch clients
      const { data, error } = await clientsService.fetchClientsForUser(user.id);
      if (error) {
        console.error("Error fetching clients:", error?.message ?? error);
        return;
      }

      if (mounted) setClients(data ?? []);
    };

    load();

    return () => {
      mounted = false;
    };
  }, []);

  // Formik for the Add Client form (same validation & behaviour as original)
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
      const { data: userData, error: userErr } =
        await clientsService.getCurrentUser();
      const user = userData?.user ?? null;

      if (userErr || !user) {
        console.error("Error fetching user: ", userErr?.message ?? userErr);
        return;
      }

      const { data, error } = await clientsService.addClientForUser(
        user.id,
        values
      );

      if (error) {
        console.error("Error adding client: ", error);
      } else if (data) {
        setClients((prev) => [...prev, data]);
        resetForm();
      }
    },
  });

  const handleSignOut = useCallback(async () => {
    const { error } = await clientsService.signOut();
    if (!error) {
      router.push("/login");
    } else {
      console.error("Error signing out:", error);
    }
  }, [router]);

  return {
    clients,
    adminLoginUrl,
    formik,
    handleSignOut,
    // allow parent to mutate clients if needed (integration)
    setClients,
  };
}

export default useClientForm;
