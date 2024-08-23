// import React, { useEffect, useState } from "react";
// import { supabase } from "@/src/utils/supabaseClient"; // Adjust the import path
// import { useFormik } from "formik";
// import * as Yup from "yup";
// import { useRouter } from "next/router";

// // Define the type for a client object
// type Client = {
//   id: string;
//   clientid: string;
//   email: string;
//   firstname: string;
//   lastname: string;
//   created_at: string;
// };

// const ClientList: React.FC = () => {
//   const [clients, setClients] = useState<Client[]>([]);
//   const router = useRouter();

//   useEffect(() => {
//     const fetchClients = async () => {
//       // Get the logged-in user
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       if (userError || !user) {
//         console.error("Error fetching user: ", userError?.message);
//         return;
//       }

//       // Fetch clients belonging to the logged-in user
//       const { data, error } = await supabase
//         .from("clients")
//         .select("*")
//         .eq("id", user.id);

//       if (error) {
//         console.error("Error fetching clients: ", error.message);
//       } else {
//         setClients(data || []);
//       }
//     };

//     fetchClients();
//   }, []);

//   const formik = useFormik({
//     initialValues: {
//       email: "",
//       password: "",
//       firstname: "",
//       lastname: "",
//     },
//     validationSchema: Yup.object({
//       email: Yup.string().email("Invalid email").required("Required"),
//       password: Yup.string().required("Required"),
//       firstname: Yup.string().required("Required"),
//       lastname: Yup.string().required("Required"),
//     }),
//     onSubmit: async (values, { resetForm }) => {
//       const {
//         data: { user },
//         error: userError,
//       } = await supabase.auth.getUser();

//       if (userError || !user) {
//         console.error("Error fetching user: ", userError?.message);
//         return;
//       }

//       const { data, error } = await supabase
//         .from("clients")
//         .insert({
//           id: user.id,
//           email: values.email,
//           password: values.password,
//           firstname: values.firstname,
//           lastname: values.lastname,
//         })
//         .single();

//       if (error) {
//         console.error("Error adding client: ", error.message);
//       } else {
//         setClients((prevClients) => [...prevClients, data]);
//         resetForm();
//       }
//     },
//   });

//   return (
//     <div>
//       <h1>Your Clients</h1>
//       <ul>
//         {clients?.map((client) => (
//           <li key={client?.clientid}>
//             {client?.firstname} {client?.lastname} - {client?.email}
//           </li>
//         ))}
//       </ul>

//       <h2>Add a New Client</h2>
//       <form onSubmit={formik.handleSubmit}>
//         <div>
//           <label htmlFor="firstname">First Name</label>
//           <input
//             id="firstname"
//             name="firstname"
//             type="text"
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             value={formik.values.firstname}
//           />
//           {formik.touched.firstname && formik.errors.firstname ? (
//             <div>{formik.errors.firstname}</div>
//           ) : null}
//         </div>

//         <div>
//           <label htmlFor="lastname">Last Name</label>
//           <input
//             id="lastname"
//             name="lastname"
//             type="text"
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             value={formik.values.lastname}
//           />
//           {formik.touched.lastname && formik.errors.lastname ? (
//             <div>{formik.errors.lastname}</div>
//           ) : null}
//         </div>

//         <div>
//           <label htmlFor="email">Email</label>
//           <input
//             id="email"
//             name="email"
//             type="email"
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             value={formik.values.email}
//           />
//           {formik.touched.email && formik.errors.email ? (
//             <div>{formik.errors.email}</div>
//           ) : null}
//         </div>

//         <div>
//           <label htmlFor="password">Password</label>
//           <input
//             id="password"
//             name="password"
//             type="password"
//             onChange={formik.handleChange}
//             onBlur={formik.handleBlur}
//             value={formik.values.password}
//           />
//           {formik.touched.password && formik.errors.password ? (
//             <div>{formik.errors.password}</div>
//           ) : null}
//         </div>

//         <button type="submit">Add Client</button>
//       </form>
//     </div>
//   );
// };

// export default ClientList;

import React, { useEffect, useState } from "react";
import { supabase } from "@/src/utils/supabaseClient"; // Adjust the import path
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/router";

// Define the type for a client object
type Client = {
  id: string;
  clientid: string;
  email: string;
  firstname: string;
  lastname: string;
  created_at: string;
};

const ClientList: React.FC = () => {
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

  return (
    <div>
      <h1>Your Clients</h1>
      <ul>
        {clients?.map((client) => (
          <li key={client?.clientid}>
            {client?.firstname} {client?.lastname} - {client?.email}
          </li>
        ))}
      </ul>

      <h2>Add a New Client</h2>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <label htmlFor="firstname">First Name</label>
          <input
            id="firstname"
            name="firstname"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.firstname}
          />
          {formik.touched.firstname && formik.errors.firstname ? (
            <div>{formik.errors.firstname}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="lastname">Last Name</label>
          <input
            id="lastname"
            name="lastname"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.lastname}
          />
          {formik.touched.lastname && formik.errors.lastname ? (
            <div>{formik.errors.lastname}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div>{formik.errors.email}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div>{formik.errors.password}</div>
          ) : null}
        </div>

        <button type="submit">Add Client</button>
      </form>

      {adminLoginUrl && (
        <div>
          <h2>Admin Login URL</h2>
          <p>
            Share this URL with your clients:{" "}
            <a href={adminLoginUrl}>{adminLoginUrl}</a>
          </p>
        </div>
      )}
    </div>
  );
};

export default ClientList;
