import {
  performanceFactors,
  otherAspects,
} from "../../../constants/performanceData";
const createPerformanceReviewFormData = (data) => {
  const formData = new FormData();

  // ==========================
  // Performance Factors
  // ==========================
  performanceFactors.forEach((factor, index) => {
    formData.append(
      `performanceFactors[${index}][label]`,
      factor.label ?? ""
    );

    formData.append(
      `performanceFactors[${index}][weightage]`,
      factor.weightage ?? ""
    );

    formData.append(
      `performanceFactors[${index}][reportingOfficer]`,
      data.performanceFactors?.[index]?.reportingOfficer ?? ""
    );
  });

  // ==========================
  // Other Aspects
  // ==========================
  otherAspects.forEach((factor, index) => {
    formData.append(
      `otherAspects[${index}][label]`,
      factor.label ?? ""
    );

    formData.append(
      `otherAspects[${index}][weightage]`,
      factor.weightage ?? ""
    );

    formData.append(
      `otherAspects[${index}][reportingOfficer]`,
      data.otherAspects?.[index]?.reportingOfficer ?? ""
    );
  });

  // ==========================
  // Career Development
  // ==========================
  if (Array.isArray(data.careerDevelopment)) {
    data.careerDevelopment.forEach((item) => {
      formData.append("careerDevelopment[]", item);
    });
  }

  // ==========================
  // Part III
  // ==========================
  formData.append("otherCareerField", data.otherCareerField ?? "");
  formData.append(
    "trainingRecommendation",
    data.trainingRecommendation ?? ""
  );
  formData.append(
    "officialLanguageWork",
    data.officialLanguageWork ?? ""
  );

  // ==========================
  // Part IV
  // ==========================
  formData.append("generalHealth", data.generalHealth ?? "");
  formData.append("integrity", data.integrity ?? "");
  formData.append(
    "promotionPotential",
    data.promotionPotential ?? ""
  );
  formData.append("totalMarks", data.totalMarks ?? "");

  // ==========================
  // Reporting Officer Details
  // ==========================
  formData.append("place", data.place ?? "");
  formData.append("date", data.date ?? "");
  formData.append(
    "reportingOfficerName",
    data.reportingOfficerName ?? ""
  );
  formData.append("designation", data.designation ?? "");

  return formData;
};

export default createPerformanceReviewFormData;