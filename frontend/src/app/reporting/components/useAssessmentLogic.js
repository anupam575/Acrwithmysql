import { useMemo } from "react";
import { useWatch } from "react-hook-form";

import {
  calcWeighted,
  calcTotal,
  calcGrandTotal,
} from "./assessmentCalc";

// =========================
// CONSTANTS
// =========================
const romanNumbers = [
  "i)",
  "ii)",
  "iii)",
  "iv)",
  "v)",
  "vi)",
  "vii)",
  "viii)",
  "ix)",
  "x)",
];

// =========================
// HELPERS
// =========================
const num = (v) => {
  if (v === "" || v === null || v === undefined) {
    return 0;
  }

  const n = Number(v);

  return isNaN(n) ? 0 : n;
};

const isValidGrade = (v) => {
  const n = Number(v);

  if (isNaN(n)) {
    return false;
  }

  // only 1 → 10
  if (n < 1 || n > 10) {
    return false;
  }

  // max 2 decimal
  return /^\d+(\.\d{1,2})?$/.test(v.toString());
};

// =========================
// MOU SCORE VALIDATION
// 0 → 100
// =========================
const isValidMouScore = (v) => {
  const n = Number(v);

  if (isNaN(n)) {
    return false;
  }

  return n >= 0 && n <= 100;
};

const isValidMouWeightage = (v) => {
  const n = Number(v);

  return [15, 20, 25].includes(n);
};

// =========================
// TASK WEIGHTAGE VALIDATION
// ONLY 5 / 5.5 / 6
// =========================
const isValidTaskWeightage = (v) => {
  const n = Number(v);

  return [5, 5.5, 6].includes(n);
};

const normalizeTasks = (tasks = []) =>
  tasks.map((t) => ({
    taskName: t?.taskName || "",

    // ONLY 5 / 5.5 / 6
    weightage: isValidTaskWeightage(t?.weightage)
      ? num(t?.weightage)
      : 0,

    // ONLY 1 → 10
    reporting: isValidGrade(t?.reportingAbsolute)
      ? num(t.reportingAbsolute)
      : 0,

    reportingWeighted:
      isValidTaskWeightage(t?.weightage) &&
      isValidGrade(t?.reportingAbsolute)
        ? calcWeighted(
            num(t.weightage),
            num(t.reportingAbsolute),
            10,
          )
        : 0,

    initials: t?.initials || "",
  }));

// =========================
// MAIN HOOK
// =========================
export function useAssessmentLogic(control, append, remove) {
  // =========================
  // WATCH FORM
  // =========================
  const tasks =
    useWatch({
      control,
      name: "section6.tasks",
    }) || [];

  const mou =
    useWatch({
      control,
      name: "section6.mou",
    }) || {};

  // =========================
  // NORMALIZED TASKS
  // =========================
  const normalizedTasks = useMemo(
    () => normalizeTasks(tasks),
    [tasks],
  );

  // =========================
  // TOTAL TASK WEIGHTAGE
  // =========================
  const totalWeightage = useMemo(() => {
    return calcTotal(
      normalizedTasks.map((t) => t.weightage),
    );
  }, [normalizedTasks]);

  // =========================
  // TOTAL REPORTING WEIGHTED
  // =========================
  const totalReportingWeighted = useMemo(() => {
    return Number(
      normalizedTasks
        .reduce((sum, t) => {
          return sum + num(t.reportingWeighted);
        }, 0)
        .toFixed(2),
    );
  }, [normalizedTasks]);

  const mouWeightage = num(mou?.weightage);

  const mouReportingWeighted = useMemo(() => {
    if (
      !isValidMouWeightage(mou?.weightage) ||
      !isValidMouScore(mou?.reportingAbsolute)
    ) {
      return 0;
    }

    return calcWeighted(
      num(mou.weightage),
      num(mou.reportingAbsolute),
      100,
    );
  }, [mou?.weightage, mou?.reportingAbsolute]);

  // =========================
  // GRAND TOTAL WEIGHTAGE
  // should be 75
  // =========================
  const grandWeightage = useMemo(() => {
    return calcGrandTotal(
      mouWeightage,
      totalWeightage,
    );
  }, [mouWeightage, totalWeightage]);

  // =========================
  // FINAL REPORTING TOTAL
  // =========================
  const grandReportingWeighted = useMemo(() => {
    return Number(
      (
        num(mouReportingWeighted) +
        num(totalReportingWeighted)
      ).toFixed(2),
    );
  }, [mouReportingWeighted, totalReportingWeighted]);

  // =========================
  // GRAND TOTAL VALIDATION
  // =========================
  const isValidGrandWeightage =
    num(grandWeightage) === 75;

  // =========================
  // EXPECTED TASK WEIGHTAGE
  // =========================
  const expectedTaskWeightageMap = {
    25: 50,
    20: 55,
    15: 60,
  };

  const expectedTaskWeightage =
    expectedTaskWeightageMap[mouWeightage] || 0;

  const isTaskWeightageValid =
    num(totalWeightage) === expectedTaskWeightage;

  // =========================
  // ADD TASK
  // max 10
  // =========================
  const handleAddTask = () => {
    if (tasks.length >= 10) {
      return;
    }

    append({
      taskName: "",
      weightage: "",
      reportingAbsolute: "",
      initials: "",
    });
  };

  // =========================
  // RETURN
  // =========================
  return {
    tasks: normalizedTasks,
    mou,
    romanNumbers,

    totalWeightage,

    totalReportingWeighted,

    mouReportingWeighted,

    grandWeightage,

    grandReportingWeighted,

    isValidGrandWeightage,
    isTaskWeightageValid,
    expectedTaskWeightage,
      removeTask: remove,   // 👈 add this


    handleAddTask,
  };
}