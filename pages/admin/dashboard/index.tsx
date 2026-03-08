// src/pages/admin/dashboard.tsx
import React from "react";
import withAuth from "@/src/hocs/withAuth";
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
    statsCards,
    dashboardLoading,
    dashboardError,
  } = useAdminDashboard();

  return (
    <div className="lg:pl-72">
      <DashboardSidebar admin={admin} />
      <div className="mb-36 lg:mb-0">
        <DashboardHeader title="Dashboard" admin={admin} />
      </div>

      <div className="m-3">
        {dashboardError ? (
          <p className="text-red-600 text-sm mb-2" role="alert">
            Could not load dashboard stats. Please try again.
          </p>
        ) : null}
        {dashboardLoading ? (
          <p className="text-grey-2">Loading dashboard…</p>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <CountStatsCard
                title="Average count by hour"
                value={statsCards.averageCountByHour}
              />
              <CountStatsCard
                title="Average count by day"
                value={statsCards.averageCountByDay}
              />
              <CountStatsCard
                title="Average count by week"
                value={statsCards.averageCountByWeek}
              />
              <CountStatsCard
                title="Average count by month"
                value={statsCards.averageCountByMonth}
              />
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
          </>
        )}
      </div>
    </div>
  );
};

export default withAuth(AdminDashboard);
