import { formatDate, getId } from "../utils/format.js";

const safeArray = (arr) => Array.isArray(arr) ? arr : [];

const mapFile = (file) => {
  if (!file) return null;

  if (typeof file === "string") {
    return {
      url: file,
      public_id: "",
      originalName: "",
      mimeType: "",
      size: null,
    };
  }

  return {
    url: file.url || "",
    public_id: file.public_id || "",
    originalName: file.originalName || "",
    mimeType: file.mimeType || "",
    size: file.size ?? null,
  };
};

export const employeeDTO = (d = {}) => {
  return {
    // ================= BASIC =================
    id: d._id,

    employeeCode: d.employeeCode || "",
    EmployeeName: d.EmployeeName || "",
    dateOfBirth: formatDate(d.dateOfBirth),
    email: d.email || "",
phoneNumber: d.phoneNumber || "",
    category: getId(d.category),
    role: getId(d.role),
  designations: safeArray(d.designations).map((item) => getId(item)),

    // ================= CURRENT POST =================
    currentPost: {
      postName: d.currentPost?.postName || "",
      grade: d.currentPost?.grade || "",
      continuousAppointmentDate: formatDate(d.currentPost?.continuousAppointmentDate),
      payScale: d.currentPost?.payScale || "",
      nsfdcAppointmentDate: formatDate(d.currentPost?.nsfdcAppointmentDate),
    },
    academicProfessionalQualifications: d.academicProfessionalQualifications ?? null,

    // ================= FIRST APPOINTMENT (FIXED) =================
    firstPublicEnterpriseAppointment: {
      date: formatDate(d.firstPublicEnterpriseAppointment?.date),
      payScale: d.firstPublicEnterpriseAppointment?.payScale || "",
    },

    // ================= AUTHORITIES (FIXED - IMPORTANT) =================
    authorities: {
      reporting: safeArray(d.authorities?.reporting).map((i) => ({
        name: getId(i.name),
        designation: getId(i.designation),
            department: getId(i.department),   // ✅ ADD THIS

        from: formatDate(i.from),
        to: formatDate(i.to),
      })),

      reviewing: safeArray(d.authorities?.reviewing).map((i) => ({
        name: getId(i.name),
        designation: getId(i.designation),
            department: getId(i.department),   // ✅ ADD THIS

        from: formatDate(i.from),
        to: formatDate(i.to),
      })),

      accepting: safeArray(d.authorities?.accepting).map((i) => ({
        name: getId(i.name),
        designation: getId(i.designation),
            department: getId(i.department),   // ✅ ADD THIS

        from: formatDate(i.from),
        to: formatDate(i.to),
      })),
    },

    // ================= ABSENCE RECORDS =================
    absenceRecords: safeArray(d.absenceRecords).map((i) => ({
      from: formatDate(i.from),
      to: formatDate(i.to),
      category: i.category || "",
      leaveType: i.leaveType || "",
      specify: i.specify || "",
      remarks: i.remarks || "",
    })),

    // ================= QUALIFICATIONS =================
    detailedQualifications: safeArray(d.detailedQualifications).map((i) => ({
      qualification: i.qualification || "",
      institution: i.institution || "",
      subjects: i.subjects || "",
      marksObtained: i.marksObtained || "",
    })),

    // ================= TRAINING =================
    trainingPrograms: safeArray(d.trainingPrograms).map((i) => ({
      from: formatDate(i.from),
      to: formatDate(i.to),
      institute: i.institute || "",
      subject: i.subject || "",
    })),

    // ================= AWARDS =================
    awards: safeArray(d.awards).map((i) => ({
      title: i.title || "",
      description: i.description || "",
      year: i.year || null,
    })),

    // ================= PAR COUNTER =================
    officersNotReportedPAR: d.officersNotReportedPAR || 0,

    // ================= PROPERTY RETURN (FIXED) =================
    propertyReturnDate: formatDate(d.propertyReturnDate),
    propertyReturnYear: d.propertyReturnYear || null,

    // // ================= MEDICAL EXAMINATION =================
    // medicalExamination: {
    //   date: formatDate(d.medicalExamination?.date),
    //   reportSummary: d.medicalExamination?.reportSummary || "",

    //   reportDocument: mapFile(d.medicalExamination?.reportDocument),
    // },

    // ================= SIGNATURE =================
    officerSignature: mapFile(d.officerSignature),

    // // ================= PERSONNEL OFFICER =================
    // personnelOfficer: {
    //   name: d.personnelOfficer?.name || "",
    //   designation: d.personnelOfficer?.designation || "",
    // },

    // ================= FILES =================
    recentPhotograph: mapFile(d.recentPhotograph),
  };
};


