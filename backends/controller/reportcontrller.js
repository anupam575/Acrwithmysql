import AparModel from "../models/AparModel.js";
import mongoose from "mongoose"; // ES6 import

import PerformanceReview from "../models/performanceReviewSchema.js";
import { buildPerformanceReviewData } from "../services/performanceReview.service.js";

import User from "../models/userModel.js";
import Role from "../models/roleModel.js";
import Department from "../models/departmentModel.js";
// ======================================================
// APAR DATA NORMALIZER

// ======================================================
const normalizeAparData = (body) => {
  return {
    employeeId: body?.employeeId,

    section1: body?.section1 || "",
    section2: body?.section2 || "",
    section3: body?.section3 || "",
    section4: body?.section4 || "",
    section5: body?.section5 || "",

    // ======================================================
    // SECTION 6
    section6: (() => {
  const mouWeightage = Number(body?.section6?.mou?.weightage || 0);
  const mouReportingAbsolute = Number(body?.section6?.mou?.reportingAbsolute || 0);

  // MOU weighted (formula you used in old code)
  const mouReportingWeighted = (mouWeightage * mouReportingAbsolute) / 100;

  const tasks = (body?.section6?.tasks || []).map((task) => {
    const weightage = Number(task?.weightage || 0);
    const reportingAbsolute = Number(task?.reportingAbsolute || 0);

    const reportingWeighted = (weightage * reportingAbsolute) / 10;

    return {
      taskName: task?.taskName || "",
      weightage,
      reportingAbsolute,
      initials: task?.initials || "",
      reportingWeighted,
    };
  });

  // TASK TOTALS ONLY
const totalWeightage =
  tasks.reduce((sum, t) => sum + t.weightage, 0);

const totalReportingAbsolute =
  tasks.reduce(
    (sum, t) => sum + t.reportingAbsolute,
    0
  );

const totalReportingWeighted =
  tasks.reduce(
    (sum, t) => sum + t.reportingWeighted,
    0
  );

// GRAND TOTALS = MOU + TASKS
const grandWeightage =
  mouWeightage + totalWeightage;

const grandReportingAbsolute =
  mouReportingAbsolute + totalReportingAbsolute;

const grandReportingWeighted =
  mouReportingWeighted + totalReportingWeighted;
  return {
    mou: {
      weightage: mouWeightage,
      reportingAbsolute: mouReportingAbsolute,
      initials: body?.section6?.mou?.initials || "",
      reportingWeighted: mouReportingWeighted,
    },

    tasks,

    totalWeightage,
    totalReportingAbsolute,
    totalReportingWeighted,

    grandWeightage,
    grandReportingAbsolute,
    grandReportingWeighted,
  };
})(),
  

section7: (() => {
  const rows = [
    "Effective communication skills",
    "Strategic orientation and Decision making ability",
    "Problem solving and Analytical ability",
    "Ability to develop and motivate team members",
    "Ability to coordinate and develop collaborative partnerships",
    "Innovation and change orientation",
    "Planning and Organizing",
    "Result orientation",
    "Business Acumen",
    "Role based functional competency",
  ];

  const roman = ["i.","ii.","iii.","iv.(b)","v.(b)","vi.","vii.","viii.","ix.","x."];

  const input = Array.isArray(body?.section7) ? body.section7 : [];

  return rows.map((row, index) => {
    const item = input[index] || {};

    return {
      slNo: roman[index],
      competency: row,
      reportingAuthority: parseFloat(item?.reportingAuthority) || 0,
      initials: item?.initials || "",
    };
  });
})(),
    integrity: {
      beyondDoubt: body?.integrity?.beyondDoubt || "",

      doubtful: body?.integrity?.doubtful || "",

      nothingAdverse: body?.integrity?.nothingAdverse || "",
    },

    // ======================================================
    // SECTION 9
    // ======================================================
    penPicture: body?.penPicture || "",

    // ======================================================
    // SECTION 10
    // ======================================================
    overallGrade: Number(body?.overallGrade || 0),

    reportingDate: body?.reportingDate ? new Date(body.reportingDate) : null,

    // ======================================================
    // SIGNATURE
    // ======================================================
    signature: body?.signature || "",

    designation: body?.designation || "",
  };
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

export const createReporterApar = async (req, res) => {
  try {
    console.log("🔥 BODY:", req.body);
    console.log("📁 FILES:", req.files);

    const parseIfJson = (value) => {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    };

    // ================= NORMALIZE SAFE BODY =================
    const cleanedBody = {};
    for (const key in req.body) {
      cleanedBody[key] = parseIfJson(req.body[key]);
    }

    const normalizedData = normalizeAparData(cleanedBody);

    const section7Total = normalizedData.section7.reduce(
      (sum, item) => sum + Number(item.reportingAuthority || 0),
      0
    );

    const overallGrading = section7Total / 4;

    normalizedData.summary = {
      total: Number(section7Total.toFixed(2)),
      overall: Number(overallGrading.toFixed(2)),
    };

    const employeeId = normalizedData?.employeeId;
    const reportingOfficerId = req.user?._id;

    // ================= VALIDATION =================
    if (!employeeId) {
      return res.status(400).json({
        success: false,
        message: "employeeId is required",
      });
    }

    if (!reportingOfficerId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: reporting officer not found",
      });
    }

    // ================= FINANCIAL YEAR =================
    const getFinancialYear = () => {
      const today = new Date();
      const year = today.getFullYear();
      const month = today.getMonth() + 1;

      return month >= 4
        ? `${year}-${year + 1}`
        : `${year - 1}-${year}`;
    };

    const financialYear = getFinancialYear();

    // ================= DUPLICATE CHECK =================
    const existing = await AparModel.findOne({
      employeeId,
      reportingOfficerId,
      financialYear,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          "APAR already exists for this employee in current financial year",
      });
    }

    // ================= FILE ATTACHMENT (FIXED) =================
    normalizedData.officerSignature = buildFileObject(
      req.files?.officerSignature?.[0]
    );

    // ================= CREATE =================
    const apar = await AparModel.create({
      ...normalizedData,
      employeeId,
      reportingOfficerId,
      financialYear,
    });

    return res.status(201).json({
      success: true,
      message: "APAR created successfully",
      data: apar,
    });

  } catch (error) {
    console.error("APAR CREATE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create APAR",
      error: error.message,
    });
  }
};

