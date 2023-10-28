export const monthNames: Month[] = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

type DateRange = {
  start: { month: Month; day: number };
  end: { month: Month; day: number };
};

export const isWithinDateRange = (date: Date, range: DateRange): boolean => {
  const startMonth = monthNames.indexOf(range.start.month);
  const endMonth = monthNames.indexOf(range.end.month);

  if (startMonth === -1 || endMonth === -1) {
    console.error("Invalid month name in date range");
    return false;
  }

  const startDate = new Date(date.getFullYear(), startMonth, range.start.day);
  const endDate = new Date(date.getFullYear(), endMonth, range.end.day);

  return date >= startDate && date <= endDate;
};

export const isHalloweenSeason = (date: Date): boolean => {
  const halloweenRange: DateRange = {
    start: { month: "october", day: 15 },
    end: { month: "november", day: 5 },
  };
  return isWithinDateRange(date, halloweenRange);
};

export const isHalloweenDay = (date: Date): boolean => {
  const month = monthNames[date.getUTCMonth()];
  const day = date.getUTCDate();
  return (
    (month === "october" && day === 31) || (month === "november" && day === 1)
  );
};
