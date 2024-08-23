import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/src/utils/supabaseClient"; // Adjust the import path

const ClientDashboard: React.FC = () => {
  const router = useRouter();
  const { adminId } = router.query;
  const [clientData, setClientData] = useState<any>(null);

  useEffect(() => {
    // Fetch client data from localStorage
    const storedClientData = localStorage.getItem("clientData");
    if (storedClientData) {
      setClientData(JSON.parse(storedClientData));
    } else {
      // Redirect to login if no client data is found
      router.push(`/login/${adminId}`);
    }
  }, [adminId, router]);

  return (
    <div>
      <h1>Client Dashboard for Admin ID: {adminId}</h1>
      {clientData ? (
        <div>
          <p>
            Welcome, {clientData.firstname} {clientData.lastname}
          </p>
          <p>Email: {clientData.email}</p>
          {/* Add more client-specific information here */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ClientDashboard;
