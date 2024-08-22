// import React, { useState } from "react";
// import logo from "../../../src/assets/logo-new.png";
// import logoSmall from "../../../src/assets/logo-small.png";
// import { mdiEmailOutline, mdiKeyOutline } from "@mdi/js";
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { Input } from "@/src/components/input";
// import { Button } from "@/src/components/button";
// import Image from "next/image";
// import { useRouter } from "next/router";
// import ROUTES from "@/src/utils/routes";
// import { supabase } from "@/src/utils/supabaseClient";
// import "react-tooltip/dist/react-tooltip.css";

// // Validation schema
// const schema = Yup.object().shape({
//   email: Yup.string()
//     .email("Enter a valid email")
//     .required("Please enter your email"),
//   password: Yup.string()
//     .min(6, "Password must be at least 6 characters long")
//     .required("Please enter your password"),
// });

// const AdminSignUpPage: React.FC = () => {
//   const [isSelected, setIsSelected] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const router = useRouter();

//   // Formik setup
//   const formik = useFormik({
//     enableReinitialize: true,
//     initialValues: {
//       email: "",
//       password: "",
//     },
//     validationSchema: schema,
//     onSubmit: async (values, { resetForm }) => {
//       setError(null);

//       // Sign up the user as an admin
//       const { data, error } = await supabase.auth.signUp({
//         email: values.email,
//         password: values.password,
//       });
//       const user = data?.user;

//       if (error) {
//         console.error("Error during sign-up:", error.message);
//         return;
//       } else if (user) {
//         // Update the user's role to 'admin'
//         const { error: updateError } = await supabase
//           .from("profiles")
//           .update({ role: "admin" })
//           .eq("id", user.id);

//         if (updateError) {
//           setError("Failed to set admin role: " + updateError.message);
//         } else {
//           router.push(ROUTES.LOGIN_PAGE); // Redirect to login after successful sign-up
//         }
//       }
//     },
//   });

//   const handleClick = () => {
//     setIsSelected(true);
//     setTimeout(() => {
//       setIsSelected(false);
//     }, 200);
//   };

//   return (
//     <>
//       <div className="md:grid md:grid-cols-2  md:h-screen">
//         <div className="hidden md:block bg-primary-light"></div>
//         <div id="right-side" className="bg-white flex flex-col items-center">
//           <div className="hidden md:block my-24 w-[131px] h-[51px] relative">
//             <Image alt="logo" layout="fill" src={logo} />
//           </div>
//           <div className="my-24 md:hidden  w-[77px]  h-[30px] relative">
//             <Image alt="logo" layout="fill" src={logoSmall} />
//           </div>
//           <div className="mb-24 font-medium text-2xl md:text-4xl">
//             <p>Sign up as Admin</p>
//           </div>
//           <div className="mb-2 w-[300px] md:w-[330px]">
//             <Input
//               preppendIcon={mdiEmailOutline}
//               iconSize={0.8}
//               label="Email"
//               placeholder="Email"
//               {...formik.getFieldProps("email")}
//               {...formik.getFieldMeta("email")}
//             />
//           </div>
//           <div className="w-[300px] md:w-[330px]">
//             <Input
//               preppendIcon={mdiKeyOutline}
//               iconSize={0.8}
//               label="Password"
//               type="password"
//               placeholder="Password"
//               {...formik.getFieldProps("password")}
//               {...formik.getFieldMeta("password")}
//             />
//           </div>
//           {error && <p className="text-red-500 mt-4">{error}</p>}
//           <div className="my-24 w-[300px] md:w-[330px] text-grey">
//             <Button
//               className={`w-full ${
//                 isSelected ? "bg-error" : "bg-primary hover:bg-primary-light"
//               }`}
//               type="submit"
//               onClick={() => {
//                 handleClick();
//                 formik.handleSubmit();
//               }}
//               variant="error"
//             >
//               Sign up
//             </Button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AdminSignUpPage;

import { supabase } from "@/src/utils/supabaseClient";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/src/components/input";
import { Button } from "@/src/components/button";
import ROUTES from "@/src/utils/routes";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Please enter your email"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Please enter your password"),
  role: Yup.string()
    .oneOf(["admin", "client"], "Invalid role")
    .required("Please select a role"),
});

const SignUpPage: React.FC = () => {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      role: "client", // Default role is client
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });

      if (error) {
        console.error("Error during sign-up:", error.message);
        return;
      }

      const user = data?.user;

      if (user) {
        // After successful sign-up, create a profile in the profiles table
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([{ id: user.id, role: values.role }]);

        if (profileError) {
          console.error("Error creating profile:", profileError.message);
        } else {
          console.log("Profile created successfully");

          // Redirect the user to the appropriate page
          if (values.role === "admin") {
            router.push(ROUTES.ADMIN_DASHBOARD);
          } else {
            router.push(ROUTES.COUNT_PAGE);
          }
        }
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        {...formik.getFieldProps("email")}
        {...formik.getFieldMeta("email")}
      />
      <Input
        label="Password"
        type="password"
        placeholder="Enter your password"
        {...formik.getFieldProps("password")}
        {...formik.getFieldMeta("password")}
      />
      <div>
        <label>
          <input
            type="radio"
            value="admin"
            checked={formik.values.role === "admin"}
            onChange={() => formik.setFieldValue("role", "admin")}
          />
          Admin
        </label>
        <label>
          <input
            type="radio"
            value="client"
            checked={formik.values.role === "client"}
            onChange={() => formik.setFieldValue("role", "client")}
          />
          Client
        </label>
      </div>
      <Button type="submit">Sign Up</Button>
    </form>
  );
};

export default SignUpPage;
