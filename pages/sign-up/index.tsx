// pages/sign-up/index.tsx
import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useFormik } from "formik";

import logo from "@/src/assets/logo-new.png";
import logoSmall from "@/src/assets/logo-small.png";
import { mdiEmailOutline, mdiKeyOutline } from "@mdi/js";
import { Input } from "@/src/components/input";
import { Button } from "@/src/components/button";
import ROUTES from "@/src/utils/routes";
import useSignUp from "@/src/hooks/useSignUp";
import type { SignUpValues } from "@/src/types/auth";
import { signUpSchema } from "@/src/types/validation";

/** Presentational component */
function SignUpView({
  formik,
  loading,
  serverError,
  onQuickSignUp,
}: {
  formik: ReturnType<typeof useFormik<SignUpValues>>;
  loading: boolean;
  serverError: string | null;
  onQuickSignUp: () => void;
}) {
  return (
    <div className="md:grid md:grid-cols-2 md:h-screen">
      {/* left panel uses theme color primary.light from tailwind.config */}
      <div className="hidden md:block bg-primary-light" />

      {/* right panel uses theme white2 (configured in tailwind.config) */}
      <main id="right-side" className="bg-white2 flex flex-col items-center">
        <div className="hidden md:block my-24 w-[131px] h-[51px] relative">
          <Image
            alt="logo"
            src={logo}
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        <div className="my-24 md:hidden w-[77px] h-[30px] relative">
          <Image
            alt="logo-small"
            src={logoSmall}
            fill
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        <h1 className="mb-8 font-medium text-2xl md:text-4xl">
          Sign up for Traffix
        </h1>

        <form
          onSubmit={formik.handleSubmit}
          aria-labelledby="signup-form"
          className="flex flex-col items-center w-full max-w-[330px] space-y-4 px-4"
        >
          {/* First + Last name */}
          <div className="w-full ">
            <Input
              id="firstName"
              name="firstName"
              label="First name"
              placeholder="First name"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={
                !!(formik.touched.firstName && formik.errors.firstName)
              }
              aria-describedby="firstName-error"
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <p id="firstName-error" className="text-error text-sm mt-1">
                {formik.errors.firstName}
              </p>
            )}
          </div>

          <div className="w-full ">
            <Input
              id="lastName"
              name="lastName"
              label="Last name"
              placeholder="Last name"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={
                !!(formik.touched.lastName && formik.errors.lastName)
              }
              aria-describedby="lastName-error"
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <p id="lastName-error" className="text-error text-sm mt-1">
                {formik.errors.lastName}
              </p>
            )}
          </div>

          <div className="w-full">
            <Input
              id="email"
              name="email"
              label="Email"
              placeholder="Email"
              preppendIcon={mdiEmailOutline}
              iconSize={0.8}
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={!!(formik.touched.email && formik.errors.email)}
              aria-describedby="email-error"
            />
            {formik.touched.email && formik.errors.email && (
              <p id="email-error" className="text-error text-sm mt-1">
                {formik.errors.email}
              </p>
            )}
          </div>

          <div className="w-full">
            <Input
              id="password"
              name="password"
              label="Password"
              type="password"
              placeholder="Password"
              preppendIcon={mdiKeyOutline}
              iconSize={0.8}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              aria-invalid={
                !!(formik.touched.password && formik.errors.password)
              }
              aria-describedby="password-error"
            />
            {formik.touched.password && formik.errors.password && (
              <p id="password-error" className="text-error text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {serverError && (
            <div
              role="alert"
              className="text-error mt-2 w-full text-center text-sm"
            >
              {serverError}
            </div>
          )}

          <div className="w-full pt-8">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-light"
              disabled={loading}
              aria-disabled={loading}
              aria-busy={loading}
            >
              {loading ? "Creating account…" : "Sign up"}
            </Button>
          </div>

          <div className="w-full text-center">
            <button
              type="button"
              className="underline text-sm hover:text-primary"
              onClick={() => (window.location.href = ROUTES.LOGIN_PAGE)}
            >
              Already have an account? Sign in
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

/** Page container */
const SignUpPage: React.FC = () => {
  const router = useRouter();
  const { loading, error: hookError, signUp } = useSignUp();

  const formik = useFormik<SignUpValues>({
    initialValues: { firstName: "", lastName: "", email: "", password: "" },
    validationSchema: signUpSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const ok = await signUp(values);
        if (ok) {
          // after sign-up usually email confirmation is required — redirect to verify
          router.push(ROUTES.ADMIN_SIGNUP_VERIFY_PAGE);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <SignUpView
      formik={formik}
      loading={loading || formik.isSubmitting}
      serverError={hookError}
      onQuickSignUp={() => {
        /* not needed now; used submit button */
      }}
    />
  );
};

export default SignUpPage;
