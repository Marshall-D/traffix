import React, { useState } from "react";
import { useRouter } from "next/router";
import { useFormik } from "formik";
import * as Yup from "yup";
import { supabase } from "@/src/utils/supabaseClient"; // Adjust the import path

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
  const { adminId } = router.query; // Extract the adminId from the route

  // Formik setup
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      setError(null);

      // Attempt to authenticate the client
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("email", values.email)
        .eq("password", values.password) // Note: Consider hashing passwords
        .eq("id", adminId) // Make sure the client belongs to the correct admin
        .single();

      if (error || !data) {
        setError("Login failed: Invalid credentials or admin ID.");
      } else {
        // Store the client data in localStorage or a state management solution
        localStorage.setItem("clientData", JSON.stringify(data));

        // Redirect to a client-specific dashboard or page
        router.push(`/client-dashboard/${adminId}`);
      }
    },
  });

  return (
    <div>
      <h1>Login for Admin ID: {adminId}</h1>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {formik.errors.email ? <div>{formik.errors.email}</div> : null}
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          {formik.errors.password ? <div>{formik.errors.password}</div> : null}
        </div>
        {error && <p>{error}</p>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default ClientLoginPage;