export const employeeNewDTO = (emp = {}) => {
  return {
    // ========== ID ==========
    id: emp._id || emp.id || "",

    // ========== BASIC ==========
    employeeCode: emp.employeeCode || "",
    employee_name: emp.employee_name || "",
    email: emp.email || "",

    pay_scale: emp.pay_scale || "",
    basic_pay: emp.basic_pay ?? 0,

    // ========== DATES ==========
    date_of_birth: emp.date_of_birth ? formatDate(emp.date_of_birth) : "",
    date_of_joining: emp.date_of_joining ? formatDate(emp.date_of_joining) : "",
    date_of_appointment: emp.date_of_appointment ? formatDate(emp.date_of_appointment) : "",
phoneNumber: emp.phoneNumber || "",

    // ========== RELATIONS (NO safeId) ==========
    role:
      typeof emp.role === "object"
        ? emp.role?._id || emp.role?.id || ""
        : emp.role || "",

    category:
      typeof emp.category === "object"
        ? emp.category?._id || emp.category?.id || ""
        : emp.category || "",

  designations: (emp.designations || []).map((item) =>
    typeof item === "object"
      ? item?._id || item?.id || ""
      : item
  ),
    // ========== EDUCATION ==========
    educationalProfessionalQualifications: {
      education: emp.educationalProfessionalQualifications?.education || [],
      professional: emp.educationalProfessionalQualifications?.professional || [],
      otherDetails:
        emp.educationalProfessionalQualifications?.otherDetails || "",
    },

    // ========== TRAININGS ==========
    basicTrainings: (emp.basicTrainings || []).map((t) => ({
      name: t?.name || "",
      institute: t?.institute || "",
      from: t?.from ? formatDate(t.from) : "",
      to: t?.to ? formatDate(t.to) : "",
      _id: t?._id || "",
    })),

    // ========== AUTHORITIES ==========
    authorities: {
      reporting: (emp.authorities?.reporting || []).map((a) => ({
        name:
          typeof a?.name === "object"
            ? a?.name?._id || a?.name?.id || ""
            : a?.name || "",

        designation:
          typeof a?.designation === "object"
            ? a?.designation?._id || a?.designation?.id || ""
            : a?.designation || "",

            department: typeof a?.department === "object"
    ? a?.department?._id || a?.department?.id || ""
    : a?.department || "",   // ✅ ADD


        from: a?.from ? formatDate(a.from) : "",
        to: a?.to ? formatDate(a.to) : "",
        _id: a?._id || "",
      })),

      reviewing: (emp.authorities?.reviewing || []).map((a) => ({
        name:
          typeof a?.name === "object"
            ? a?.name?._id || a?.name?.id || ""
            : a?.name || "",

        designation:
          typeof a?.designation === "object"
            ? a?.designation?._id || a?.designation?.id || ""
            : a?.designation || "",
            department: typeof a?.department === "object"
    ? a?.department?._id || a?.department?.id || ""
    : a?.department || "",   // ✅ ADD


        from: a?.from ? formatDate(a.from) : "",
        to: a?.to ? formatDate(a.to) : "",
        _id: a?._id || "",
      })),

      accepting: (emp.authorities?.accepting || []).map((a) => ({
        name:
          typeof a?.name === "object"
            ? a?.name?._id || a?.name?.id || ""
            : a?.name || "",

        designation:
          typeof a?.designation === "object"
            ? a?.designation?._id || a?.designation?.id || ""
            : a?.designation || "",
            
            department: typeof a?.department === "object"
    ? a?.department?._id || a?.department?.id || ""
    : a?.department || "",   // ✅ ADD


        from: a?.from ? formatDate(a.from) : "",
        to: a?.to ? formatDate(a.to) : "",
        _id: a?._id || "",
      })),
    },

    // ========== LEAVES ==========
    basicLeaves: (emp.basicLeaves || []).map((l) => ({
      type: l?.type || "",
      reason: l?.reason || "",
      remarks: l?.remarks || "",
      from: l?.from ? formatDate(l.from) : "",
      to: l?.to ? formatDate(l.to) : "",
      _id: l?._id || "",
    })),

    // ========== META ==========
    createdAt: emp.createdAt ? formatDate(emp.createdAt) : "",
    updatedAt: emp.updatedAt ? formatDate(emp.updatedAt) : "",
  };
};