const parDefaultValues = {
  employeeCode: "",
  officerName: "",
  employeeNumber: "",
  dateOfBirth: null,
  phoneNumber: "",   // ✅ Add this

  academicProfessionalQualifications: "",

  currentPost: {
    postName: "",
    grade: "",
    payScale: "",
    nsfdcAppointmentDate: null,
  },

  firstPublicEnterpriseAppointment: {
    date: null,
    payScale: "",
  },

  authorities: {
    reporting: [],
    reviewing: [],
    accepting: [],
  },

  absenceRecords: [],

  trainingPrograms: [],

  awards: [],
  designations: [],

  officersNotReportedPAR: null,
  propertyReturnDate: null,
  propertyReturnYear: null,

  // medicalExamination: {
  //   date: null,
  //   reportSummary: "",
  // },

  officerSignature: "",

  // personnelOfficer: {
  //   name: "",
  //   designation: "",
  // },
};

export default parDefaultValues;
