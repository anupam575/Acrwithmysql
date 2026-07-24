export const createSelfAppraisalPayload = (formData) => {
  const toBool = (v) =>
    v === true || v === "true" || v === "yes";

  const toNumber = (v) => {
    const n = Number(v);
    return isNaN(n) ? 0 : n;
  };

  const tasks = Array.isArray(formData.tasks)
    ? formData.tasks.map((task) => ({
        taskName: task.taskName || "",
        weightage: toNumber(task.weightage),
        deliverables: task.deliverables || "",
        achievement: task.achievement || "",
      }))
    : [];

  return {
    currentFinancialYear: formData.financialYear,
    responsibilities: formData.responsibilities,

    mouWeightage: toNumber(formData.mouWeightage),
    mouDeliverables: formData.mouDeliverables,
    mouAchievement: formData.mouAchievement,

    tasks,

    totalTaskWeightage: toNumber(formData.totalTaskWeightage),

    exceptionalContribution: formData.exceptionalContribution,
    constraints: formData.constraints,

    currentAssignmentTraining: formData.currentAssignmentTraining,
    futureCareerTraining: formData.futureCareerTraining,

    immovablePropertyReturnFiled: toBool(
      formData.immovablePropertyReturnFiled
    ),

    immovablePropertyReturnDate:
      formData.immovablePropertyReturnDate || null,

    medicalCheckupDone: toBool(formData.medicalCheckupDone),

    annualWorkPlanSetForOfficers: toBool(
      formData.annualWorkPlanSetForOfficers
    ),
  };
};