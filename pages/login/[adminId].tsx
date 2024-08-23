// import React, { useState } from "react";
// import { useRouter } from "next/router";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { supabase } from "@/src/utils/supabaseClient"; // Adjust the import path

// // Validation schema
// const schema = Yup.object().shape({
//   email: Yup.string()
//     .email("Enter a valid email")
//     .required("Please enter your email"),
//   password: Yup.string().required("Please enter your password"),
// });

// const ClientLoginPage: React.FC = () => {
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();
//   const { adminId } = router.query; // Extract the adminId from the route

//   // Formik setup
//   const formik = useFormik({
//     initialValues: {
//       email: "",
//       password: "",
//     },
//     validationSchema: schema,
//     onSubmit: async (values) => {
//       setError(null);

//       // Attempt to authenticate the client
//       const { data, error } = await supabase
//         .from("clients")
//         .select("*")
//         .eq("email", values.email)
//         .eq("password", values.password) // Note: Consider hashing passwords
//         .eq("id", adminId) // Make sure the client belongs to the correct admin
//         .single();

//       if (error || !data) {
//         setError("Login failed: Invalid credentials or admin ID.");
//       } else {
//         // Store the client data in localStorage or a state management solution
//         localStorage.setItem("clientData", JSON.stringify(data));

//         // Redirect to a client-specific dashboard or page
//         router.push(`/client-dashboard/${adminId}`);
//       }
//     },
//   });

//   return (
//     <div>
//       <h1>Login for Admin ID: {adminId}</h1>
//       <form onSubmit={formik.handleSubmit}>
//         <div>
//           <label htmlFor="email">Email</label>
//           <input
//             id="email"
//             name="email"
//             type="email"
//             onChange={formik.handleChange}
//             value={formik.values.email}
//           />
//           {formik.errors.email ? <div>{formik.errors.email}</div> : null}
//         </div>
//         <div>
//           <label htmlFor="password">Password</label>
//           <input
//             id="password"
//             name="password"
//             type="password"
//             onChange={formik.handleChange}
//             value={formik.values.password}
//           />
//           {formik.errors.password ? <div>{formik.errors.password}</div> : null}
//         </div>
//         {error && <p>{error}</p>}
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default ClientLoginPage;

import React, { useState } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { supabase } from "@/src/utils/supabaseClient";
import { mdiEmailOutline, mdiKeyOutline } from "@mdi/js";
import { Input } from "@/src/components/input";
import { Button } from "@/src/components/button";
import Image from "next/image";
import logo from "../../src/assets/logo-new.png";
import logoSmall from "../../src/assets/logo-small.png";
import ROUTES from "@/src/utils/routes";

// Validation schema
const schema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Please enter your email"),
  password: Yup.string().required("Please enter your password"),
});

const ClientLoginPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { adminId } = router.query;

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      setError(null);

      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("email", values.email)
        .eq("password", values.password)
        .eq("id", adminId)
        .single();

      if (error || !data) {
        setError("Login failed: Invalid credentials or admin ID.");
      } else {
        localStorage.setItem("clientData", JSON.stringify(data));
        router.push(`/${ROUTES.COUNT_PAGE}/${adminId}`);
        // router.push(ROUTES.COUNT_PAGE);
      }
    },
  });

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
            <p>Client Login</p>
          </div>
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
              className="w-full bg-primary hover:bg-primary-light"
              type="submit"
              onClick={() => formik.handleSubmit()}
              variant="error"
            >
              Sign in
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClientLoginPage;
