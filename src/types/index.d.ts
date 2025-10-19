export interface ICountPage {
  id?: string;
}

export type IDashboardSidebar = {
  admin?: any;
};

export interface WeeklyData {
  date: string; // Start date of the week (e.g. "2025-01-01")
  count: number; // Total count for the week
  week: number; // Week number
}

export interface WeeklyCountCardProps {
  onTableItemClick: (date: string | null, week: number | null) => void;
  weeklyData: WeeklyData[];
}
