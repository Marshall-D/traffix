// pages/login/index.tsx
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
import useLogin, { LoginValues } from "@/src/hooks/useLogin";

/** Validation schema */
const schema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Please enter your email"),
  password: Yup.string().required("Please enter your password"),
});

/** Presentational view */
function LoginView({
  formik,
  loading,
  serverError,
}: {
  formik: ReturnType<typeof useFormik<LoginValues>>;
  loading: boolean;
  serverError: string | null;
}) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left background */}
      <div className="hidden md:block bg-primary-light w-1/2" />

      {/* Right: login form */}
      <main className="bg-white w-full md:w-1/2 flex flex-col items-center justify-center px-4 py-8">
        <div className="mb-20 md:my-5">
          <div className="hidden md:block w-[131px] h-[51px] relative">
            <Image
              alt="logo"
              src={logo}
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
          <div className="md:hidden w-[77px] h-[30px] relative">
            <Image
              alt="logo-small"
              src={logoSmall}
              fill
              style={{ objectFit: "contain" }}
              priority
            />
          </div>
        </div>

        <h1 className="mb-4 md:my-16 font-medium text-2xl md:text-4xl">
          Log in to Traffix
        </h1>

        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col items-center space-y-4 md:space-y-4 w-full max-w-[330px]"
          aria-labelledby="login-form"
        >
          <div className="w-full">
            <Input
              preppendIcon={mdiEmailOutline}
              iconSize={0.8}
              label="Email"
              placeholder="Email"
              id="email"
              name="email"
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
              preppendIcon={mdiKeyOutline}
              iconSize={0.8}
              label="Password"
              type="password"
              placeholder="Password"
              id="password"
              name="password"
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

          <div className="w-full pt-8 lg:py-10">
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-light"
              disabled={loading}
              aria-disabled={loading}
              aria-busy={loading}
            >
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </div>

          <div className="w-full text-center">
            <button
              type="button"
              className="underline cursor-pointer hover:text-primary text-sm"
              onClick={() => (window.location.href = ROUTES.FORGOT_PASSWORD)}
            >
              Forgot password?
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

/** Page container */
const LoginPage: React.FC = () => {
  const router = useRouter();
  const { loading, error, signIn } = useLogin();

  const formik = useFormik<LoginValues>({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const ok = await signIn(values);
        if (ok) {
          // redirect to admin dashboard
          router.push(ROUTES.ADMIN_DASHBOARD);
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <LoginView
      formik={formik}
      loading={loading || formik.isSubmitting}
      serverError={error}
    />
  );
};

export default LoginPage;
