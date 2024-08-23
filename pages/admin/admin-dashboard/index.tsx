// import RegisterClientForm from "@/src/components/register-client";
// // // import useAuthRedirect from "@/src/hooks/useAuthRedirect";

import ClientForm from "@/src/components/client-form";

// import React, { useEffect, useState } from "react";
// import { supabase } from "@/src/utils/supabaseClient";

// const AdminDashboard: React.FC = () => {
//   //   //   useAuthRedirect(true); // Ensures only admin can access this page

//   const [clients, setClients] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   //   useEffect(() => {
//   //     const fetchClients = async () => {
//   //       const user = supabase.auth.user();
//   //       if (user) {
//   //         const { data, error } = await supabase
//   //           .from("clients")
//   //           .select("*")
//   //           .eq("admin_id", user.id);

//   //         if (error) {
//   //           console.error("Failed to fetch clients:", error.message);
//   //         } else {
//   //           setClients(data || []);
//   //         }
//   //         setLoading(false);
//   //       }
//   //     };

//   //     fetchClients();
//   //   }, []);

//   return (
//     <div className="p-4">
//       <h1 className="text-2xl font-bold mb-8">Admin Dashboard</h1>
//       {/* <RegisterClientForm /> */}

//       <div className="mt-10">
//         <h2 className="text-xl font-bold mb-4">Your Registered Clients</h2>
//         {loading ? (
//           <p>Loading...</p>
//         ) : (
//           <ul>
//             {clients.map((client) => (
//               <li key={client.id}>{client.email}</li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;
// import ClientForm from './ClientForm'; // Adjust the import path accordingly

const AdminDashboard = () => {
  return (
    <div>
      <h1>Admin Dashboard</h1>
      <ClientForm />
    </div>
  );
};

export default AdminDashboard;
