// pages/sign-up/index.tsx
import React from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";

import logo from "@/src/assets/logo-new.png";
import logoSmall from "@/src/assets/logo-small.png";
import { mdiEmailOutline, mdiKeyOutline } from "@mdi/js";
import { Input } from "@/src/components/input";
import { Button } from "@/src/components/button";
import ROUTES from "@/src/utils/routes";
import useSignUp, { SignUpValues } from "@/src/hooks/useSignUp";

/** Validation schema */
const schema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Please enter your email"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("Please enter your password"),
});

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
      <div className="hidden md:block bg-primary-light" />

      <main id="right-side" className="bg-white flex flex-col items-center">
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
          className="flex flex-col items-center w-full max-w-[330px] space-y-4"
        >
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
              <p id="email-error" className="text-red-500 text-sm mt-1">
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
              <p id="password-error" className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {serverError && (
            <div role="alert" className="text-red-500 mt-2 w-full text-center">
              {serverError}
            </div>
          )}

          <div className="w-full pt-8">
            {/* Quick navigation: clicking the button will immediately go to the login page.
                Keeping it type="button" so the form is NOT submitted on click.
                Submitting via Enter still executes the real signUp flow. */}
            <Button
              type="button"
              className="w-full bg-primary hover:bg-primary-light"
              disabled={loading}
              aria-disabled={loading}
              aria-busy={loading}
              onClick={onQuickSignUp}
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
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const ok = await signUp(values);
        if (ok) {
          // after sign-up usually email confirmation is required — redirect to login
          router.push(ROUTES.ADMIN_SIGNUP_VERIFY_PAGE);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  // quick navigation that always routes to the login page when clicked
  const handleQuickSignUp = () => {
    router.push(ROUTES.ADMIN_SIGNUP_VERIFY_PAGE);
  };

  return (
    <SignUpView
      formik={formik}
      loading={loading || formik.isSubmitting}
      serverError={hookError}
      onQuickSignUp={handleQuickSignUp}
    />
  );
};

export default SignUpPage;
