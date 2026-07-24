import {
  performanceFactors,
  otherAspects,
} from "./performanceData";

export const reportingOfficerDefaultValues = {
  performanceFactors: performanceFactors.map(() => ({
    reportingOfficer: 0,
  })),

  otherAspects: otherAspects.map(() => ({
    reportingOfficer: 0,
  })),

  careerDevelopment: [],
  otherCareerField: "",
  trainingRecommendation: "",
  officialLanguageWork: "",

  generalHealth: "",
  integrity: "",
  promotionPotential: "",

  totalMarks: 0,

  place: "",
  date: "",

  reportingOfficerName: "",
  designation: "",
};