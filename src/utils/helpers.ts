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
