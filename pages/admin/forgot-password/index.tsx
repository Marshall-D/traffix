import React, { useState } from "react";
import logo from "../../../src/assets/logo-new.png";
import logoSmall from "../../../src/assets/logo-small.png";
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

const ForgotPassword: React.FC = () => {
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
            <p>Forgot Password</p>
          </div>{" "}
          <div className="mb-24  md:text-xl text-grey-2 items-center justify-center">
            <p>Enter email associated with account for verification </p>
          </div>
          <div className="mb-2 w-[300px] md:w-[330px]">
            <Input
              preppendIcon={mdiEmailOutline}
              iconSize={0.8}
              label="Enter Email"
              placeholder="Email"
              {...formik.getFieldProps("email")}
              {...formik.getFieldMeta("email")}
            />
          </div>
          <div className="flex flex-col items-center">
            <div className="my-24 w-[300px] md:w-[330px] text-grey">
              <Button
                className={`w-full ${
                  isSelected ? "bg-error" : "bg-primary hover:bg-primary-light"
                }`}
                type="submit"
                onClick={() => {
                  //   handleClick();
                  router.push(ROUTES.LOGIN_PAGE);
                }}
                variant="error"
              >
                Send Verification{" "}
              </Button>{" "}
            </div>
            <div className="my-12 cursor-pointer ">
              <a
                // className={`w-full ${
                //   isSelected ? "bg-error" : "bg-primary hover:bg-primary-light"
                // }`}
                // type="submit"
                className="underline "
                onClick={() => {
                  handleClick();
                  router.push(ROUTES.LOGIN_PAGE);
                }}
              >
                Back to login
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
