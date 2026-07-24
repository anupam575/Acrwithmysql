import {
  performanceFactors,
  otherAspects,
} from "../utils/performanceData.js";

export const buildPerformanceReviewData = (body = {}) => {
  return {
    // Employee
    employeeId: body.employeeId,

    // Financial Year
    financialYear: body.financialYear || "",

    // Performance Factors
    performanceFactors: performanceFactors.map((item, index) => ({
      label: item.label,
      weightage: item.weightage,
      reportingOfficer: Number(
        body.performanceFactors?.[index]?.reportingOfficer ?? 1
      ),
    })),

    // Other Aspects
    otherAspects: otherAspects.map((item, index) => ({
      label: item.label,
      weightage: item.weightage,
      reportingOfficer: Number(
        body.otherAspects?.[index]?.reportingOfficer ?? 1
      ),
    })),

    // Career Development
    careerDevelopment: body.careerDevelopment || [],
    otherCareerField: body.otherCareerField || "",

    // Part III
    trainingRecommendation:
      body.trainingRecommendation || "",

    officialLanguageWork:
      body.officialLanguageWork || "",

    // Part IV
    generalHealth: body.generalHealth || "",
    integrity: body.integrity || "",
    promotionPotential:
      body.promotionPotential || "",

    totalMarks: Number(body.totalMarks ?? 0),

    // Reporting Officer
    place: body.place || "",
    date: body.date || null,
    reportingOfficerName:
      body.reportingOfficerName || "",
    designation: body.designation || "",
  };
};