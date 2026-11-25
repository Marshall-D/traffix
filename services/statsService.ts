/**
 * Stats API – all routes require admin JWT (apiClient sends it).
 * Base: /api/v1/stats
 */

// statsService.ts
import apiClient from "./apiClient";

const BASE = "/api/v1/stats";

export type DashboardStats = {
  averageCountByHour?: number;
  averageCountByDay?: number;
  averageCountByWeek?: number;
  averageCountByMonth?: number;
  busiestDays?: number[]; // 7 numbers, Sun–Sat
  lineChart?: {
    labels?: string[];
    currentPeriod?: number[];
    previousPeriod?: number[];
  };
};

export type DailyDataItem = { date: string; count: number; day?: string };
export type DailySummary = {
  average?: number;
  highest?: number;
  lowest?: number;
};

export type HourlyItem = { hour: string; count: number };

export type WeekItem = { date: string; count: number; week: number };
export type WeeklySummary = {
  totalCount?: number;
  currentWeekCount?: number;
  previousWeekCount?: number;
  wowPercent?: number;
  averageWeeklyCount?: number;
};

export type MonthItem = { month: number; start: string; count: number };
export type MonthlySummary = {
  total?: number;
  average?: number;
  highest?: number;
  lowest?: number;
};

export const statsService = {
  getDashboard: async (): Promise<{
    data: DashboardStats | null;
    error: unknown;
  }> => {
    try {
      const res = await apiClient.get(`${BASE}/dashboard`);
      return { data: res.data as DashboardStats, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  getDaily: async (
    from?: string,
    to?: string,
  ): Promise<{
    data: { dailyData?: DailyDataItem[]; dailySummary?: DailySummary } | null;
    error: unknown;
  }> => {
    try {
      const params: Record<string, string> = {};
      if (from) params.from = from;
      if (to) params.to = to;
      const res = await apiClient.get(`${BASE}/daily`, { params });
      return {
        data: res.data as {
          dailyData?: DailyDataItem[];
          dailySummary?: DailySummary;
        },
        error: null,
      };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  getDailyHourly: async (
    date: string,
  ): Promise<{
    data: { hourlyData?: HourlyItem[] } | null;
    error: unknown;
  }> => {
    try {
      const res = await apiClient.get(
        `${BASE}/daily/${encodeURIComponent(date)}/hourly`,
      );
      return { data: res.data as { hourlyData?: HourlyItem[] }, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  getWeekly: async (
    year?: number,
  ): Promise<{
    data: { weeks?: WeekItem[]; weeklySummary?: WeeklySummary } | null;
    error: unknown;
  }> => {
    try {
      const params: Record<string, number> = {};
      if (year != null) params.year = year;
      const res = await apiClient.get(`${BASE}/weekly`, { params });
      return {
        data: res.data as { weeks?: WeekItem[]; weeklySummary?: WeeklySummary },
        error: null,
      };
    } catch (err) {
      return { data: null, error: err };
    }
  },

  getMonthly: async (
    year?: number,
  ): Promise<{
    data: { months?: MonthItem[]; monthlySummary?: MonthlySummary } | null;
    error: unknown;
  }> => {
    try {
      const params: Record<string, number> = {};
      if (year != null) params.year = year;
      const res = await apiClient.get(`${BASE}/monthly`, { params });
      return {
        data: res.data as {
          months?: MonthItem[];
          monthlySummary?: MonthlySummary;
        },
        error: null,
      };
    } catch (err) {
      return { data: null, error: err };
    }
  },
};
