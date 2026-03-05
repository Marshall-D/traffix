// src/hooks/useAdminDashboard.ts
import { useMemo } from "react";
import { useAuth } from "@/src/context/AuthContext";
import {
  dashboardBarData,
  dashboardLineChartData,
  dashboardLineChartDataTwo,
  dashboardLineChartTitle,
  dashboardLineChartLabels,
} from "@/src/utils/data";

export default function useAdminDashboard() {
  const { user } = useAuth();
  const admin =
    user == null
      ? null
      : (user.userId ?? user._id ?? user.email ?? null);

  const bar = useMemo(() => dashboardBarData, []);
  const lineA = useMemo(() => dashboardLineChartData, []);
  const lineB = useMemo(() => dashboardLineChartDataTwo, []);
  const title = useMemo(() => dashboardLineChartTitle, []);
  const labels = useMemo(() => dashboardLineChartLabels, []);

  return {
    admin,
    dashboardBarData: bar,
    dashboardLineChartData: lineA,
    dashboardLineChartDataTwo: lineB,
    dashboardLineChartTitle: title,
    dashboardLineChartLabels: labels,
  } as const;
}