export const getReportByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employeeId format",
      });
    }

    const reports = await AparModel.find({
      employeeId: new mongoose.Types.ObjectId(employeeId),
    })
      .populate({
        path: "reportingOfficerId",
        select:
          "firstName lastName employeeCode designation department",
        populate: {
          path: "department",
          select: "department_name",
        },
      });

    return res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};


export const createPerformanceReview = async (req, res) => {
  try {
    const { employeeId } = req.body;

    const reportingOfficerId = req.user?._id;

    // Current Financial Year
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    const currentFinancialYear =
      currentMonth >= 4
        ? `${currentYear}-${currentYear + 1}`
        : `${currentYear - 1}-${currentYear}`;

    // Duplicate check
    const existing = await PerformanceReview.findOne({
      employeeId,
      reportingOfficerId,
      currentFinancialYear,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message:
          "Performance Review already exists for this employee in the current financial year.",
      });
    }

    // Build review data
    const reviewData = buildPerformanceReviewData(req.body);

    // Add Reporting Officer
    reviewData.reportingOfficerId = reportingOfficerId;

    // Add Signature
    reviewData.officerSignature = buildFileObject(
      req.files?.officerSignature?.[0]
    );

    // Save
    const review = await PerformanceReview.create(reviewData);

    return res.status(201).json({
      success: true,
      message: "Performance Review created successfully.",
      data: review,
    });
  } catch (error) {
    console.error("Create Performance Review Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};







export const getsupByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid employeeId format",
      });
    }

    const reports = await PerformanceReview.find({
      employeeId: new mongoose.Types.ObjectId(employeeId),
    })
      .populate({
        path: "reportingOfficerId",
        select:
          "firstName lastName employeeCode designation department",
        populate: {
          path: "department",
          select: "department_name",
        },
      });

    return res.status(200).json({
      success: true,
      count: reports.length,
      data: reports,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};