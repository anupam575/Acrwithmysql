export const addMonths = (date, months = 3) => {
  if (!date) return null;

  const d = new Date(date);

  // Invalid date check
  if (isNaN(d.getTime())) return null;

  d.setHours(0, 0, 0, 0);
  d.setMonth(d.getMonth() + months);

  return d;
};

export const getDateRange = (fromDate, months = 3) => {
  const min = addMonths(fromDate, months);

  if (!min) {
    return {
      min: undefined,
      max: undefined,
    };
  }

  min.setDate(min.getDate() + 1);

  return {
    min: min.toISOString().split("T")[0],
    max: undefined,
  };
};

export const validateDateRange = (fromDate, value, months = 3) => {
  if (!fromDate || !value) return true;

  const from = new Date(fromDate);
  const to = new Date(value);

  if (isNaN(from.getTime()) || isNaN(to.getTime())) {
    return true;
  }

  const min = addMonths(from, months);

  if (!min) return true;

  min.setDate(min.getDate() + 1);

  if (to < min) {
    return `To Date must be more than ${months} months after From Date`;
  }

  return true;
};