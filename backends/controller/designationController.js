
import { randomBytes } from "node:crypto";
import { prisma } from "../config/database.js";

// =============================================
// PRISMA MODEL
// =============================================
const db = prisma.designations;

// =============================================
// HELPER FUNCTIONS
// =============================================

// Generate MongoDB-compatible 24-character ID
const newId = () => randomBytes(12).toString("hex");

// Validate MongoDB-compatible ID
const validId = (id) =>
  typeof id === "string" &&
  /^[a-fA-F0-9]{24}$/.test(id);

// Preserve _id in API responses
const withMongoId = (record) =>
  record ? { ...record, _id: record.id } : record;

// Case-insensitive name comparison
const sameName = (a, b) =>
  String(a || "").trim().toLowerCase() ===
  String(b || "").trim().toLowerCase();

// Designation name validation
const nameRegex = /^[A-Za-z]+(?:\s[A-Za-z]+)*$/;

// Common error handler
const errorResponse = (res, error) => {
  console.error("Designation Controller Error:", error);

  return res.status(500).json({
    success: false,
    message: error.message || "Internal server error",
  });
};

// =============================================
// CREATE DESIGNATION
// =============================================
export const createDesignation = async (req, res) => {
  try {
    let { name } = req.body || {};

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Designation name is required",
      });
    }

    name = name.trim();

    if (!nameRegex.test(name)) {
      return res.status(400).json({
        success: false,
        message: "Only letters and single spaces allowed",
      });
    }

    const existing = await db.findMany({
      select: {
        name: true,
      },
    });

    const duplicate = existing.some((item) =>
      sameName(item.name, name)
    );

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "Designation already exists",
      });
    }

    const designation = await db.create({
      data: {
        id: newId(),
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Designation created successfully",
      designation: withMongoId(designation),
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

// =============================================
// UPDATE DESIGNATION
// =============================================
export const updateDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    let { name } = req.body || {};

    if (!validId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Designation ID",
      });
    }

    const existingDesignation = await db.findUnique({
      where: { id },
    });

    if (!existingDesignation) {
      return res.status(404).json({
        success: false,
        message: "Designation not found",
      });
    }

    if (typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Designation name is required",
      });
    }

    name = name.trim();

    if (!nameRegex.test(name)) {
      return res.status(400).json({
        success: false,
        message: "Only letters and single spaces allowed",
      });
    }

    if (sameName(name, existingDesignation.name)) {
      return res.status(400).json({
        success: false,
        message: "New name must be different",
      });
    }

    const existing = await db.findMany({
      where: {
        id: { not: id },
      },
      select: {
        name: true,
      },
    });

    const duplicate = existing.some((item) =>
      sameName(item.name, name)
    );

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: "Designation already exists",
      });
    }

    const designation = await db.update({
      where: { id },
      data: {
        name,
        updatedAt: new Date(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Designation updated successfully",
      designation: withMongoId(designation),
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

// =============================================
// GET ALL DESIGNATIONS
// =============================================
export const getDesignations = async (req, res) => {
  try {
    const designations = await db.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      count: designations.length,
      designations: designations.map(withMongoId),
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

// =============================================
// GET DESIGNATION BY ID
// =============================================
export const getDesignationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Designation ID",
      });
    }

    const designation = await db.findUnique({
      where: { id },
    });

    if (!designation) {
      return res.status(404).json({
        success: false,
        message: "Designation not found",
      });
    }

    return res.status(200).json({
      success: true,
      designation: withMongoId(designation),
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};

// =============================================
// DELETE DESIGNATION
// =============================================
export const deleteDesignation = async (req, res) => {
  try {
    const { id } = req.params;

    if (!validId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Designation ID",
      });
    }

    const designation = await db.findUnique({
      where: { id },
    });

    if (!designation) {
      return res.status(404).json({
        success: false,
        message: "Designation not found",
      });
    }

    await db.delete({
      where: { id },
    });

    return res.status(200).json({
      success: true,
      message: "Designation deleted successfully",
    });
  } catch (error) {
    return errorResponse(res, error);
  }
};
