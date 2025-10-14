// pages/login/[adminId].tsx
import React from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";

import useClientLogin, { LoginValues } from "@/src/hooks/useClientLogin";
import { Input } from "@/src/components/input";
import { Button } from "@/src/components/button";
import logo from "@/src/assets/logo-new.png";
import logoSmall from "@/src/assets/logo-small.png";
import { mdiEmailOutline, mdiKeyOutline } from "@mdi/js";
import ROUTES from "@/src/utils/routes";

/**
 * Validation schema
 */
const schema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Please enter your email"),
  password: Yup.string().required("Please enter your password"),
});

/**
 * Presentational view — minimal logic, easily snapshot/testable.
 */
function LoginView({
  formik,
  loading,
  serverError,
  adminIdStr,
}: {
  formik: ReturnType<typeof useFormik<LoginValues>>;
  loading: boolean;
  serverError: string | null;
  adminIdStr: string | null;
}) {
  return (
    <div className="md:grid md:grid-cols-2 md:h-screen">
      <div className="hidden md:block bg-primary-light" />

      <main id="right-side" className="bg-white flex flex-col items-center">
        <div className="hidden md:block my-24 w-[131px] h-[51px] relative">
          <Image
            alt="logo"
            fill
            src={logo}
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        <div className="my-24 md:hidden w-[77px] h-[30px] relative">
          <Image
            alt="logo-small"
            fill
            src={logoSmall}
            style={{ objectFit: "contain" }}
            priority
          />
        </div>

        <h1 className="mb-8 font-medium text-2xl md:text-4xl">Client Login</h1>

        <form onSubmit={formik.handleSubmit} aria-labelledby="login-form">
          <div className="mb-2 w-[300px] md:w-[330px]">
            <Input
              label="Email"
              placeholder="Email"
              preppendIcon={mdiEmailOutline}
              iconSize={0.8}
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

          <div className="w-[300px] md:w-[330px]">
            <Input
              label="Password"
              placeholder="Password"
              preppendIcon={mdiKeyOutline}
              iconSize={0.8}
              id="password"
              name="password"
              type="password"
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
            <div
              role="alert"
              className="text-red-500 mt-4 w-[300px] md:w-[330px]"
            >
              {serverError}
            </div>
          )}

          <div className="my-12 w-[300px] md:w-[330px]">
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

          {/* For clarity: display the adminId so the user knows which site they're logging into */}
          <div className="text-xs text-grey-400 text-center mt-2">
            Logging into:&nbsp;{" "}
            <span className="font-medium">{adminIdStr ?? "—"}</span>
          </div>
        </form>
      </main>
    </div>
  );
}

/**
 * Page container — wires up formik and the authentication hook.
 */
const ClientLoginPage: React.FC = () => {
  const router = useRouter();
  const { adminId } = router.query;
  const adminIdStr = Array.isArray(adminId) ? adminId[0] : adminId ?? null;

  const { loading, error: hookError, signIn } = useClientLogin();

  const formik = useFormik<LoginValues>({
    initialValues: { email: "", password: "" },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const user = await signIn(values, adminIdStr);
        if (user) {
          // redirect to count page
          router.push(`/${ROUTES.COUNT_PAGE}/${adminIdStr}`);
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
      serverError={hookError}
      adminIdStr={adminIdStr}
    />
  );
};

export default ClientLoginPage;
