export const getAparDefaultValues = () => ({
  section1: "",
  section2: "",
  section3: "",
  section4: "",
  section5: "",

  section6: {
    mou: {
      weightage: null,
      reportingAbsolute: null,
      initials: "",
      reportingWeighted: 0,
    },

    tasks: [],

    totalWeightage: 0,
    totalReportingAbsolute: 0,
    totalReportingWeighted: 0,

    grandWeightage: 0,
    grandReportingAbsolute: 0,
    grandReportingWeighted: 0,
  },

  section7: Array(10)
    .fill(null)
    .map(() => ({
      reportingAuthority: 0,
      initials: "",
    })),

  summary: {
    total: 0,
    overall: 0,
  },

 

  integrity: {
    beyondDoubt: "",
    doubtful: "",
    nothingAdverse: "",
  },

  penPicture: "",

  overallGrade: 0,

  reportingDate: "",

  signature: "",
  designation: "",
});