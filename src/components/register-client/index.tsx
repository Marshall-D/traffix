import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Input } from "@/src/components/input";
import { Button } from "@/src/components/button";
import { supabase } from "@/src/utils/supabaseClient";

// Validation schema for client registration
const schema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Please enter your email"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters long")
    .required("Please enter a password"),
});

const RegisterClientForm: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      setError(null);
      setSuccess(null);

      // Get current admin user
      //   const adminUser = supabase.auth.user();

      //   if (!adminUser) {
      //     setError("Admin not logged in");
      //     return;
      //   }

      // Register client with Supabase authentication
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      });
      const user = data?.user;

      if (error) {
        setError("Client registration failed: " + error.message);
      } else if (user) {
        // Store client info in the clients table, linking to the admin
        const { error: insertError } = await supabase.from("clients").insert([
          {
            email: values.email,
            password: values.password, // In real scenarios, store password securely (e.g., using bcrypt)
            // admin_id: adminUser.id,
          },
        ]);

        if (insertError) {
          setError("Failed to register client: " + insertError.message);
        } else {
          setSuccess("Client registered successfully");
          resetForm();
        }
      }
    },
  });

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Register a New Client</h2>
      {error && <div className="text-red-500">{error}</div>}
      {success && <div className="text-green-500">{success}</div>}
      <form onSubmit={formik.handleSubmit}>
        <Input
          label="Client Email"
          placeholder="Enter client's email"
          {...formik.getFieldProps("email")}
          {...formik.getFieldMeta("email")}
        />
        <Input
          label="Password"
          type="password"
          placeholder="Enter client's password"
          {...formik.getFieldProps("password")}
          {...formik.getFieldMeta("password")}
        />
        <Button type="submit" className="mt-4">
          Register Client
        </Button>
      </form>
    </div>
  );
};

export default RegisterClientForm;
