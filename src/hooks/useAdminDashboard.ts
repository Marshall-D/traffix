// src/hooks/useAdminDashboard.ts

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { statsService } from "@/services/statsService";

export default function useAdminDashboard() {
  const { user } = useAuth();
  const admin =
    user == null ? null : (user.userId ?? user._id ?? user.email ?? null);

  /*
   * NARRATION 1 — POINT TO THIS SECTION:
   *
   * "Here, I'm checking how the hook stores the returned data
   * and any error. The service result already provides a way
   * to pass both of those values to the interface, so I want
   * to preserve that existing flow."
   *
   * WHERE:
   * - dashboardData stores the returned dashboard statistics.
   * - dashboardLoading tracks whether the request is still running.
   * - dashboardError stores any error returned by the service.
   */
  const [dashboardData, setDashboardData] =
    useState<Awaited<ReturnType<typeof statsService.getDashboard>>["data"]>(
      null,
    );

  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<unknown>(null);

  useEffect(() => {
    let mounted = true;
    setDashboardLoading(true);
    setDashboardError(null);

    statsService
      .getDashboard()

      /*
       * NARRATION 1 CONTINUED — POINT TO THIS SECTION:
       *
       * "The service returns data and an error separately.
       * Here, I'm storing both returned values in the hook's state.
       * This allows the dashboard page to access the statistics
       * when the request succeeds and display an error when
       * something goes wrong."
       */
      .then(({ data, error }) => {
        if (mounted) {
          setDashboardData(data);
          setDashboardError(error);
        }
      })

      .finally(() => {
        if (mounted) setDashboardLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * NARRATION 2 — POINT TO THIS ENTIRE SECTION:
   *
   * "Further down, I'm inspecting the busiest-days chart preparation.
   * The current logic checks whether the returned array contains
   * enough values. When it does not, the hook substitutes seven zeros.
   * That prevents the chart from crashing, but it also hides the fact
   * that the response was incomplete."
   *
   * WHERE:
   * - raw reads the busiestDays array from the API response.
   * - The if condition checks whether it exists and contains
   *   at least seven values.
   * - The return statement substitutes seven zeros when that
   *   condition is not satisfied.
   */
  const dashboardBarData = useMemo(() => {
    const raw = dashboardData?.busiestDays;

    // This condition checks whether seven daily values are available.
    if (!raw || !Array.isArray(raw) || raw.length < 7)
      // THIS IS THE FALLBACK BEING DISCUSSED:
      return { data: [0, 0, 0, 0, 0, 0, 0] as const };

    /*
     * NARRATION 4 — POINT TO THIS ARRAY:
     *
     * "I'm not going to change the chart ordering. The backend
     * provides the days from Sunday through Saturday, while
     * the chart expects Monday through Sunday.
     *
     * This mapping changes the order for display, so I want
     * to preserve it while adding the validation."
     */
    const reordered = [
      raw[1],
      raw[2],
      raw[3],
      raw[4],
      raw[5],
      raw[6],
      raw[0],
    ] as const;

    return { data: reordered };
  }, [dashboardData?.busiestDays]);

  /*
   * NARRATION 3 — POINT TO THESE THREE useMemo BLOCKS:
   *
   * "I'm also checking the line chart defaults. Missing labels
   * and series values can become empty arrays. This is another
   * example of a fallback keeping the component running without
   * confirming that the response is valid."
   *
   * WHERE:
   * - dashboardLineChartLabels defaults missing labels to [].
   * - dashboardLineChartData defaults missing current-period
   *   values to [].
   * - dashboardLineChartDataTwo defaults missing previous-period
   *   values to [].
   */

  const dashboardLineChartLabels = useMemo(
    () => (dashboardData?.lineChart?.labels ?? []) as readonly string[],
    [dashboardData?.lineChart?.labels],
  );

  const dashboardLineChartData = useMemo(
    () => ({
      data: (dashboardData?.lineChart?.currentPeriod ??
        []) as readonly number[],
      label: "Last 7 days",
    }),
    [dashboardData?.lineChart?.currentPeriod],
  );

  const dashboardLineChartDataTwo = useMemo(
    () => ({
      data: (dashboardData?.lineChart?.previousPeriod ??
        []) as readonly number[],
      label: "Previous 7 days",
      backgroundColor: "#FF5733",
      borderColor: "#FF5733",
    }),
    [dashboardData?.lineChart?.previousPeriod],
  );

  /*
   * NARRATION 4 CONTINUED — CHRONOLOGICAL ORDER:
   *
   * "The line chart uses the order of the labels and values
   * provided by the backend. I'm not applying an additional
   * sorting operation here, so the existing chronological
   * sequence is preserved."
   */
  const dashboardLineChartTitle = "Congestion Trends";

  const statsCards = useMemo(
    () => ({
      averageCountByHour: dashboardData?.averageCountByHour ?? 0,
      averageCountByDay: dashboardData?.averageCountByDay ?? 0,
      averageCountByWeek: dashboardData?.averageCountByWeek ?? 0,
      averageCountByMonth: dashboardData?.averageCountByMonth ?? 0,
    }),
    [
      dashboardData?.averageCountByHour,
      dashboardData?.averageCountByDay,
      dashboardData?.averageCountByWeek,
      dashboardData?.averageCountByMonth,
    ],
  );

  return {
    admin,
    dashboardBarData,
    dashboardLineChartData,
    dashboardLineChartDataTwo,
    dashboardLineChartTitle,
    dashboardLineChartLabels,
    statsCards,
    dashboardLoading,
    dashboardError,
  } as const;
}
