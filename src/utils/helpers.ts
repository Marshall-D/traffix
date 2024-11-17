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
