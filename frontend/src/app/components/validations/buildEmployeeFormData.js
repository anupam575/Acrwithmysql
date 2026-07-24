export const buildEmployeeFormData = (data) => {
  const formData = new FormData();

  // =========================
  // 1️⃣ FILES (IMPORTANT)
  // =========================

  if (data.recentPhotograph) {
    formData.append("recentPhotograph", data.recentPhotograph);
  }

  if (data.officerSignature) {
    formData.append("officerSignature", data.officerSignature);
  }

  // if (data.medicalExamination?.reportDocument) {
  //   formData.append(
  //     "reportDocument",
  //     data.medicalExamination.reportDocument
  //   );
  // }

  // =========================
  // 2️⃣ BASIC FIELDS
  // =========================

  formData.append("employeeCode", data.employeeCode || "");
  formData.append("EmployeeName", data.EmployeeName || "");
  formData.append("dateOfBirth", data.dateOfBirth || "");
  formData.append("email", data.email || "");
  formData.append("password", data.password || "");
  formData.append(
    "academicProfessionalQualifications",
    data.academicProfessionalQualifications || ""
  );

  // =========================
  // 3️⃣ OBJECTS
  // =========================

  formData.append(
    "currentPost",
    JSON.stringify(data.currentPost || {})
  );

  formData.append(
    "firstPublicEnterpriseAppointment",
    JSON.stringify(data.firstPublicEnterpriseAppointment || {})
  );

  // =========================
  // 4️⃣ AUTHORITIES
  // =========================

  formData.append(
    "authorities.reporting",
    JSON.stringify(data.authorities?.reporting || [])
  );

  formData.append(
    "authorities.reviewing",
    JSON.stringify(data.authorities?.reviewing || [])
  );

  formData.append(
    "authorities.accepting",
    JSON.stringify(data.authorities?.accepting || [])
  );

  // =========================
  // 5️⃣ ARRAYS
  // =========================

  formData.append(
    "absenceRecords",
    JSON.stringify(data.absenceRecords || [])
  );

  
  formData.append(
    "trainingPrograms",
    JSON.stringify(data.trainingPrograms || [])
  );

  formData.append(
    "awards",
    JSON.stringify(data.awards || [])
  );

  // =========================
  // 6️⃣ OTHER FIELDS
  // =========================

  formData.append(
    "officersNotReportedPAR",
    data.officersNotReportedPAR || 0
  );

  formData.append(
    "propertyReturnDate",
    data.propertyReturnDate || ""
  );

  formData.append(
    "propertyReturnYear",
    data.propertyReturnYear || 0
  );

  // =========================
  // 7️⃣ MEDICAL
  // =========================

  // formData.append(
  //   "medicalExamination.date",
  //   data.medicalExamination?.date || ""
  // );

  // formData.append(
  //   "medicalExamination.reportSummary",
  //   data.medicalExamination?.reportSummary || ""
  // );

  // =========================
  // 8️⃣ PERSONNEL OFFICER
  // =========================

  // formData.append(
  //   "personnelOfficer.name",
  //   data.personnelOfficer?.name || ""
  // );
formData.append(
  "designations",
  JSON.stringify(data.designations || [])
);

  // =========================
  // 9️⃣ ROLE INFO
  // =========================

  formData.append("role", data.role || "");
  formData.append("category", data.category || "");
  formData.append("designation", data.designation || "");
formData.append("phoneNumber", data.phoneNumber || "");

  return formData;
};




export const buildUpdateEmployeeFormData = (data) => {

  const formData = new FormData();

  // =========================
  // 1️⃣ FILES
  // =========================
  if (data.recentPhotograph) {
    formData.append("recentPhotograph", data.recentPhotograph);
  }

  if (data.officerSignature) {
    formData.append("officerSignature", data.officerSignature);
  }

  if (data.medicalExamination?.reportDocument) {
    formData.append(
      "reportDocument",
      data.medicalExamination.reportDocument
    );
  }

  // =========================
  // 2️⃣ BASIC FIELDS
  // =========================
  formData.append("employeeCode", data.employeeCode || "");
  formData.append("EmployeeName", data.EmployeeName || "");
  formData.append("dateOfBirth", data.dateOfBirth || "");
  formData.append("email", data.email || "");
  formData.append("phoneNumber", data.phoneNumber || ""); // ✅ Add here

  // formData.append("password", data.password || "");
  formData.append(
    "academicProfessionalQualifications",
    data.academicProfessionalQualifications || ""
  );

  // =========================
  // 3️⃣ OBJECTS
  // =========================
  formData.append("currentPost", JSON.stringify(data.currentPost || {}));
  formData.append(
    "firstPublicEnterpriseAppointment",
    JSON.stringify(data.firstPublicEnterpriseAppointment || {})
  );

  // =========================
  // 4️⃣ AUTHORITIES
  // =========================
  formData.append(
    "authorities.reporting",
    JSON.stringify(data.authorities?.reporting || [])
  );

  formData.append(
    "authorities.reviewing",
    JSON.stringify(data.authorities?.reviewing || [])
  );

  formData.append(
    "authorities.accepting",
    JSON.stringify(data.authorities?.accepting || [])
  );

  
  formData.append("absenceRecords", JSON.stringify(data.absenceRecords || []));
  formData.append("trainingPrograms", JSON.stringify(data.trainingPrograms || []));
  formData.append("awards", JSON.stringify(data.awards || []));

  formData.append("officersNotReportedPAR", data.officersNotReportedPAR || 0);
  formData.append("propertyReturnDate", data.propertyReturnDate || "");
  formData.append("propertyReturnYear", data.propertyReturnYear || 0);

  // =========================
  // 7️⃣ MEDICA
  // =========================
  // 8️⃣ PERSONNEL OFFICER
  // =========================
  formData.append("personnelOfficer.designation", data.personnelOfficer?.designation || "");

  // =========================
  // 9️⃣ ROLE
  // =========================
  formData.append("role", data.role || "");
  formData.append("category", data.category || "");
formData.append(
  "designations",
  JSON.stringify(data.designations || [])
);
  return formData;
};