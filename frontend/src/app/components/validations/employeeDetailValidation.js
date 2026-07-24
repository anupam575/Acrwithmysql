import * as yup from "yup";

// ================= HELPERS =================
const dateField = yup
  .date()
  .transform((v, o) => (o === "" || o === undefined ? null : new Date(o)))
  .nullable();

const numberField = yup
  .number()
  .transform((v, o) => (o === "" || o === undefined ? null : Number(o)))
  .nullable();

const objectIdSchema = yup
  .string()
  .transform((v) => (v === "" ? null : v))
  .test("is-objectid", "Invalid ObjectId", (value) => {
    if (!value) return true;
    return /^[0-9a-fA-F]{24}$/.test(value);
  })
  .nullable();

const fileSchema = yup
  .mixed()
  .nullable()
  .test("fileOrObject", "Invalid file", (value) => {
    if (!value) return true;

    if (value instanceof File) return true;

    if (
      typeof value === "object" &&
      value !== null &&
      value.url &&
      value.public_id
    ) {
      return true;
    }

    return false;
  });

const authorityItem = yup.object({
  name: objectIdSchema,
  designation: objectIdSchema,
  department: objectIdSchema, 

  from: dateField,
  to: dateField,
});



export const employeeDetailSchema = yup.object({
  // ================= BASIC =================
  employeeCode: yup.string().required("Employee code is required"),

  officerName: yup.string().nullable(),
  dateOfBirth: dateField,

  academicProfessionalQualifications: yup.string().nullable(),

  // ================= CURRENT POST =================
  currentPost: yup
    .object({
      grade: yup.string().nullable(),
      payScale: yup.string().nullable(),
      nsfdcAppointmentDate: dateField,
    })
    .nullable(),

  // ================= FIRST APPOINTMENT =================
  firstPublicEnterpriseAppointment: yup
    .object({
      date: dateField,
      payScale: yup.string().nullable(),
    })
    .nullable(),

  // ================= AUTH =================
  email: yup
    .string()
    .trim()
    .lowercase()
    .required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
      "Please enter a valid email address",
    ),

  password: yup
    .string()
    .required("Password is required")
    .min(6, "Minimum 6 characters")
    .max(20, "Maximum 20 characters")
    .matches(/[a-z]/, "At least one lowercase letter")
    .matches(/[A-Z]/, "At least one uppercase letter")
    .matches(/[0-9]/, "At least one number"),

  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),

  authorities: yup
    .object({
      reporting: yup.array().of(authorityItem).default([]),
      reviewing: yup.array().of(authorityItem).default([]),
      accepting: yup.array().of(authorityItem).default([]),
    })
    .nullable(),

  absenceRecords: yup
    .array()
    .of(
      yup.object({
        from: dateField,
        to: dateField,
        category: yup.string().oneOf(["Leave", "Others"]).default("Leave"),
        leaveType: yup
          .string()
          .oneOf([
            "Casual Leave",
            "Earned Leave",
            "Medical Leave",
            "On leave other than Casual Leave",
            "Other",
          ])
          .nullable(),
        specify: yup.string().nullable(),
        remarks: yup.string().nullable(),
      }),
    )
    .default([]),

  // ================= QUALIFICATIONS =================
 
  // ================= TRAINING =================
  trainingPrograms: yup
    .array()
    .of(
      yup.object({
        from: dateField,
        to: dateField,
        institute: yup.string().nullable(),
        subject: yup.string().nullable(),
      }),
    )
    .default([]),

  // ================= AWARDS =================
  awards: yup
    .array()
    .of(
      yup.object({
        title: yup.string().nullable(),
        description: yup.string().nullable(),
        year: numberField,
      }),
    )
    .default([]),

  // ================= META =================
  officersNotReportedPAR: numberField,
  role: objectIdSchema,
  category: objectIdSchema,
  designation: objectIdSchema,

  propertyReturnDate: dateField,
  propertyReturnYear: numberField,

 

  officerSignature: fileSchema,
  recentPhotograph: fileSchema,

  // ================= PERSONNEL =================
 
});

// ================= MAIN UPDATE SCHEMA =================
export const updateEmployeeDetailSchema = yup.object({
  // ================= BASIC =================
  employeeCode: yup.string().trim().notRequired(),

  officerName: yup.string().nullable().notRequired(),

  dateOfBirth: dateField,

  academicProfessionalQualifications: yup.string().nullable().notRequired(),

  // ================= CURRENT POST =================
  currentPost: yup
    .object({
      postName: yup.string().nullable().notRequired(),
      grade: yup.string().nullable().notRequired(),
      continuousAppointmentDate: dateField,
      payScale: yup.string().nullable().notRequired(),
      nsfdcAppointmentDate: dateField,
    })
    .nullable()
    .notRequired(),

  // ================= FIRST APPOINTMENT =================
  firstPublicEnterpriseAppointment: yup
    .object({
      date: dateField,
      payScale: yup.string().nullable().notRequired(),
    })
    .nullable()
    .notRequired(),

  // ================= EMAIL =================
  email: yup
    .string()
    .trim()
    .lowercase()
    .nullable()
    .notRequired()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/, {
      message: "Please enter a valid email address",
      excludeEmptyString: true,
    }),

  // ================= AUTHORITIES =================
  authorities: yup
    .object({
      reporting: yup.array().of(authorityItem).default([]),
      reviewing: yup.array().of(authorityItem).default([]),
      accepting: yup.array().of(authorityItem).default([]),
    })
    .nullable()
    .notRequired(),

  // ================= ABSENCE RECORDS =================
  absenceRecords: yup
    .array()
    .of(
      yup.object({
        from: dateField,
        to: dateField,
        category: yup.string().oneOf(["Leave", "Others"]).default("Leave"),
        leaveType: yup
          .string()
          .oneOf([
            "Casual Leave",
            "Earned Leave",
            "Medical Leave",
            "On leave other than Casual Leave",
            "Other",
          ])
          .nullable(),
        specify: yup.string().nullable(),
        remarks: yup.string().nullable(),
      }),
    )
    .default([]),

  // ================= QUALIFICATIONS =================
  detailedQualifications: yup
    .array()
    .of(
      yup.object({
        qualification: yup.string().nullable(),
        institution: yup.string().nullable(),
        subjects: yup.string().nullable(),
        marksObtained: yup.string().nullable(),
      }),
    )
    .default([]),

  // ================= TRAINING =================
  trainingPrograms: yup
    .array()
    .of(
      yup.object({
        from: dateField,
        to: dateField,
        institute: yup.string().nullable(),
        subject: yup.string().nullable(),
      }),
    )
    .default([]),

  // ================= AWARDS =================
  awards: yup
    .array()
    .of(
      yup.object({
        title: yup.string().nullable(),
        description: yup.string().nullable(),
        year: numberField,
      }),
    )
    .default([]),

  // ================= META =================
  officersNotReportedPAR: numberField,
  role: objectIdSchema,
  category: objectIdSchema,
  designation: objectIdSchema,

  propertyReturnDate: dateField,
  propertyReturnYear: numberField,

  // ================= FILES =================
  recentPhotograph: fileSchema,

  // ================= MEDICAL =================
  medicalExamination: yup
    .object({
      date: dateField,
      reportSummary: yup.string().nullable(),
      reportDocument: fileSchema,
    })
    .nullable(),

  // ================= SIGNATURE =================
  officerSignature: fileSchema,

  // ================= PERSONNEL =================
  personnelOfficer: yup
    .object({
      name: yup.string().nullable(),
      designation: yup.string().nullable(),
    })
    .nullable(),
});
