import BarChart from "@/src/components/barChart";
import CountStatsCard from "@/src/components/countStatsCard";
import DashboardHeader from "@/src/components/dashboardHeader";
import { DashboardSidebar } from "@/src/components/dashboardSidebar";
import LineChart from "@/src/components/lineChart";
import { supabase } from "@/src/utils/supabaseClient";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  // const [clients, setClients] = useState<Client[]>([]);
  const [admin, setAdmin] = useState<string | null>(null);
  // const router = useRouter();

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
      // const dynamicUrl = `${window.location.origin}/login/${user.id}`;
      setAdmin(user.id);
    };

    fetchClients();
  }, []);
  return (
    <div className="  lg:pl-72 ">
      <DashboardSidebar admin={admin}></DashboardSidebar>
      <div className="mb-36 lg:mb-0">
        <DashboardHeader title="Dashboard" admin={admin}></DashboardHeader>
      </div>
      <div className="m-3">
        <div className="flex flex-col  md:flex-row gap-4 w-full">
          <CountStatsCard
            title="Average count by hour"
            value="73"
          ></CountStatsCard>
          <CountStatsCard
            title="Average count by day"
            value="288"
          ></CountStatsCard>
          <CountStatsCard
            title="Average count by week"
            value="1,503"
          ></CountStatsCard>
          <CountStatsCard
            title="Average count by month"
            value="4,179"
          ></CountStatsCard>
        </div>
        <div className="flex mt-5 gap-5 flex-col w-full md:flex-row">
          <div className=" w-full justify-center   rounded-2xl p-9  border-2 border-grey gap-4 shadow-lg hover:bg-grey">
            <BarChart></BarChart>
          </div>
          <div className=" w-full  justify-center   rounded-2xl p-9  border-2 border-grey gap-4 shadow-lg hover:bg-grey">
            <LineChart></LineChart>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
