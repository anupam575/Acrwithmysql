import * as yup from "yup";

// ================= OBJECTID =================
const objectIdSchema = yup
  .string()
  .transform((v) => (v === "" ? null : v))
  .test("is-objectid", "Invalid ObjectId", (value) => {
    if (!value) return true;
    return /^[0-9a-fA-F]{24}$/.test(value);
  })
  .nullable();

const cleanString = () =>
  yup
    .string()
    .trim()
    .transform((v) => (v === "" ? null : v))
    .nullable();

const cleanNumber = () =>
  yup
    .number()
    .transform((v, o) => (o === "" ? null : Number(o)))
    .typeError("Must be a number")
    .nullable();

const cleanDate = () =>
  yup
    .date()
    .transform((v, o) => (o === "" ? null : new Date(o)))
    .nullable();

const authorityItem = yup.object({
  name: objectIdSchema,
  designation: objectIdSchema,
  department: objectIdSchema, // ✅ add this
  from: cleanDate(),
  to: cleanDate(),
});
// ================= MAIN SCHEMA =================
export const employeeSchema = yup.object({
  // ================= BASIC =================
  employeeCode: yup.string().nullable(),

  employee_name: cleanString().required("Employee name is required"),

  pay_scale: cleanString(),
  basic_pay: cleanNumber(),

  date_of_birth: cleanDate(),
  date_of_joining: cleanDate(),
  date_of_appointment: cleanDate(),
  email: yup
    .string()
    .required("Email is required")
    .trim()
    .email("Invalid email format")
    .lowercase(),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(20, "Password cannot exceed 20 characters")
    .matches(/[a-z]/, "Must contain at least one lowercase letter")
    .matches(/[A-Z]/, "Must contain at least one uppercase letter")
    .matches(/[0-9]/, "Must contain at least one number")
    .matches(/[@$!%*?&#]/, "Must contain at least one special character"),

  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),

  // ================= RELATIONS =================
  role: objectIdSchema,
  category: objectIdSchema,
  designation: objectIdSchema,
  department: objectIdSchema,

  // ================= EDUCATION =================
  educationalProfessionalQualifications: yup
    .object({
      education: yup
        .array()
        .of(
          yup.object({
            title: cleanString(),
            institution: cleanString(),
            year: cleanNumber(),
          }),
        )
        .default([]),

      professional: yup
        .array()
        .of(
          yup.object({
            title: cleanString(),
            institution: cleanString(),
            year: cleanNumber(),
          }),
        )
        .default([]),

      otherDetails: cleanString(),
    })
    .nullable(),

  // ================= TRAININGS =================
  basicTrainings: yup
    .array()
    .of(
      yup.object({
        name: cleanString(),
        institute: cleanString(),
        from: cleanDate(),
        to: cleanDate(),
      }),
    )
    .default([]),

  // ================= LEAVES =================
  basicLeaves: yup
    .array()
    .of(
      yup.object({
        type: cleanString(),
        reason: cleanString(),
        remarks: cleanString(),
        from: cleanDate(),
        to: cleanDate(),
      }),
    )
    .default([]),

  // ================= AUTHORITIES (IMPORTANT FIX) =================
  authorities: yup
    .object({
      reporting: yup.array().of(authorityItem).default([]),
      reviewing: yup.array().of(authorityItem).default([]),
      accepting: yup.array().of(authorityItem).default([]),
    })
    .nullable(),
});

// ================= UPDATE EMPLOYEE SCHEMA =================
export const updateEmployeeDetailSchema = yup.object({
  // ================= BASIC =================

  employeeCode: yup.string().nullable(),

  employee_name: cleanString().required("Employee name is required"),

  pay_scale: cleanString(),

  basic_pay: cleanNumber(),

  date_of_birth: cleanDate(),

  date_of_joining: cleanDate(),

  date_of_appointment: cleanDate(),

  email: yup
    .string()
    .required("Email is required")
    .trim()
    .email("Invalid email format")
    .lowercase(),

  // ================= RELATIONS =================

  role: objectIdSchema,

  category: objectIdSchema,

  designation: objectIdSchema,
  department: objectIdSchema,

  // ================= EDUCATION =================

  educationalProfessionalQualifications: yup
    .object({
      education: yup
        .array()
        .of(
          yup.object({
            title: cleanString(),
            institution: cleanString(),
            year: cleanNumber(),
          }),
        )
        .default([]),

      professional: yup
        .array()
        .of(
          yup.object({
            title: cleanString(),
            institution: cleanString(),
            year: cleanNumber(),
          }),
        )
        .default([]),

      otherDetails: cleanString(),
    })
    .nullable(),

  // ================= TRAININGS =================

  basicTrainings: yup
    .array()
    .of(
      yup.object({
        name: cleanString(),
        institute: cleanString(),
        from: cleanDate(),
        to: cleanDate(),
      }),
    )
    .default([]),

  // ================= LEAVES =================

  basicLeaves: yup
    .array()
    .of(
      yup.object({
        type: cleanString(),
        reason: cleanString(),
        remarks: cleanString(),
        from: cleanDate(),
        to: cleanDate(),
      }),
    )
    .default([]),

  // ================= AUTHORITIES =================

  authorities: yup
    .object({
      reporting: yup.array().of(authorityItem).default([]),

      reviewing: yup.array().of(authorityItem).default([]),

      accepting: yup.array().of(authorityItem).default([]),
    })
    .nullable(),
});
