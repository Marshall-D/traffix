import { useState } from "react";
import logo from "../src/assets/logo-new.png";
import logoSmall from "../src/assets/logo-small.png";
// import { Button } from "../components/button";
// import { Input } from "../components/input";
import { mdiEmailOutline } from "@mdi/js";
import { mdiKeyOutline } from "@mdi/js";
import { useFormik } from "formik";
import { object } from "yup";

import toast, { Toaster } from "react-hot-toast";
import * as Yup from "yup";
import { Input } from "@/src/components/input";
import { Button } from "@/src/components/button";
import Image from "next/image";

const schema = object().shape({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Please enter your email"),
  password: Yup.string().required("Please enter your password"),
});

function LoginPage() {
  const [isSelected, setIsSelected] = useState(false);

  //formik
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,

    onSubmit: (values, { resetForm }) => {
      toast.success(`Welcome ${values.email}`);
      resetForm();
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
      <div className="md:grid md:grid-cols-2 md:h-screen">
        {" "}
        <div className="hidden md:block bg-primary-light"> </div>
        <div id="right-side" className="bg-white flex flex-col items-center ">
          <div className="hidden md:block my-24 w-[131px]  h-[51px] relative">
            <Image alt="logo" layout="fill" src={logo} />
          </div>{" "}
          <div className="my-24 md:hidden  w-[77px]  h-[30px] relative">
            <Image alt="logo" layout="fill" src={logoSmall} />
          </div>
          <div className="mb-24 font-medium text-2xl md:text-4xl">
            <p>Log in to Traffix</p>
          </div>
          <div className="mb-2 w-[300px] md:w-[330px] ">
            <Input
              preppendIcon={mdiEmailOutline}
              iconSize={0.8}
              label="Email"
              placeholder="Email"
              // name="email"
              {...formik.getFieldProps("email")}
              {...formik.getFieldMeta("email")}
            ></Input>
          </div>{" "}
          <div className="  w-[300px] md:w-[330px] ">
            <Input
              preppendIcon={mdiKeyOutline}
              iconSize={0.8}
              label="Password"
              type="password"
              placeholder="Password"
              {...formik.getFieldProps("password")}
              {...formik.getFieldMeta("password")}
            ></Input>{" "}
          </div>
          <div className="my-24  w-[300px] md:w-[330px]  text-grey">
            <Button
              type="submit"
              isSelected={isSelected}
              onClick={() => {
                return handleClick(), formik.handleSubmit();
              }}
              // variant="primary"
            >
              {" "}
              Sign in
            </Button>{" "}
          </div>
        </div>{" "}
      </div>
      <div>
        <Toaster />
      </div>
    </>
  );
}

export default LoginPage;
