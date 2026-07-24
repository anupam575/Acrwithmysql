// ===============================================
// FILE 1
// src/utils/selfAppraisalDefaults.js
// ===============================================

export const getCurrentFinancialYear = () => {

  const currentYear = new Date().getFullYear();

  const currentMonth = new Date().getMonth() + 1;

  if (currentMonth >= 4) {
    return `${currentYear}-${currentYear + 1}`;
  }

  return `${currentYear - 1}-${currentYear}`;
};

export const getFinancialYears = () => {

  const currentYear = new Date().getFullYear();

  let years = [];

  for (let i = 0; i < 5; i++) {

    const startYear = currentYear - i;

    years.push(
      `${startYear}-${startYear + 1}`
    );
  }

  return years;
};

export const selfAppraisalDefaultValues = {
  
  currentFinancialYear:
    getCurrentFinancialYear(),

  responsibilities: "",

  mouWeightage: "",
  mouDeliverables: "",
  mouAchievement: "",
  finalMouScore: "",

  totalTaskWeightage: "",
  grandTotal: 75,

  tasks: [
    {
      taskName: "",
      weightage: "",
      deliverables: "",
      achievement: "",
    },
  ],

  exceptionalContribution: "",

  constraints: "",

  currentAssignmentTraining: "",

  futureCareerTraining: "",

  immovablePropertyReturnFiled: false,

  immovablePropertyReturnDate: "",

  medicalCheckupDone: false,

  annualWorkPlanSetForOfficers: false,
};