// controllers/selfAppraisalController.js
import mongoose from "mongoose";

import SelfAppraisal from "../models/apprisalModel.js";
// ================= NORMALIZE FUNCTION =================

import MasterEmployee from "../models/MasterEmployee.js";

import User from "../models/userModel.js";
import Role from "../models/roleModel.js";
import Department from "../models/departmentModel.js";

export const normalizeSelfAppraisalData = async ({ body, employeeId }) => {
  const toBool = (v) => v === true || v === "true" || v === "yes";
  const toNumber = (v, fallback = 0) => {
    const n = Number(v);
    return isNaN(n) ? fallback : n;
  };

  const employee = await MasterEmployee.findOne({
    employeeRefId: employeeId,
  })
    .select("category")
    .lean();

  if (!employee) throw new Error("Employee not found");

  const safeTasks = Array.isArray(body.tasks)
    ? body.tasks.map((t) => ({
        taskName: t.taskName || "",
        weightage: toNumber(t.weightage),
        deliverables: t.deliverables || "",
        achievement: t.achievement || "",
      }))
    : [];

  const taskTotal = safeTasks.reduce(
    (sum, t) => sum + (t.weightage || 0),
    0
  );

  const mouWeightage = toNumber(body.mouWeightage);

  return {
    employeeId,
    category: employee.category || null,

    currentFinancialYear:
      body.currentFinancialYear || body.financialYear, // ✅ FIXED

    department: body.department || null, // ✅ IMPORTANT FIX

    reportingOfficerId: body.reportingOfficerId,

    responsibilities: body.responsibilities,

    mouWeightage,
    totalTaskWeightage: toNumber(body.totalTaskWeightage),

    mouDeliverables: body.mouDeliverables,
    mouAchievement: body.mouAchievement,

    tasks: safeTasks,

    calculatedTotalTaskWeightage: taskTotal,
    calculatedGrandTotal: mouWeightage + taskTotal,

    exceptionalContribution: body.exceptionalContribution,
    constraints: body.constraints,
    currentAssignmentTraining: body.currentAssignmentTraining,
    futureCareerTraining: body.futureCareerTraining,

    immovablePropertyReturnFiled: toBool(body.immovablePropertyReturnFiled),
    medicalCheckupDone: toBool(body.medicalCheckupDone),
    annualWorkPlanSetForOfficers: toBool(body.annualWorkPlanSetForOfficers),

    immovablePropertyReturnDate: body.immovablePropertyReturnDate || null,
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

export const createSelfAppraisal = async (req, res) => {
  try {
    console.log("🔥 BODY:", req.body);
    console.log("📁 FILES:", req.files);

    const employeeId = req.employeeRefId;

    if (!employeeId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    // ================= SAFE JSON PARSE FOR FORMDATA =================
    const parseIfJson = (value) => {
      try {
        return JSON.parse(value);
      } catch {
        return value;
      }
    };

    const parsedBody = {};
    for (const key in req.body) {
      parsedBody[key] = parseIfJson(req.body[key]);
    }

    // ================= NORMALIZE DATA =================
    const normalizedData = await normalizeSelfAppraisalData({
      body: parsedBody,
      employeeId,
    });

    console.log("🔥 FINAL NORMALIZED DATA:", normalizedData);

    // ================= ATTACH FILE =================
    normalizedData.officerSignature = buildFileObject(
      req.files?.officerSignature?.[0]
    );

    // ================= DUPLICATE CHECK =================
    const alreadyExists = await SelfAppraisal.findOne({
      employeeId,
      reportingOfficerId: normalizedData.reportingOfficerId,
      currentFinancialYear: normalizedData.currentFinancialYear,
    });

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message:
          "Already submitted for this reporting officer this year",
      });
    }

    // ================= CREATE =================
    const created = await SelfAppraisal.create(normalizedData);

    console.log("✅ SAVED:", created);

    return res.status(201).json({
      success: true,
      message: "Created Successfully",
      data: created,
    });

  } catch (error) {
    console.log("❌ ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getAllSelfAppraisals = async (req, res) => {
  try {
    const employeeId = req.employeeRefId;

    if (!employeeId) {
      return res.status(401).json({
        success: false,
        message: "Employee not found",
      });
    }

    // ============================================
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // ============================================

    const filter = {
      employeeId: employeeId,
    };

    const totalSelfAppraisals = await SelfAppraisal.countDocuments(filter);

    const selfAppraisals = await SelfAppraisal.find(filter)
      .populate({
        path: "department",
        select: "department_name",
      })
      .populate({
        path: "reportingOfficerId",
        select: "firstName",
      })
      .populate("category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return res.status(200).json({
      success: true,
      count: selfAppraisals.length,
      totalSelfAppraisals,
      currentPage: page,
      totalPages: Math.ceil(totalSelfAppraisals / limit),
      limit,
      data: selfAppraisals,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed To Fetch Self Appraisals",
      error: error.message,
    });
  }
};
export const getSingleSelfAppraisal = async (req, res) => {
  try {
    const { id } = req.params;

    const selfAppraisal = await SelfAppraisal.findById(id);

    if (!selfAppraisal) {
      return res.status(404).json({
        success: false,
        message: "Self Appraisal Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      data: selfAppraisal,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed To Fetch Self Appraisal",
      error: error.message,
    });
  }
};

export const updateSelfAppraisal = async (req, res) => {
  try {
    const { id } = req.params;

    const existingSelfAppraisal =
      await SelfAppraisal.findById(id);

    if (!existingSelfAppraisal) {
      return res.status(404).json({
        success: false,
        message: "Self Appraisal Not Found",
      });
    }

    const normalizedData =
      await normalizeSelfAppraisalData({
        body: req.body,
        employeeId: existingSelfAppraisal.employeeId,
      });

    // Never allow updating these fields
    delete normalizedData.department;
    delete normalizedData.reportingOfficerId;

    const updatedSelfAppraisal =
      await SelfAppraisal.findByIdAndUpdate(
        id,
        normalizedData,
        {
          returnDocument: "after",
          runValidators: true,
        }
      );

    return res.status(200).json({
      success: true,
      message: "Self Appraisal Updated Successfully",
      data: updatedSelfAppraisal,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed To Update Self Appraisal",
      error: error.message,
    });
  }
};
export const deleteSelfAppraisal = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSelfAppraisal = await SelfAppraisal.findByIdAndDelete(id);

    if (!deletedSelfAppraisal) {
      return res.status(404).json({
        success: false,
        message: "Self Appraisal Not Found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Self Appraisal Deleted Successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "Failed To Delete Self Appraisal",
      error: error.message,
    });
  }
};

export const viewEmployeeDetails = async (req, res) => {
  try {
    const { employeeId } = req.params;

    const reportingOfficerId = req.user._id; // 👈 current logged-in user

    console.log("🔍 Employee ID:", employeeId);
    console.log("👤 Reporting Officer:", reportingOfficerId);

    /* ================= VALIDATION ================= */
    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Employee ID",
      });
    }

    /* =========================================
       FIND SELF APPRAISAL WITH REPORTING FILTER
    ========================================= */

    const employeeDetails = await SelfAppraisal.findOne({
      employeeId: new mongoose.Types.ObjectId(employeeId),
      reportingOfficerId: new mongoose.Types.ObjectId(reportingOfficerId), // 👈 IMPORTANT FILTER
    })
      .populate({
        path: "department",
        select: "department_name",
      })
      .populate({
        path: "reportingOfficerId",
        select: "firstName",
      })
      .populate("category")
      .sort({ createdAt: -1 })
      .lean();

    /* =========================================
       NOT FOUND / UNAUTHORIZED CASE
    ========================================= */

    if (!employeeDetails) {
      return res.status(404).json({
        success: false,
        message:
          "No appraisal found OR you are not the reporting officer for this employee",
      });
    }

    /* =========================================
       SUCCESS
    ========================================= */

    return res.status(200).json({
      success: true,
      data: employeeDetails,
    });
  } catch (error) {
    console.log("🔥 SERVER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const viewEmployeeDetail = async (req, res) => {
  try {
    const { employeeId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(employeeId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Employee ID",
      });
    }

    const appraisals = await SelfAppraisal.find({
      employeeId: new mongoose.Types.ObjectId(employeeId),
    })
      .populate({
        path: "department",
        select: "department_name",
      })
      .populate({
        path: "reportingOfficerId",
        select: "firstName",
      })
      .populate("category")
      .sort({ createdAt: -1 })
      .lean();

    if (!appraisals.length) {
      return res.status(404).json({
        success: false,
        message: "No appraisal records found",
      });
    }

    return res.status(200).json({
      success: true,
      data: appraisals,
    });
  } catch (error) {
    console.error("🔥 SERVER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getReportingOfficers = async (req, res) => {
  try {
    const employeeRefId = req.employeeRefId;

    const result = await MasterEmployee.aggregate([
      {
        $match: {
          employeeRefId: new mongoose.Types.ObjectId(employeeRefId),
        },
      },

      {
        $unwind: "$authorities.reporting",
      },

      {
        $lookup: {
          from: "users",
          localField: "authorities.reporting.name",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },

      {
        $lookup: {
          from: "departments",
          localField: "user.department",
          foreignField: "_id",
          as: "dept",
        },
      },
      {
        $unwind: {
          path: "$dept",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 🔥 IMPORTANT FIX HERE
      {
        $project: {
          _id: "$user._id",
          name: "$user.firstName",

          // ✔ proper ID for frontend + DB
          departmentId: "$dept._id",

          // ✔ readable name for UI
          department: "$dept.department_name",
        },
      },

      // remove duplicates safely
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          departmentId: { $first: "$departmentId" },
          department: { $first: "$department" },
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error("getReportingOfficers error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSupervisorFields = (body) => ({
  tasks: body.tasks,
  achievements: body.achievements,
  shortfalls: body.shortfalls,
  higherAchievements: body.higherAchievements,

  place: body.place,
  date: body.date,

  signature: body.signature,
  employeeName: body.employeeName,
  designation: body.designation,

  employeeId: body.employeeId,
  reportingOfficerId: body.reportingOfficerId,

  financialYear: body.financialYear,
  status: body.status || "draft",
});







export const viewapprisalDetails = async (req, res) => {
  try {
    const { appraisalId } = req.params;

    console.log("🔍 Appraisal ID:", appraisalId);

    /* ================= VALIDATION ================= */
    if (!mongoose.Types.ObjectId.isValid(appraisalId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Appraisal ID",
      });
    }

    /* ================= FIND APPRAISAL ONLY ================= */
    const employeeDetails = await SelfAppraisal.findOne({
      _id: new mongoose.Types.ObjectId(appraisalId),
    })
      .populate({
        path: "department",
        select: "department_name",
      })
      .populate({
        path: "reportingOfficerId",
        select: "firstName",
      })
      .populate("category")
      .lean();

    /* ================= NOT FOUND ================= */
    if (!employeeDetails) {
      return res.status(404).json({
        success: false,
        message: "No appraisal found",
      });
    }

    /* ================= SUCCESS ================= */
    return res.status(200).json({
      success: true,
      data: employeeDetails,
    });

  } catch (error) {
    console.log("🔥 SERVER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};