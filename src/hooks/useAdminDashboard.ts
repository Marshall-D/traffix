// src/hooks/useAdminDashboard.ts (small change)
import { useMemo, useState } from "react";
import {
  dashboardBarData,
  dashboardLineChartData,
  dashboardLineChartDataTwo,
  dashboardLineChartTitle,
  dashboardLineChartLabels,
} from "@/src/utils/data";

export default function useAdminDashboard(initialAdmin: string | null = null) {
  const [admin, setAdmin] = useState<string | null>(initialAdmin);

  // just pass through — memoize if you want but these are already constants
  const bar = useMemo(() => dashboardBarData, []);
  const lineA = useMemo(() => dashboardLineChartData, []);
  const lineB = useMemo(() => dashboardLineChartDataTwo, []);
  const title = useMemo(() => dashboardLineChartTitle, []);
  const labels = useMemo(() => dashboardLineChartLabels, []);

  return {
    admin,
    setAdmin,
    dashboardBarData: bar,
    dashboardLineChartData: lineA,
    dashboardLineChartDataTwo: lineB,
    dashboardLineChartTitle: title,
    dashboardLineChartLabels: labels,
  } as const;
}
