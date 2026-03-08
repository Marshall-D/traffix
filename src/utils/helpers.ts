//src/utils/helpers.ts

export const formatDate = (date: string): string => {
  const dateObj = new Date(date);
  const day = dateObj.getDate();
  const month = dateObj.toLocaleString("default", { month: "long" });
  const year = dateObj.getFullYear();

  const getOrdinalSuffix = (n: number): string => {
    const suffixes = ["th", "st", "nd", "rd"];
    const value = n % 100;
    return suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
  };

  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
};

/**
 * Get Monday (ISO week start) for a given ISO week number in a year.
 * Week 1 is the week containing Jan 4.
 */
function getISOWeekStartDate(year: number, weekNum: number): Date {
  const jan4 = new Date(year, 0, 4);
  const day = jan4.getDay(); // 0 = Sun, 1 = Mon, ...
  const daysToMonday = day === 0 ? 6 : day - 1;
  const week1Monday = new Date(year, 0, 4 - daysToMonday);
  const d = new Date(week1Monday);
  d.setDate(week1Monday.getDate() + (weekNum - 1) * 7);
  return d;
}

/** Format a Date as local YYYY-MM-DD (avoids UTC shift from toISOString). */
export function toLocalDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/**
 * Returns Monday (YYYY-MM-DD) of the week containing the given date string.
 * Week is Monday–Sunday. Uses local date so timezone does not shift the day.
 */
export function getMondayOfWeek(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  if (Number.isNaN(d.getTime())) return dateStr;
  const day = d.getDay();
  const toMonday = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - toMonday);
  return toLocalDateString(d);
}

/**
 * Returns weekday name (e.g. "Monday") for a date string.
 */
export function formatWeekday(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleString("en-GB", { weekday: "long" });
}

export type WeekRow = { date: string; count: number; week: number };

/**
 * Builds all 52 weeks for a year with optional API data merged in.
 * Weeks without data get count 0.
 * Matches API data by week-start date (Monday), not by week number, so counts
 * stay correct even if the backend uses different week numbering (e.g. 0-based).
 */
export function getFullYearWeeks(
  year: number,
  apiWeeks: WeekRow[] = []
): WeekRow[] {
  const byMonday = new Map<string, number>();
  for (const w of apiWeeks) {
    const monday = getMondayOfWeek(w.date);
    byMonday.set(monday, w.count);
  }
  const result: WeekRow[] = [];
  const maxWeeks = 53;
  for (let w = 1; w <= maxWeeks; w++) {
    const start = getISOWeekStartDate(year, w);
    if (start.getFullYear() > year) break;
    const dateStr = toLocalDateString(start);
    const count = byMonday.get(dateStr) ?? 0;
    result.push({
      date: dateStr,
      count,
      week: w,
    });
  }
  return result;
}

// returns ISO start/end for the current UTC day
export default function getTodayRangeUTC() {
  const today = new Date().toISOString().split("T")[0];
  return {
    startIso: `${today}T00:00:00.000Z`,
    endIso: `${today}T23:59:59.999Z`,
  };
}

/**
 * Returns ordinal suffix for a day number (1st, 2nd, 3rd, 4th, ...).
 * Handles special case for 11,12,13 which are 'th'.
 */
export function formatDateSuffix(day: number): string {
  if (day > 3 && day < 21) return "th"; // 11th, 12th, 13th
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

// passwordValidators
export const validateMinLength = (pw: string, min = 8) => pw.length >= min;
export const validateHasLetter = (pw: string) => /[A-Za-z]/.test(pw);
export const validateHasNumber = (pw: string) => /[0-9]/.test(pw);

/**
 * Optionally export a single function that returns the criteria map
 */
export const passwordCriteria = (pw: string) => ({
  hasMinLength: validateMinLength(pw),
  hasLetter: validateHasLetter(pw),
  hasNumber: validateHasNumber(pw),
});
