// src/pages/admin/dashboard.tsx
import React from "react";
import BarChart from "@/src/components/barChart";
import CountStatsCard from "@/src/components/countStatsCard";
import DashboardHeader from "@/src/components/dashboardHeader";
import { DashboardSidebar } from "@/src/components/dashboardSidebar";
import LineChart from "@/src/components/lineChart";
import useAdminDashboard from "@/src/hooks/useAdminDashboard";

const AdminDashboard: React.FC = () => {
  const {
    admin,
    dashboardBarData,
    dashboardLineChartData,
    dashboardLineChartDataTwo,
    dashboardLineChartTitle,
    dashboardLineChartLabels,
  } = useAdminDashboard();

  return (
    <div className="lg:pl-72">
      <DashboardSidebar admin={admin} />
      <div className="mb-36 lg:mb-0">
        <DashboardHeader title="Dashboard" admin={admin} />
      </div>

      <div className="m-3">
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <CountStatsCard title="Average count by hour" value="73" />
          <CountStatsCard title="Average count by day" value="288" />
          <CountStatsCard title="Average count by week" value="1,503" />
          <CountStatsCard title="Average count by month" value="4,179" />
        </div>

        <div className="flex mt-5 gap-5 flex-col w-full md:flex-row">
          <div className="w-full justify-center rounded-2xl p-9 border-2 border-grey gap-4 shadow-lg hover:bg-grey">
            <BarChart chartData={dashboardBarData} chartTitle="Busiest days" />
          </div>

          <div className="w-full justify-center rounded-2xl p-9 border-2 border-grey gap-4 shadow-lg hover:bg-grey">
            <LineChart
              chartDataTwo={dashboardLineChartDataTwo}
              chartData={dashboardLineChartData}
              chartTitle={dashboardLineChartTitle}
              chartLabels={dashboardLineChartLabels}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
