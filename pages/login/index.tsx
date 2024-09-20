import React, { useState } from "react";
import logo from "../../src/assets/logo-new.png";
import logoSmall from "../../src/assets/logo-small.png";
import { mdiEmailOutline, mdiKeyOutline } from "@mdi/js";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/src/components/input";
import { Button } from "@/src/components/button";
import Image from "next/image";
import { useRouter } from "next/router";
import ROUTES from "@/src/utils/routes";
import { supabase } from "@/src/utils/supabaseClient";
import "react-tooltip/dist/react-tooltip.css";

// Validation schema
const schema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Please enter your email"),
  password: Yup.string().required("Please enter your password"),
});

const LoginPage: React.FC = () => {
  const [isSelected, setIsSelected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Formik setup
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      setError(null);

      // Attempt to sign in with Supabase
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setError("Login failed: " + error.message);
      } else {
        // Redirect to another page upon successful login
        router.push(ROUTES.ADMIN_DASHBOARD);
      }
    },
  });

  const handleClick = () => {
    setIsSelected(true);
    setTimeout(() => {
      setIsSelected(false);
    }, 200);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Left Side (hidden on small screens) */}
      <div className="hidden md:block bg-primary-light w-1/2"></div>

      {/* Right Side (Login Form) */}
      <div className="bg-white w-full md:w-1/2 flex flex-col items-center justify-center px-4 py-8">
        {/* Logo (responsive sizing) */}
        <div className="mb-20 md:my-5">
          <div className="hidden md:block w-[131px] h-[51px] relative">
            <Image alt="logo" layout="fill" src={logo} />
          </div>
          <div className="md:hidden w-[77px] h-[30px] relative">
            <Image alt="logo" layout="fill" src={logoSmall} />
          </div>
        </div>

        {/* Title */}
        <div className="mb-4 md:my-16 font-medium text-2xl md:text-4xl">
          <p>Log in to Traffix</p>
        </div>

        {/* Form */}
        <div
          // onSubmit={formik.handleSubmit}
          className="flex flex-col items-center space-y-4 md:space-y-4 w-full max-w-[330px]"
        >
          {/* Email Input */}
          <div className="w-full">
            <Input
              preppendIcon={mdiEmailOutline}
              iconSize={0.8}
              label="Email"
              placeholder="Email"
              {...formik.getFieldProps("email")}
              {...formik.getFieldMeta("email")}
            />
          </div>

          {/* Password Input */}
          <div className="w-full">
            <Input
              preppendIcon={mdiKeyOutline}
              iconSize={0.8}
              label="Password"
              type="password"
              placeholder="Password"
              {...formik.getFieldProps("password")}
              {...formik.getFieldMeta("password")}
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 mt-2">{error}</p>}

          {/* Sign In Button */}
          <div className="w-full pt-20 pb-10 lg:py-10">
            <Button
              className={`w-full ${
                isSelected ? "bg-error" : "bg-primary hover:bg-primary-light"
              }`}
              type="submit"
              onClick={() => {
                handleClick();
                formik.handleSubmit();
              }}
              variant="error"
            >
              Sign in
            </Button>
          </div>

          {/* Forgot Password Link */}
          <div className="w-full text-center">
            <a
              className="underline cursor-pointer"
              onClick={() => router.push(ROUTES.FORGOT_PASSWORD)}
            >
              Forgot password?
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
