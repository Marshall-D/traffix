// src/hooks/useAdminDashboard.ts
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/src/context/AuthContext";
import { statsService } from "@/services/statsService";

export default function useAdminDashboard() {
  const { user } = useAuth();
  const admin =
    user == null
      ? null
      : (user.userId ?? user._id ?? user.email ?? null);

  const [dashboardData, setDashboardData] = useState<
    Awaited<ReturnType<typeof statsService.getDashboard>>["data"]
  >(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<unknown>(null);

  useEffect(() => {
    let mounted = true;
    setDashboardLoading(true);
    setDashboardError(null);
    statsService
      .getDashboard()
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

  // Busiest days: backend is [Sun, Mon, …, Sat]; chart expects Mon–Sun
  const dashboardBarData = useMemo(() => {
    const raw = dashboardData?.busiestDays;
    if (!raw || !Array.isArray(raw) || raw.length < 7)
      return { data: [0, 0, 0, 0, 0, 0, 0] as const };
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

  const dashboardLineChartLabels = useMemo(
    () =>
      (dashboardData?.lineChart?.labels ?? []) as readonly string[],
    [dashboardData?.lineChart?.labels]
  );

  const dashboardLineChartData = useMemo(
    () => ({
      data: (dashboardData?.lineChart?.currentPeriod ?? []) as readonly number[],
      label: "Last 7 days",
    }),
    [dashboardData?.lineChart?.currentPeriod]
  );

  const dashboardLineChartDataTwo = useMemo(
    () => ({
      data: (dashboardData?.lineChart?.previousPeriod ?? []) as readonly number[],
      label: "Previous 7 days",
      backgroundColor: "#FF5733",
      borderColor: "#FF5733",
    }),
    [dashboardData?.lineChart?.previousPeriod]
  );

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
    ]
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
