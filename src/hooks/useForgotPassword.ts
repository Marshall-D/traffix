// src/hooks/useForgotPassword.ts
import { useCallback, useState } from "react";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { supabase } from "@/src/utils/supabaseClient";

/**
 * Hook that encapsulates forgot-password form logic and UI state.
 * Keeps the component focused on rendering.
 */

export type ForgotFormValues = {
  email: string;
};

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Please enter your email"),
});

export default function useForgotPassword(initialEmail = "") {
  const [isSelected, setIsSelected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = useCallback(() => {
    setIsSelected(true);
    window.setTimeout(() => setIsSelected(false), 200);
  }, []);

  const onSubmit = useCallback(
    async (
      values: ForgotFormValues,
      helpers: FormikHelpers<ForgotFormValues>
    ) => {
      setError(null);
      try {
        // Example placeholder: call your backend / supabase here.
        // This is intentionally a placeholder so you can wire your real API.
        // const { error: supabaseError } = await supabase.auth.resetPasswordForEmail(values.email);
        // if (supabaseError) throw supabaseError;

        // For now, simulate success by clearing the form:
        helpers.resetForm();
      } catch (err: any) {
        // Map error to string to show in UI
        setError(err?.message ?? "An unexpected error occurred");
      }
    },
    []
  );

  const formik = useFormik<ForgotFormValues>({
    enableReinitialize: true,
    initialValues: { email: initialEmail },
    validationSchema: schema,
    onSubmit,
  });

  return {
    formik,
    isSelected,
    error,
    handleClick,
  } as const;
}
