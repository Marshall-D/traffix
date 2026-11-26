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
  /*
   * NARRATION 1 — POINT TO THIS SECTION:
   *
   * "I'm opening the admin dashboard page under src/pages/admin.
   * This is where the values prepared by the hook become visible
   * to the user."
   *
   * WHERE:
   * The useAdminDashboard hook provides the data, chart values,
   * loading state and error state that this page needs.
   *
   * Point to useAdminDashboard() and the destructured values below.
   */
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
        {/*
         * NARRATION 2 — POINT TO THIS ERROR CONDITION:
         *
         * "I'm checking the error message and the dashboard content
         * together. The important issue is whether an error actually
         * prevents the cards and charts from being rendered."
         *
         * WHERE:
         * This is the first conditional in the dashboard content area.
         * It checks whether dashboardError contains an error.
         *
         * It displays a message, but it does not stop the other
         * dashboard content from rendering.
         */}
        {dashboardError ? (
          <p className="text-red-600 text-sm mb-2" role="alert">
            Could not load dashboard stats. Please try again.
          </p>
        ) : null}

        {/*
         * NARRATION 3 — POINT TO THIS SECOND CONDITIONAL:
         *
         * "At the moment, the error display is not enough on its own
         * if the rest of the dashboard can still render with fallback
         * values.
         *
         * Here, the loading condition only checks whether the request
         * is still running. Once loading finishes, it renders the
         * dashboard content, even when dashboardError contains an error."
         *
         * WHERE:
         * - dashboardLoading is the condition.
         * - The first branch displays the loading message.
         * - The else branch renders the statistic cards and charts.
         *
         * IMPORTANT:
         * This loading condition does not check dashboardError.
         * That is the rendering issue we are going to correct.
         */}
        {dashboardLoading ? (
          <p className="text-grey-2">Loading dashboard…</p>
        ) : (
          <>
            {/*
             * NARRATION 4 — POINT TO THE STATISTIC CARDS:
             *
             * "When loading finishes, the page renders the four
             * statistic cards using the values provided by the hook.
             *
             * These values can currently contain fallback zeros
             * when expected response fields are missing."
             */}
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

            {/*
             * NARRATION 5 — POINT TO THIS CHART CONTAINER:
             *
             * "Below the statistic cards, I'm checking the two chart
             * components that display the busiest days and congestion
             * trends.
             *
             * These components receive their data from the hook.
             * If the response is incomplete, the hook can provide
             * fallback arrays, and these charts can still render
             * without the page identifying the response as invalid."
             */}
            <div className="flex mt-5 gap-5 flex-col w-full md:flex-row">
              {/*
               * NARRATION 5 CONTINUED — POINT TO BarChart:
               *
               * "This first chart displays the busiest days.
               * It receives the weekday values prepared by the hook."
               */}
              <div className="w-full justify-center rounded-2xl p-9 border-2 border-grey gap-4 shadow-lg hover:bg-grey">
                <BarChart
                  chartData={dashboardBarData}
                  chartTitle="Busiest days"
                />
              </div>

              {/*
               * NARRATION 5 CONTINUED — POINT TO LineChart:
               *
               * "The second chart displays the congestion trends.
               * It receives the current and previous period values,
               * together with the corresponding date labels."
               */}
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
