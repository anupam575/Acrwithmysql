
// ================= SERVICE =================
export const updateemployeeService = {
  updateEmployee: async (req) => {
    const { employeeCode, email, password } = req.body;

    // ================= VALIDATION =================
    if (!employeeCode || !email || !password) {
      const err = new Error("employeeCode, email, password required");
      err.statusCode = 400;
      throw err;
    }

    // ================= BUILD DATA =================
    const employeeData = {
      employeeCode: employeeCode?.trim(),
      officerName: req.body.officerName?.trim(),
      dateOfBirth: req.body.dateOfBirth,
      email: email?.toLowerCase()?.trim(),
      password,

      academicProfessionalQualifications:
        req.body.academicProfessionalQualifications?.trim() || "",

      currentPost: parseObject(req.body.currentPost),

      firstPublicEnterpriseAppointment: parseObject(
        req.body.firstPublicEnterpriseAppointment
      ),

      authorities: {
        reporting: parseJSON(req.body["authorities.reporting"]),
        reviewing: parseJSON(req.body["authorities.reviewing"]),
        accepting: parseJSON(req.body["authorities.accepting"]),
      },

      absenceRecords: parseJSON(req.body.absenceRecords),
      detailedQualifications: parseJSON(req.body.detailedQualifications),
      trainingPrograms: parseJSON(req.body.trainingPrograms),
      awards: parseJSON(req.body.awards),

      officersNotReportedPAR: Number(req.body.officersNotReportedPAR || 0),
      propertyReturnDate: req.body.propertyReturnDate,
      propertyReturnYear: Number(req.body.propertyReturnYear || 0),

      medicalExamination: {
        date: req.body["medicalExamination.date"],
        reportSummary: req.body["medicalExamination.reportSummary"] || "",
      },

      personnelOfficer: {
        name: req.body["personnelOfficer.name"] || "",
        designation: req.body["personnelOfficer.designation"] || "",
      },

      role: req.body.role,
      category: req.body.category,
      designation: req.body.designation,

      createdBy: req.user?._id || null,
    };

    // ================= FILES =================
    employeeData.recentPhotograph = buildFileObject(
      req.files?.recentPhotograph?.[0]
    );

    employeeData.officerSignature = buildFileObject(
      req.files?.officerSignature?.[0]
    );

    employeeData.medicalExamination.reportDocument = buildFileObject(
      req.files?.medicalExamination?.[0] ||
      req.files?.reportDocument?.[0]
    );

    const normalizedEmployeeCode = employeeCode?.trim();

    const normalizedEmail = email
      ?.toLowerCase()
      ?.trim();

    const existingEmployee =
      await EmployeeDetail.findOne({
        $or: [
          {
            employeeCode:
              normalizedEmployeeCode,
          },
          {
            email: normalizedEmail,
          },
        ],
      });

    if (existingEmployee) {

  if (
    existingEmployee.employeeCode ===
    normalizedEmployeeCode
  ) {
    const err = new Error(
      "Employee code already exists"
    );

    err.statusCode = 409;

    throw err;
  }

  if (
    existingEmployee.email ===
    normalizedEmail
  ) {
    const err = new Error(
      "Email already exists"
    );

    err.statusCode = 409;

    throw err;
  }
}
    // ================= CREATE =================
    const employee = await EmployeeDetail.create(employeeData);

    await updateMasterEmployee({
      employeeRefId: employee._id,
      sourceModel: "EmployeeDetail",
      employeeCode: employee.employeeCode,
      email: employee.email,
      password: employee.password,
      role: employee.role || null,
      category: employee.category || null,
      designation: employee.designation || null,
    });

    const safeEmployee = employee.toObject();
    delete safeEmployee.password;
    delete safeEmployee.refreshToken;

    return safeEmployee;
  },
};