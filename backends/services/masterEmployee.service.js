import MasterEmployee from "../models/MasterEmployee.js";
import AppError from "../utils/AppError.js";
export const createMasterEmployee = async ({
  employeeRefId,
  sourceModel,
  employeeCode,
  email,
    phoneNumber, // ✅ Add this

  password,
  role = null,
  category = null,
  designations = null,
  authorities = {},
}) => {
  try {
    const normalizedCode = employeeCode?.toString().trim();
    const normalizedEmail = email?.toLowerCase().trim();
const normalizedPhone = phoneNumber?.trim();
    // ================= VALIDATION =================
    if (!employeeRefId) throw new AppError("employeeRefId is required", 400);
    if (!sourceModel) throw new AppError("sourceModel is required", 400);
    if (!normalizedCode) throw new AppError("employeeCode is required", 400);
    if (!normalizedEmail) throw new AppError("email is required", 400);

    // ================= FIND EXISTING =================
    const existing = await MasterEmployee.findOne({ employeeRefId });

    // ================= DUPLICATE CHECK =================
    await checkDuplicateEmployee({
  models: [MasterEmployee],
  employeeCode: normalizedCode,
  email: normalizedEmail,
  phoneNumber: normalizedPhone,
  excludeId: existing?._id,
});
    const normalizedAuthorities = {
      reporting: authorities?.reporting || [],
      reviewing: authorities?.reviewing || [],
      accepting: authorities?.accepting || [],
    };

    // ================= UPSERT =================
    const result = await MasterEmployee.findOneAndUpdate(
      { employeeRefId },
      {
        $set: {
          employeeRefId,
          sourceModel,
          employeeCode: normalizedCode,
          email: normalizedEmail,
          password,
          role,
            phoneNumber: normalizedPhone, // ✅ Add this

          category,
          designations,
          authorities: normalizedAuthorities,
        },
      },
      {
        upsert: true,
        new: true,
        runValidators: true,
        setDefaultsOnInsert: true,
      }
    );

    return result;
  } catch (error) {
    throw error instanceof AppError
      ? error
      : new AppError(error.message || "Master employee error", 500);
  }
};


export const updateMasterEmployee = async ({
  employeeRefId,
  employeeCode,
  email,
  password,
  role,
  category,
    phoneNumber, // ✅ Add

  designations,
  sourceModel,
  authorities,
}) => {
  try {
    if (!employeeRefId) {
      throw new AppError("employeeRefId is required", 400);
    }

    const current = await MasterEmployee.findOne({ employeeRefId });

    if (!current) {
      throw new AppError("MasterEmployee not found", 404);
    }

    const normalizedCode = employeeCode?.toString().trim();
    const normalizedEmail = email?.toLowerCase().trim();
const normalizedPhone = phoneNumber?.trim();
    await checkDuplicateEmployee({
  models: [MasterEmployee],
  employeeCode: normalizedCode,
  email: normalizedEmail,
  phoneNumber: normalizedPhone,
  excludeId: current._id,
});

    if (sourceModel !== undefined) {
      current.sourceModel = sourceModel;
    }

    if (normalizedCode) {
      current.employeeCode = normalizedCode;
    }

    if (normalizedEmail) {
      current.email = normalizedEmail;
    }

    if (password !== undefined) {
      current.password = password;
    }

    if (role !== undefined) {
      current.role = role;
    }

    if (category !== undefined) {
      current.category = category;
    }
if (designations !== undefined) {
  current.designations = designations;
}
if (normalizedPhone) {
  current.phoneNumber = normalizedPhone;
}
    // =========================
    // AUTHORITIES UPDATE (IMPORTANT ADD)
    // =========================
    if (authorities !== undefined) {
      current.authorities = {
        reporting:
          authorities?.reporting?.map((item) => ({
            name: item.name || null,
            designation: item.designation || null,
            from: item.from || null,
            to: item.to || null,
          })) || [],

        reviewing:
          authorities?.reviewing?.map((item) => ({
            name: item.name || null,
            designation: item.designation || null,
            from: item.from || null,
            to: item.to || null,
          })) || [],

        accepting:
          authorities?.accepting?.map((item) => ({
            name: item.name || null,
            designation: item.designation || null,
            from: item.from || null,
            to: item.to || null,
          })) || [],
      };
    }

    await current.save();

    return current;
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern || {})[0];
      const value = error.keyValue?.[field];

      throw new AppError(`${field} '${value}' already exists`, 409);
    }

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(
      error.message || "Master employee update failed",
      500
    );
  }
};

export const checkDuplicateEmployee = async ({
  models = [],
  employeeCode,
  email,
    phoneNumber,

  
  excludeId = null,
}) => {
  const code = employeeCode?.toString().trim();
  const mail = email?.toLowerCase().trim();
const phone = phoneNumber?.trim();
  const orConditions = [];

  if (code) orConditions.push({ employeeCode: code });
  if (mail) orConditions.push({ email: mail });
if (phone) orConditions.push({ phoneNumber: phone });
  if (!orConditions.length) return;

  const query = { $or: orConditions };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  for (const model of models) {
    const exists = await model.findOne(query).lean();

    if (exists) {
      const messages = {
        employeeCode: "EmployeeCode already exists",
        email: "Email already exists",
          phoneNumber: "Phone number already exists",

      };

      let field = null;

      if (exists.employeeCode === code) field = "employeeCode";
      if (exists.email === mail) field = "email";
if (exists.phoneNumber === phone) field = "phoneNumber";
      throw new AppError(
        `${messages[field] || "Duplicate entry found"} in ${model.modelName}`,
        409
      );
    }
  }
};