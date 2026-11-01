
import { randomBytes } from "node:crypto";
import { prisma } from "../config/database.js";

// ==========================================
// PRISMA MODEL
// ==========================================
const db = prisma.departments;

// ==========================================
// HELPER FUNCTIONS
// ==========================================

// Generate MongoDB-compatible 24-character ID
const newId = () => randomBytes(12).toString("hex");

// Validate MongoDB-compatible ID
const validId = (id) =>
  typeof id === "string" &&
  /^[a-fA-F0-9]{24}$/.test(id);

// Preserve MongoDB-style _id in API responses
const withMongoId = (record) =>
  record ? { ...record, _id: record.id } : record;

// Case-insensitive department name comparison
const sameName = (a, b) =>
  String(a || "").trim().toLowerCase() ===
  String(b || "").trim().toLowerCase();

// Common error handler
const errorResponse = (res, error) => {
  console.error("Department Controller Error:", error);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

// ==========================================
// CREATE DEPARTMENT
// ==========================================
export const createDepartment = async (req, res) => {
  try {
    let { department_name } = req.body || {};

    if (
      typeof department_name !== "string" ||
      !department_name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Department name is required",
      });
    }

    department_name = department_name.trim();

    const existingDepartments = await db.findMany({
      select: {
        department_name: true,
      },
    });

    const duplicate = existingDepartments.some((item) =>
      sameName(item.department_name, department_name)
    );

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "Department already exists",
      });
    }

    const department = await db.create({
      data: {
        id: newId(),
        department_name,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Department created successfully",
      department: withMongoId(department),
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

// ==========================================
// UPDATE DEPARTMENT
// ==========================================
export const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    let { department_name } = req.body || {};

    if (!validId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Department ID",
      });
    }

    const existingDepartment = await db.findUnique({
      where: { id },
    });

    if (!existingDepartment) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    if (
      typeof department_name !== "string" ||
      !department_name.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Department name is required",
      });
    }

    department_name = department_name.trim();

    if (
      sameName(
        existingDepartment.department_name,
        department_name
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "New department name must be different",
      });
    }

    const otherDepartments = await db.findMany({
      where: {
        id: { not: id },
      },
      select: {
        department_name: true,
      },
    });

    const duplicate = otherDepartments.some((item) =>
      sameName(item.department_name, department_name)
    );

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "Department already exists",
      });
    }

    const department = await db.update({
      where: { id },
      data: {
        department_name,
        updatedAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Department updated successfully",
      department: withMongoId(department),
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

// ==========================================
// GET ALL DEPARTMENTS
// ==========================================
export const getDepartments = async (req, res) => {
  try {
    const departments = await db.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: departments.length,
      departments: departments.map(withMongoId),
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

// ==========================================
// GET DEPARTMENT BY ID
// ==========================================
export const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Department ID",
      });
    }

    const department = await db.findUnique({
      where: { id },
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      department: withMongoId(department),
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

// ==========================================
// DELETE DEPARTMENT
// ==========================================
export const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Department ID",
      });
    }

    const department = await db.findUnique({
      where: { id },
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    await db.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

// ==========================================
// GET DEPARTMENT COUNT
// ==========================================
export const getDepartmentCount = async (req, res) => {
  try {
    const totalDepartments = await db.count();

    return res.status(200).json({
      success: true,
      totalDepartments,
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};
