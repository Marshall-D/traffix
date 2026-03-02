// src/hooks/useForgotPassword.ts
import { useCallback, useMemo, useRef, useState } from "react";
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import {
  validateHasLetter,
  validateHasNumber,
  validateMinLength,
} from "@/src/utils/helpers";

export type ForgotFormValues = {
  email: string;
};

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Please enter your email"),
});

// configure OTP length in one place
export const OTP_LENGTH = 4;

export default function useForgotPassword(initialEmail = "") {
  //
  // Email / send-verification form state (existing)
  //
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
        // TODO: Call your real API when forgot-password endpoint is ready.

        // simulate success -> clear form
        helpers.resetForm();
      } catch (err: any) {
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

  //
  // OTP state + handlers (moved from verify page)
  //
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));

  const isOtpComplete = useMemo(() => otp.every((c) => c !== ""), [otp]);

  const focusInput = (index: number) => {
    const el = inputsRef.current[index];
    if (el) el.focus();
  };

  const handleOtpChange = (val: string, i: number) => {
    const char = val.replace(/\D/g, "").slice(0, 1);
    const newOtp = [...otp];
    newOtp[i] = char ?? "";
    setOtp(newOtp);
    if (char && i < OTP_LENGTH - 1) focusInput(i + 1);
  };

  const handleOtpKeyDown = (key: string, i: number) => {
    if (key === "Backspace") {
      if (otp[i]) {
        const newOtp = [...otp];
        newOtp[i] = "";
        setOtp(newOtp);
      } else if (i > 0) {
        focusInput(i - 1);
        const newOtp = [...otp];
        newOtp[i - 1] = "";
        setOtp(newOtp);
      }
    } else if (key === "ArrowLeft" && i > 0) {
      focusInput(i - 1);
    } else if (key === "ArrowRight" && i < OTP_LENGTH - 1) {
      focusInput(i + 1);
    }
  };

  const handleOtpPaste = (pasteText: string) => {
    const paste = pasteText.replace(/\s/g, "");
    const digits = paste.replace(/\D/g, "").slice(0, OTP_LENGTH).split("");
    if (digits.length === 0) return;
    const newOtp = Array(OTP_LENGTH)
      .fill("")
      .map((_, idx) => digits[idx] ?? "");
    setOtp(newOtp);
    const firstEmpty = newOtp.findIndex((c) => c === "");
    focusInput(firstEmpty === -1 ? OTP_LENGTH - 1 : firstEmpty);
  };

  const verifyOtp = async () => {
    if (!isOtpComplete) return { success: false, message: "Incomplete code" };
    const code = otp.join("");
    try {
      // TODO: call verify API with 'code'
      // example: await api.verifyResetCode(code)
      // on success:
      return { success: true, code };
    } catch (err: any) {
      return { success: false, message: err?.message ?? "Verification failed" };
    }
  };

  //
  // Reset password state + handlers (moved from reset page)
  //
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);
  const hasMinLength = validateMinLength(password, 8);
  const hasLetter = validateHasLetter(password);
  const hasNumber = validateHasNumber(password);
  const allValid = hasMinLength && hasLetter && hasNumber;
  const passwordsMatch = password !== "" && password === confirm;
  const canReset = allValid && passwordsMatch;

  const resetPassword = async () => {
    if (!canReset)
      return { success: false, message: "Invalid password or mismatch" };
    try {
      // TODO: call reset API with the new password (and token if needed)
      // example:
      // await api.resetPassword({ password, token });
      // Simulate success:
      setPassword("");
      setConfirm("");
      setResetError(null);
      return { success: true };
    } catch (err: any) {
      const message = err?.message ?? "Reset failed";
      setResetError(message);
      return { success: false, message };
    }
  };

  return {
    // email form
    formik,
    isSelected,
    error,
    handleClick,

    // otp
    OTP_LENGTH,
    otp,
    inputsRef,
    isOtpComplete,
    focusInput,
    handleOtpChange,
    handleOtpKeyDown,
    handleOtpPaste,
    verifyOtp,

    // reset
    password,
    confirm,
    setPassword,
    setConfirm,
    showPassword,
    setShowPassword,
    showConfirm,
    setShowConfirm,
    hasMinLength,
    hasLetter,
    hasNumber,
    passwordsMatch,
    allValid,
    canReset,
    resetPassword,
    resetError,
  } as const;
}
