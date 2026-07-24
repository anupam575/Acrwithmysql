import SectionIV from "../models/reviewModel.js";
import ReviewingOfficer from "../models/supreve.js";

import mongoose from "mongoose";

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

export const createSectionIVController = async (req, res) => {
  try {
    console.log("🔥 BODY:", req.body);
    console.log("📁 FILES:", req.files);

    const {
      currentFinancialYear,
      assessmentAgree1,
      assessmentAgree2,
      differenceReason = "",
      penPictureComments = "",
      overallGrade = 0,
      nameDesignation,
      employeeId,
    } = req.body;

    const reviewingOfficerId = req.user?._id;

    // ================= FILE =================
    const officerSignature = buildFileObject(
      req.files?.officerSignature?.[0]
    );

    // ================= VALIDATION =================
    if (
      !employeeId ||
      !reviewingOfficerId ||
      !currentFinancialYear ||
      !assessmentAgree1 ||
      !assessmentAgree2 ||
      !officerSignature ||   // ✅ FIXED
      !nameDesignation
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // ================= DUPLICATE CHECK =================
    const existingRecord = await SectionIV.findOne({
      employeeId,
      reviewingOfficerId,
      currentFinancialYear,
    });

    if (existingRecord) {
      return res.status(409).json({
        success: false,
        message:
          "Section IV already exists for this employee and financial year",
      });
    }

    // ================= CREATE =================
    const createdRecord = await SectionIV.create({
      employeeId,
      reviewingOfficerId,
      currentFinancialYear,
      assessmentAgree1,
      assessmentAgree2,
      differenceReason,
      penPictureComments,
      overallGrade,
      officerSignature, // ✅ FIXED
      nameDesignation,
    });

    return res.status(201).json({
      success: true,
      message: "Section IV created successfully",
      data: createdRecord,
    });

  } catch (error) {
    console.error("❌ ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getReviewByEmployeeIdController = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Employee ID",
      });
    }

    const reviews = await SectionIV.find({ employeeId })
     .populate({
        path: "reviewingOfficerId",
        select:
          "firstName lastName employeeCode designation department",
        populate: {
          path: "department",
          select: "department_name",
        },
      });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("GET REVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};



export const buildReviewingOfficerPayload = (body, file) => {
  return {
    employeeId: body.employeeId,



    reviewAssessment: body.reviewAssessment || "",

    reviewRemarks: body.reviewRemarks || "",

    reviewTotalScore:
      body.reviewTotalScore !== undefined &&
      body.reviewTotalScore !== ""
        ? Number(body.reviewTotalScore)
        : null,

    reviewPlace: body.reviewPlace || "",

    reviewDate: body.reviewDate || null,

    reviewName: body.reviewName || "",

    reviewDesignation: body.reviewDesignation || "",

    officerSignature: buildFileObject(file),
  };
};

export const createReviewingOfficer = async (req, res) => {
  try {
    const officerSignature = req.files?.officerSignature?.[0] || null;

    // Login user id
    const reviewingOfficerId = req.user?._id;

    const payload = buildReviewingOfficerPayload(
      req.body,
      officerSignature
    );

    // Current Financial Year
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const currentFinancialYear =
      currentMonth >= 4
        ? `${currentYear}-${currentYear + 1}`
        : `${currentYear - 1}-${currentYear}`;

    // Validation
    if (!payload.employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required.",
      });
    }

    console.log("===== Duplicate Check =====");
    console.log({
      employeeId: payload.employeeId,
      reviewingOfficerId,
      currentFinancialYear,
    });

    // Duplicate Check
    const existingRecord = await ReviewingOfficer.findOne({
      employeeId: new mongoose.Types.ObjectId(payload.employeeId),
      reviewingOfficerId: new mongoose.Types.ObjectId(reviewingOfficerId),
      currentFinancialYear,
    });

    console.log("Existing Record:", existingRecord);

    if (existingRecord) {
      return res.status(409).json({
        success: false,
        message:
          "Reviewing Officer record already exists for this employee and financial year.",
      });
    }

    // Create
    const reviewingOfficer = await ReviewingOfficer.create({
      ...payload,
      reviewingOfficerId,
      currentFinancialYear,
    });

    return res.status(201).json({
      success: true,
      message: "Reviewing Officer created successfully.",
      data: reviewingOfficer,
    });

  } catch (error) {
    console.error("Create Reviewing Officer Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create Reviewing Officer.",
      error: error.message,
    });
  }
};
export const getReviewByEmployeeId = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "Employee ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Employee ID",
      });
    }

    const reviews = await ReviewingOfficer.find({ employeeId })
     .populate({
        path: "reviewingOfficerId",
        select:
          "firstName lastName employeeCode designation department",
        populate: {
          path: "department",
          select: "department_name",
        },
      });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("GET REVIEW ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
