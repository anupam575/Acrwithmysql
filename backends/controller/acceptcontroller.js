import mongoose from "mongoose"; // ES6 import
import AcceptanceSection from "../models/AcceptanceSection.js";
import AcceptingAuthority from "../models/supaccpt.js"
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
const getCurrentFinancialYear = () => {
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;

  return month >= 4
    ? `${year}-${year + 1}`
    : `${year - 1}-${year}`;
};
export const createAcceptanceSection = async (req, res) => {
  try {
    console.log("🔥 BODY:", req.body);
    console.log("📁 FILES:", req.files);

    const {
      overallGradeConsistent,
      agreeWithRemarks,
      differenceOpinion = "",
      overallGrade,
      acceptingAuthorityNameDesignation,
      currentFinancialYear,
      employeeId,
    } = req.body;

    const reviewingOfficerId = req.user?._id;

    // Signature File
    const officerSignature = buildFileObject(
      req.files?.officerSignature?.[0]
    );

    // Financial Year
    const financialYear =
      currentFinancialYear ||
      (() => {
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;

        return month >= 4
          ? `${year}-${year + 1}`
          : `${year - 1}-${year}`;
      })();

    // Validation
    if (
      !employeeId ||
      !reviewingOfficerId ||
      !financialYear ||
      !overallGradeConsistent ||
      !agreeWithRemarks ||
      overallGrade === undefined ||
      overallGrade === null ||
      !acceptingAuthorityNameDesignation ||
      !officerSignature
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Duplicate Check
    const existingRecord = await AcceptanceSection.findOne({
      employeeId,
      reviewingOfficerId,
      currentFinancialYear: financialYear,
    });

    if (existingRecord) {
      return res.status(409).json({
        success: false,
        message:
          "Acceptance Section already exists for this employee and financial year",
      });
    }

    // Save
    const data = await AcceptanceSection.create({
      employeeId,
      reviewingOfficerId,
      currentFinancialYear: financialYear,
      overallGradeConsistent,
      agreeWithRemarks,
      differenceOpinion,
      overallGrade: Number(overallGrade),
      acceptingAuthorityNameDesignation,

      // ✅ Schema field name
      officerSignature,
    });

    return res.status(201).json({
      success: true,
      message: "Acceptance section saved successfully",
      data,
    });
  } catch (error) {
    console.error("Acceptance Section Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getEmployeeAcceptanceData = async (req, res) => {
  try {
    const employeeId = req.employeeRefId;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID not found in token",
      });
    }

    // 🔥 DIRECT QUERY (NO POPULATE)
    const data = await AcceptanceSection.find({
      employeeId: new mongoose.Types.ObjectId(employeeId),
    }).sort({ createdAt: -1 });

    if (!data || data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No acceptance data found for this employee",
      });
    }

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });

  } catch (error) {
    console.error("Acceptance API Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};







export const getEmployeeAcceptanceid = async (req, res) => {
  try {
    // Employee ID from params
    const { employeeId } = req.params;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Employee ID",
      });
    }

    const data = await AcceptanceSection.find({
      employeeId: new mongoose.Types.ObjectId(employeeId),
    }).sort({ createdAt: -1 });

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No acceptance data found for this employee",
      });
    }

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Acceptance API Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const createAcceptingAuthority = async (req, res) => {
  try {
    // Uploaded Signature
    const officerSignature =
      req.files?.officerSignature?.[0] || null;

    // Logged-in User
    const acceptingAuthorityId = req.user?._id;

    // Current Financial Year
    const currentFinancialYear =
      getCurrentFinancialYear();

    // Validation
    if (!req.body.employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required.",
      });
    }

    // Duplicate Check
    const existingRecord =
      await AcceptingAuthority.findOne({
        employeeId: req.body.employeeId,
        acceptingAuthorityId,
        currentFinancialYear,
      });

    if (existingRecord) {
      return res.status(409).json({
        success: false,
        message:
          "Accepting Authority record already exists for this employee and financial year.",
      });
    }

    // Create
    const acceptingAuthority =
      await AcceptingAuthority.create({
        employeeId: req.body.employeeId,

        acceptingAuthorityId,

        currentFinancialYear,

        acceptingAssessment:
          req.body.acceptingAssessment || "",

        acceptingRemarks:
          req.body.acceptingRemarks || "",

        acceptingTotalScore:
          req.body.acceptingTotalScore !== ""
            ? Number(req.body.acceptingTotalScore)
            : null,

        acceptingPlace:
          req.body.acceptingPlace || "",

        acceptingDate:
          req.body.acceptingDate || null,

        acceptingName:
          req.body.acceptingName || "",

        acceptingDesignation:
          req.body.acceptingDesignation || "",

        officerSignature:
          buildFileObject(officerSignature),
      });

    return res.status(201).json({
      success: true,
      message:
        "Accepting Authority created successfully.",
      data: acceptingAuthority,
    });

  } catch (error) {
    console.error(
      "Create Accepting Authority Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to create Accepting Authority.",
      error: error.message,
    });
  }
};




export const getEmployeeAcceptance = async (req, res) => {
  try {
    // Employee ID from params
    const { employeeId } = req.params;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Employee ID",
      });
    }

    const data = await AcceptingAuthority.find({
      employeeId: new mongoose.Types.ObjectId(employeeId),
    }).sort({ createdAt: -1 });

    if (data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No acceptance data found for this employee",
      });
    }

    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    console.error("Acceptance API Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
