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
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("Please enter your password"),
});

const SignUpPage: React.FC = () => {
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

      //   Attempt to sign up with Supabase
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) {
        setError("Sign-up failed: " + error.message);
      } else {
        //   Redirect to login page after successful sign-up
        router.push(ROUTES.LOGIN_PAGE);
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
    <>
      <div className="md:grid md:grid-cols-2  md:h-screen">
        <div className="hidden md:block bg-primary-light"></div>
        <div id="right-side" className="bg-white flex flex-col items-center">
          <div className="hidden md:block my-24 w-[131px] h-[51px] relative">
            <Image alt="logo" layout="fill" src={logo} />
          </div>
          <div className="my-24 md:hidden  w-[77px]  h-[30px] relative">
            <Image alt="logo" layout="fill" src={logoSmall} />
          </div>
          <div className="mb-24 font-medium text-2xl md:text-4xl">
            <p>Sign up for Traffix</p>
          </div>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-2 w-[300px] md:w-[330px]">
              <Input
                preppendIcon={mdiEmailOutline}
                iconSize={0.8}
                label="Email"
                placeholder="Email"
                {...formik.getFieldProps("email")}
                {...formik.getFieldMeta("email")}
              />
            </div>
            <div className="w-[300px] md:w-[330px]">
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
            {error && <p className="text-red-500 mt-4">{error}</p>}
            <div className="my-24 w-[300px] md:w-[330px] text-grey">
              <Button
                className={`w-full ${
                  isSelected ? "bg-error" : "bg-primary hover:bg-primary-light"
                }`}
                type="submit"
                onClick={() => {
                  handleClick();
                }}
                variant="error"
              >
                Sign up
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
