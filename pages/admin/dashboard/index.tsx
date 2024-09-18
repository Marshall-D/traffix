import BarChart from "@/src/components/barChart";
import CountStatsCard from "@/src/components/countStatsCard";
import DashboardHeader from "@/src/components/dashboardHeader";
import { DashboardSidebar } from "@/src/components/dashboardSidebar";
import LineChart from "@/src/components/lineChart";

const AdminDashboard = () => {
  return (
    <div className="  lg:pl-72 ">
      <DashboardSidebar></DashboardSidebar>
      <DashboardHeader title="Dashboard"></DashboardHeader>{" "}
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
