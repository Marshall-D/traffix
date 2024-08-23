import React, { useEffect, useState } from "react";
import { supabase } from "@/src/utils/supabaseClient"; // Adjust the import path
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";
import { mdiEmailOutline, mdiKeyOutline, mdiAccountOutline } from "@mdi/js";
import { Input } from "@/src/components/input";
import { Button } from "@/src/components/button";

// Define the type for a client object
type Client = {
  id: string;
  clientid: string;
  email: string;
  firstname: string;
  lastname: string;
  password: string;
  created_at: string;
};

const AdminDashboard: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [adminLoginUrl, setAdminLoginUrl] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchClients = async () => {
      // Get the logged-in user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error fetching user: ", userError?.message);
        return;
      }

      // Set the dynamic login URL
      const dynamicUrl = `${window.location.origin}/login/${user.id}`;
      setAdminLoginUrl(dynamicUrl);

      // Fetch clients belonging to the logged-in user
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("id", user.id);

      if (error) {
        console.error("Error fetching clients: ", error.message);
      } else {
        setClients(data || []);
      }
    };

    fetchClients();
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email").required("Required"),
      password: Yup.string().required("Required"),
      firstname: Yup.string().required("Required"),
      lastname: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Error fetching user: ", userError?.message);
        return;
      }

      const { data, error } = await supabase
        .from("clients")
        .insert({
          id: user.id,
          email: values.email,
          password: values.password,
          firstname: values.firstname,
          lastname: values.lastname,
        })
        .single();

      if (error) {
        console.error("Error adding client: ", error.message);
      } else {
        setClients((prevClients) => [...prevClients, data]);
        resetForm();
      }
    },
  });

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      router.push("/login");
    } else {
      console.error("Error signing out:", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10">
      <div className="w-[300px] md:w-[500px] mb-12">
        <h1 className="text-2xl font-medium text-center mb-6">Your Clients</h1>
        <ul className="bg-gray-100 p-4 rounded-md shadow-md space-y-4">
          {clients?.map((client) => (
            <li
              key={client?.clientid}
              className="flex justify-between items-center"
            >
              <div>
                <p className="text-lg font-semibold">
                  {client?.firstname} {client?.lastname}
                </p>
                <p className="text-sm text-gray-600">{client?.email}</p>
                <p className="text-sm text-gray-600">{client?.password}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-[300px] md:w-[500px]">
        <h2 className="text-2xl font-medium text-center mb-6">
          Add a New Client
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <Input
            preppendIcon={mdiAccountOutline}
            iconSize={0.8}
            label="First Name"
            placeholder="First Name"
            {...formik.getFieldProps("firstname")}
            {...formik.getFieldMeta("firstname")}
          />
          <Input
            preppendIcon={mdiAccountOutline}
            iconSize={0.8}
            label="Last Name"
            placeholder="Last Name"
            {...formik.getFieldProps("lastname")}
            {...formik.getFieldMeta("lastname")}
          />
          <Input
            preppendIcon={mdiEmailOutline}
            iconSize={0.8}
            label="Email"
            placeholder="Email"
            {...formik.getFieldProps("email")}
            {...formik.getFieldMeta("email")}
          />
          <Input
            preppendIcon={mdiKeyOutline}
            iconSize={0.8}
            label="Password"
            type="password"
            placeholder="Password"
            {...formik.getFieldProps("password")}
            {...formik.getFieldMeta("password")}
          />
          <Button
            className="w-full bg-primary hover:bg-primary-light text-white"
            type="submit"
          >
            Add Client
          </Button>
        </form>
      </div>

      {adminLoginUrl && (
        <div className="mt-12 text-center">
          <h2 className="text-xl font-medium mb-4">Admin Login URL</h2>
          <p className="text-blue-500 underline">
            <a href={adminLoginUrl}>{adminLoginUrl}</a>
          </p>
        </div>
      )}

      {/* Sign Out Button */}
      <div className="mt-12">
        <Button
          className="bg-red-500 hover:bg-red-700 text-white"
          onClick={handleSignOut}
        >
          Sign Out
        </Button>
      </div>
    </div>
  );
};

export default AdminDashboard;
