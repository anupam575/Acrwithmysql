// =====================================================
// SAFE NUMBER CONVERTER
// =====================================================

const toNum = (v) => {
  const n = Number(v);

  return isNaN(n) ? 0 : n;
};

// =====================================================
// CLAMP GRADE (0 - 10 SAFE)
// ONLY FOR SECTION-II TASK GRADES
// =====================================================

export const clampGrade = (value) => {
  const num = toNum(value);

  // allow only between 0 and 10
  const clamped = Math.min(10, Math.max(0, num));

  return Number(clamped.toFixed(2));
};

// =====================================================
// CALCULATE WEIGHTED
// SUPPORTS:
//
// SECTION-I (MOU)
// (a × b) / 100
//
// SECTION-II (TASKS)
// (a × b) / 10
// =====================================================

export const calcWeighted = (
  weightage,
  grade,
  divisor = 10,
) => {

  const safeWeightage = toNum(weightage);

  // IMPORTANT:
  // DO NOT CLAMP HERE
  // because MOU score can be 0 - 100
  const safeGrade = toNum(grade);

  const safeDivisor =
    toNum(divisor) || 10;

  const result =
    (safeWeightage * safeGrade) /
    safeDivisor;

  return Number(result.toFixed(2));
};

// =====================================================
// SAFE TOTAL SUM
// =====================================================

export const calcTotal = (
  values = [],
) => {

  const total = values.reduce(
    (sum, value) =>
      sum + toNum(value),
    0,
  );

  return Number(total.toFixed(2));
};

// =====================================================
// SAFE AVERAGE
// =====================================================

export const calcAverage = (
  values = [],
) => {

  if (
    !Array.isArray(values) ||
    values.length === 0
  ) {
    return 0;
  }

  const total = values.reduce(
    (sum, value) =>
      sum + toNum(value),
    0,
  );

  const avg =
    total / values.length;

  return Number(avg.toFixed(2));
};

// =====================================================
// GRAND TOTAL
// =====================================================

export const calcGrandTotal = (
  first = 0,
  second = 0,
) => {

  const total =
    toNum(first) +
    toNum(second);

  return Number(total.toFixed(2));
};

// =====================================================
// SAFE PERCENTAGE
// =====================================================

export const calcPercentage = (
  value,
  total,
) => {

  const safeValue =
    toNum(value);

  const safeTotal =
    toNum(total);

  if (safeTotal === 0) {
    return 0;
  }

  const percentage =
    (safeValue / safeTotal) *
    100;

  return Number(
    percentage.toFixed(2),
  );
};

// =====================================================
// SAFE VALIDATION
// FOR TASK GRADES (0 - 10)
// =====================================================

export const isValidGrade = (
  value,
) => {

  const num = toNum(value);

  return num >= 0 && num <= 10;
};

// =====================================================
// SAFE WEIGHTAGE VALIDATION
// =====================================================

export const isValidWeightage = (
  value,
) => {

  const num = toNum(value);

  return num >= 0;
};