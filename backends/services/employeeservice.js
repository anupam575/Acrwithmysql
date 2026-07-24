import EmployeeDetail from "../models/EmployeeDetail.js";
import { createMasterEmployee } from "./masterEmployee.service.js";
import { updateMasterEmployee } from "./masterEmployee.service.js";
import EmployeeNew from "../models/employee.js";
import AppError from "../utils/AppError.js";
import { checkDuplicateEmployee } from "../services/masterEmployee.service.js";

const parseObject = (val) => {
  if (!val) return {};
  if (typeof val === "object") return val;

  try {
    return JSON.parse(val);
  } catch {
    return {};
  }
};

const parseJSON = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;

  try {
    return JSON.parse(val);
  } catch {
    return [];
  }
};


const buildFileObject = (file) => {
  if (!file) return null;

  return {
    url: `/uploads/${file.filename}`,
    public_id: file.filename,
    originalName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
  };
};

const buildEmployeePayload = (req, isUpdate = false) => {
  return {
    employeeCode: req.body.employeeCode?.toString().trim(),
    EmployeeName: req.body.EmployeeName?.trim(),
    dateOfBirth: req.body.dateOfBirth,
    email: req.body.email?.toLowerCase().trim(),
        phoneNumber: req.body.phoneNumber?.trim(), // ✅

    password: req.body.password,

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
    // detailedQualifications: parseJSON(req.body.detailedQualifications),
    trainingPrograms: parseJSON(req.body.trainingPrograms),
    awards: parseJSON(req.body.awards),

    officersNotReportedPAR: Number(req.body.officersNotReportedPAR || 0),
    propertyReturnDate: req.body.propertyReturnDate,
    propertyReturnYear: Number(req.body.propertyReturnYear || 0),

    // medicalExamination: {
    //   date: req.body["medicalExamination.date"],
    //   reportSummary: req.body["medicalExamination.reportSummary"] || "",
    // },

    // personnelOfficer: {
    //   name: req.body["personnelOfficer.name"] || "",
    //   designation: req.body["personnelOfficer.designation"] || "",
    // },

    role: req.body.role,
    category: req.body.category,
designations: parseJSON(req.body.designations),
    ...(isUpdate ? {} : { createdBy: req.user?._id || null }),
  };
};

export const employeeService = {
  createEmployee: async (req) => {
    const { employeeCode, email, password } = req.body;

    if (!employeeCode || !email || !password) {
      throw new AppError("employeeCode, email, password required", 400);
    }

    const normalizedEmployeeCode = employeeCode.trim();
    const normalizedEmail = email.toLowerCase().trim();


    // ⭐ SINGLE LINE MAGIC
    const employeeData = buildEmployeePayload(req);
await checkDuplicateEmployee({
  models: [EmployeeDetail, EmployeeNew],
  employeeCode: normalizedEmployeeCode,
  email: normalizedEmail,
  phoneNumber: employeeData.phoneNumber,
});
    // FILES
    employeeData.recentPhotograph = buildFileObject(
      req.files?.recentPhotograph?.[0]
    );

    employeeData.officerSignature = buildFileObject(
      req.files?.officerSignature?.[0]
    );

    // employeeData.medicalExamination = employeeData.medicalExamination || {};
    // employeeData.medicalExamination.reportDocument = buildFileObject(
    //   req.files?.medicalExamination?.[0] || req.files?.reportDocument?.[0]
    // );

    const employee = await EmployeeDetail.create(employeeData);

    await createMasterEmployee({
      employeeRefId: employee._id,
      sourceModel: "EmployeeDetail",
      employeeCode: employee.employeeCode,
      email: employee.email,
  phoneNumber: employee.phoneNumber, // ✅

      password: employee.password,
      category: employee.category,
  designations: employee.designations,
      role: employee.role,
      authorities: employee.authorities || {},
    });

    const safeEmployee = employee.toObject();
    delete safeEmployee.password;
    delete safeEmployee.refreshToken;

    return safeEmployee;
  },
};


