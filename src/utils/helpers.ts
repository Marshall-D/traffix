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