export const updateemployeeService = {
  updateEmployee: async (req) => {
    const { id } = req.params;

    // =========================================
    // 1️⃣ FIND EMPLOYEE
    // =========================================
    const existingEmployee = await EmployeeDetail.findById(id);

    if (!existingEmployee) {
      throw new AppError("Employee Detail not found", 404);
    }

    // =========================================
    // 2️⃣ BUILD PAYLOAD (REUSABLE FUNCTION)
    // =========================================
    const employeeData = buildEmployeePayload(req, true);

    // =========================================
    // 3️⃣ NORMALIZE (ONLY FOR CHECK)
    // =========================================
    const normalizedEmployeeCode =
      employeeData.employeeCode?.toString().trim();

    const normalizedEmail =
      employeeData.email?.toLowerCase().trim();

    // =========================================
    // 4️⃣ DUPLICATE CHECK
    // =========================================
  await checkDuplicateEmployee({
  models: [EmployeeDetail, EmployeeNew],
  employeeCode: normalizedEmployeeCode,
  email: normalizedEmail,
  phoneNumber: employeeData.phoneNumber, // ✅ ADD
  excludeId: id,
});
    // =========================================
    // 5️⃣ FILE UPDATE (SAFE OVERRIDE)
    // =========================================
    employeeData.recentPhotograph = req.files?.recentPhotograph?.[0]
      ? buildFileObject(req.files.recentPhotograph[0])
      : existingEmployee.recentPhotograph;

    employeeData.officerSignature = req.files?.officerSignature?.[0]
      ? buildFileObject(req.files.officerSignature[0])
      : existingEmployee.officerSignature;

    // =========================================
    // 6️⃣ UPDATE EMPLOYEE
    // =========================================
    const updatedEmployee = await EmployeeDetail.findByIdAndUpdate(
      id,
      { $set: employeeData },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    // =========================================
    // 7️⃣ MASTER SYNC (SAFE + CONSISTENT)
    // =========================================
    await updateMasterEmployee({
      employeeRefId: updatedEmployee._id,
      sourceModel: "EmployeeDetail",

      employeeCode: updatedEmployee.employeeCode,
      email: updatedEmployee.email,
      password: updatedEmployee.password,
  phoneNumber: updatedEmployee.phoneNumber, // ✅ ADD THIS

      category: updatedEmployee.category,
  designations: updatedEmployee.designations,
      role: updatedEmployee.role,

      authorities: updatedEmployee.authorities || {},
    });

    // =========================================
    // 8️⃣ SAFE RESPONSE
    // =========================================
    const safeEmployee = updatedEmployee.toObject();
    delete safeEmployee.password;
    delete safeEmployee.refreshToken;

    return safeEmployee;
  },
};

const buildBasicEmployeePayload = (body, userId = null, isUpdate = false) => {
  const toDate = (v) => (v ? new Date(v) : null);
const mapAuthority = (arr = []) =>
  (arr || []).map((i) => ({
    name: i.name || null,
    designation: i.designation || null,
    department: i.department || null,   // ✅ ADD THIS
    from: i.from ? new Date(i.from) : null,
    to: i.to ? new Date(i.to) : null,
  }));

  return {
    employeeCode: body.employeeCode?.toString().trim(),
    employee_name: body.employee_name,
    pay_scale: body.pay_scale,
    basic_pay: body.basic_pay,
    phoneNumber: body.phoneNumber?.trim(),


    date_of_birth: toDate(body.date_of_birth),
    date_of_joining: toDate(body.date_of_joining),
    date_of_appointment: toDate(body.date_of_appointment),

    email: body.email?.toLowerCase().trim(),
    password: body.password,

    educationalProfessionalQualifications: {
      education: body.educationalProfessionalQualifications?.education || [],
      professional:
        body.educationalProfessionalQualifications?.professional || [],
      otherDetails:
        body.educationalProfessionalQualifications?.otherDetails || "",
    },

    basicTrainings: (body.basicTrainings || []).map((t) => ({
      name: t.name,
      institute: t.institute,
      from: toDate(t.from),
      to: toDate(t.to),
    })),

    basicLeaves: (body.basicLeaves || []).map((l) => ({
      type: l.type,
      reason: l.reason,
      remarks: l.remarks,
      from: toDate(l.from),
      to: toDate(l.to),
    })),

    authorities: {
      reporting: mapAuthority(body.authorities?.reporting),
      reviewing: mapAuthority(body.authorities?.reviewing),
      accepting: mapAuthority(body.authorities?.accepting),
    },

    role: body.role || null,
    category: body.category || null,
designations: body.designations || [],
    ...(isUpdate
      ? { updatedBy: userId || null }
      : { createdBy: userId || null, updatedBy: userId || null }),
  };
};

export const basicemployeeService = {
  async createEmployee({ body, userId }) {
    const normalizedEmail = body.email?.toLowerCase().trim();
    const employeeCode = body.employeeCode?.toString().trim();

    if (!employeeCode || !normalizedEmail || !body.password) {
      throw new AppError("employeeCode, email, password required", 400);
    }

   
    // ⭐ REUSABLE FUNCTION USED
    const payload = buildBasicEmployeePayload(body, userId, false);
 await checkDuplicateEmployee({
      models: [EmployeeNew, EmployeeDetail],
      employeeCode,
      email: normalizedEmail,
        phoneNumber: payload.phoneNumber,

    });

    const employee = await EmployeeNew.create(payload);

    await createMasterEmployee({
      employeeRefId: employee._id,
      sourceModel: "EmployeeNew",
      employeeCode: employee.employeeCode,
      email: employee.email,
      password: employee.password,
        phoneNumber: employee.phoneNumber, // ✅

      category: employee.category,
  designations: employee.designations,
      role: employee.role,
      authorities: employee.authorities || {},
    });

    return employee;
  },
};




export const updatebasicemployeeService = {
  async updateEmployee({ employeeId, body, userId }) {
    const employee = await EmployeeNew.findById(employeeId);

    if (!employee) {
      throw new AppError("Employee not found", 404);
    }

    const normalizedEmail = body.email?.toLowerCase().trim();
    const employeeCode = body.employeeCode?.toString().trim();


    // ⭐ REUSE COMMON FUNCTION (ONLY THIS LINE REPLACES WHOLE PAYLOAD)
    const payload = buildBasicEmployeePayload(body, userId, true);

    await checkDuplicateEmployee({
      models: [EmployeeDetail, EmployeeNew],
      employeeCode,
      email: normalizedEmail,
      excludeId: employeeId,
        phoneNumber: payload.phoneNumber, // ✅

    });
    const updatedEmployee = await EmployeeNew.findByIdAndUpdate(
      employeeId,
      { $set: payload },
      {
        new: true,
        runValidators: true,
        context: "query",
      }
    );

    await updateMasterEmployee({
      employeeRefId: updatedEmployee._id,
      sourceModel: "EmployeeNew",
      employeeCode: updatedEmployee.employeeCode,
      email: updatedEmployee.email,
        phoneNumber: updatedEmployee.phoneNumber, // ✅

      password: updatedEmployee.password,
      category: updatedEmployee.category,
  designations: updatedEmployee.designations,
      role: updatedEmployee.role,
      authorities: updatedEmployee.authorities || {},
    });

    return updatedEmployee;
  },
};